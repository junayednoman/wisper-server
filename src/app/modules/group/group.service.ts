import { ChatRole, ChatType, Prisma } from "@prisma/client";
import ApiError from "../../middlewares/classes/ApiError";
import prisma from "../../utils/prisma";
import { TCreateGroup, TUpdateGroupData } from "./group.validation";
import { TFile } from "../../interface/file.interface";
import { deleteFromS3, uploadToS3 } from "../../utils/awss3";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";

const createGroup = async (payload: TCreateGroup, authId: string) => {
  const { members, ...groupPayload } = payload;
  const result = await prisma.$transaction(async tn => {
    const newGroup = await tn.group.create({
      data: groupPayload,
    });

    const chatPayload = {
      type: ChatType.GROUP,
      groupId: newGroup.id,
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

    return newGroup;
  });

  return result;
};

const getAllGroups = async (
  options: TPaginationOptions,
  query: Record<string, any>
) => {
  const andConditions: Prisma.GroupWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [{ name: { contains: query.searchTerm, mode: "insensitive" } }],
    });
  }

  const whereConditions: Prisma.GroupWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const { page, take, skip, sortBy, orderBy } = calculatePagination(options);

  const groups = await prisma.group.findMany({
    where: whereConditions,
    select: {
      id: true,
      name: true,
      image: true,
      createdAt: true,
      chat: {
        select: {
          _count: {
            select: {
              participants: true,
            },
          },
        },
      },
    },
    orderBy: sortBy && orderBy ? { [sortBy]: orderBy } : { createdAt: "desc" },
    skip,
    take,
  });

  const total = await prisma.group.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit: take,
    total,
  };
  return { meta, groups };
};

const getSingleGroup = async (id: string) => {
  const result = await prisma.group.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      image: true,
      isPrivate: true,
      allowInvitation: true,
      chat: {
        select: {
          _count: {
            select: {
              participants: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const getGroupMembers = async (
  id: string,
  options: TPaginationOptions,
  query: Record<string, any>
) => {
  const andConditions: Prisma.ChatParticipantWhereInput[] = [];

  andConditions.push({
    chat: {
      OR: [{ groupId: id }, { classId: id }],
    },
  });

  if (query.searchTerm) {
    andConditions.push({
      auth: {
        OR: [
          {
            person: {
              name: { contains: query.searchTerm, mode: "insensitive" },
            },
          },
          {
            business: {
              name: { contains: query.searchTerm, mode: "insensitive" },
            },
          },
        ],
      },
    });
  }

  const whereConditions: Prisma.ChatParticipantWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const { page, take, skip, sortBy, orderBy } = calculatePagination(options);
  const members = await prisma.chatParticipant.findMany({
    where: whereConditions,
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
    orderBy: sortBy && orderBy ? { [sortBy]: orderBy } : { joinedAt: "desc" },
    skip,
    take,
  });

  const total = await prisma.chatParticipant.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit: take,
    total,
  };
  return { meta, members };
};

const addGroupMember = async (
  groupId: string,
  memberId: string,
  authId: string
) => {
  const group = await prisma.group.findUniqueOrThrow({
    where: {
      id: groupId,
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

  const isAdmin = group.chat?.participants.find(
    p => p.authId === authId && p.role === ChatRole.ADMIN
  );

  if (!group.allowInvitation && !isAdmin)
    throw new ApiError(403, "Group is not open to invitation!");

  const isExist = group.chat?.participants.find(p => p.authId === memberId);
  if (isExist) throw new ApiError(400, "Member already exist!");

  const memberPayload = {
    chatId: group.chat?.id as string,
    authId: memberId,
    role: ChatRole.MEMBER,
  };

  const result = await prisma.chatParticipant.create({
    data: memberPayload,
  });

  return result;
};

const changeGroupImage = async (groupId: string, file: TFile) => {
  if (!file) throw new ApiError(400, "File is required!");
  const group = await prisma.group.findUniqueOrThrow({
    where: {
      id: groupId,
    },
  });

  const image = await uploadToS3(file);
  const result = await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      image,
    },
  });

  if (result && group.image) await deleteFromS3(group.image);
  return result;
};

const updateGroupData = async (groupId: string, data: TUpdateGroupData) => {
  const result = await prisma.group.update({
    where: {
      id: groupId,
    },
    data,
  });
  return result;
};

const toggleGroupVisibility = async (groupId: string) => {
  const group = await prisma.group.findUniqueOrThrow({
    where: {
      id: groupId,
    },
  });

  const result = await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      isPrivate: !group.isPrivate,
    },
  });
  return result;
};

const toggleGroupInvitationAccess = async (groupId: string) => {
  const group = await prisma.group.findUniqueOrThrow({
    where: {
      id: groupId,
    },
  });

  const result = await prisma.group.update({
    where: {
      id: groupId,
    },
    data: {
      allowInvitation: !group.allowInvitation,
    },
  });
  return result;
};

export const groupServices = {
  createGroup,
  getSingleGroup,
  addGroupMember,
  changeGroupImage,
  updateGroupData,
  toggleGroupVisibility,
  toggleGroupInvitationAccess,
  getAllGroups,
  getGroupMembers,
};
