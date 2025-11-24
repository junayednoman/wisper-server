import { ChatRole, ChatType } from "@prisma/client";
import ApiError from "../../middlewares/classes/ApiError";
import prisma from "../../utils/prisma";
import { TCreateClass, TUpdateClassData } from "./class.validation";
import { TFile } from "../../interface/file.interface";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";

const createClass = async (payload: TCreateClass, authId: string) => {
  const { members, ...classPayload } = payload;
  const result = await prisma.$transaction(async tn => {
    const newClass = await tn.class.create({
      data: classPayload,
    });

    const chatPayload = {
      type: ChatType.CLASS,
      classId: newClass.id,
    };
    const newChat = await tn.chat.create({
      data: chatPayload,
    });

    const memberPayloads = [];
    for (const memberId of members) {
      const member = await prisma.auth.findUnique({
        where: {
          id: memberId,
        },
      });
      if (!member) throw new ApiError(400, `Invalid member id!: ${memberId}`);

      memberPayloads.push({
        chatId: newChat.id,
        authId: memberId,
        role: ChatRole.MEMBER,
      });
    }
    memberPayloads.push({
      chatId: newChat.id,
      authId,
      role: ChatRole.ADMIN,
    });

    await tn.chatParticipant.createMany({
      data: memberPayloads,
    });

    return newClass;
  });

  return result;
};

const getSingleClass = async (id: string) => {
  const result = await prisma.class.findUnique({
    where: {
      id,
    },
    include: {
      chat: {
        select: {
          _count: {
            select: {
              participants: true,
            },
          },
        },
      },
      recommendations: {
        select: {
          id: true,
          giver: {
            select: {
              id: true,
              person: {
                select: {
                  id: true,
                  image: true,
                },
              },
              business: {
                select: {
                  id: true,
                  image: true,
                },
              },
            },
          },
        },
        take: 3,
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          recommendations: true,
        },
      },
    },
  });
  return result;
};

const getClassMembers = async (classId: string) => {
  const members = await prisma.chatParticipant.findMany({
    where: {
      chat: {
        classId,
      },
    },
    select: {
      id: true,
      role: true,
      auth: {
        select: {
          id: true,
          person: {
            select: {
              name: true,
              image: true,
            },
          },
          business: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return members;
};

const addClassMember = async (
  classId: string,
  memberId: string,
  authId: string
) => {
  const fetchedClass = await prisma.class.findUniqueOrThrow({
    where: {
      id: classId,
    },
    select: {
      allowInvitation: true,
      chat: {
        select: {
          id: true,
          participants: {
            select: {
              authId: true,
              role: true,
            },
          },
        },
      },
    },
  });

  const isAdmin = fetchedClass.chat?.participants.find(
    p => p.authId === authId && p.role === ChatRole.ADMIN
  );

  if (!fetchedClass.allowInvitation && !isAdmin)
    throw new ApiError(403, "Class is not open to invitation!");

  const isExist = fetchedClass.chat?.participants.find(
    p => p.authId === memberId
  );
  if (isExist) throw new ApiError(400, "Member already exist!");

  const memberPayload = {
    chatId: fetchedClass.chat?.id as string,
    authId: memberId,
    role: ChatRole.MEMBER,
  };

  const result = await prisma.chatParticipant.create({
    data: memberPayload,
  });

  return result;
};

const changeClassImage = async (classId: string, file: TFile) => {
  if (!file) throw new ApiError(400, "File is required!");
  const fetchedClass = await prisma.class.findUniqueOrThrow({
    where: {
      id: classId,
    },
  });

  const image = await uploadToS3(file);
  const result = await prisma.class.update({
    where: {
      id: classId,
    },
    data: {
      image,
    },
  });

  if (result && fetchedClass.image) await deleteFromS3(fetchedClass.image);
  return result;
};

const updateClassData = async (classId: string, data: TUpdateClassData) => {
  const result = await prisma.class.update({
    where: {
      id: classId,
    },
    data,
  });
  return result;
};

const toggleClassVisibility = async (classId: string) => {
  const fetchedClass = await prisma.class.findUniqueOrThrow({
    where: {
      id: classId,
    },
  });

  const result = await prisma.class.update({
    where: {
      id: classId,
    },
    data: {
      isPrivate: !fetchedClass.isPrivate,
    },
  });
  return result;
};

const toggleClassInvitationAccess = async (classId: string) => {
  const fetchedClass = await prisma.class.findUniqueOrThrow({
    where: {
      id: classId,
    },
  });

  const result = await prisma.class.update({
    where: {
      id: classId,
    },
    data: {
      allowInvitation: !fetchedClass.allowInvitation,
    },
  });
  return result;
};

export const classServices = {
  createClass,
  getSingleClass,
  addClassMember,
  changeClassImage,
  updateClassData,
  toggleClassVisibility,
  toggleClassInvitationAccess,
  getClassMembers,
};
