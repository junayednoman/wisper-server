import { Connection, ConnectionStatus, Prisma } from "@prisma/client";
import prisma from "../../utils/prisma";
import ApiError from "../../middlewares/classes/ApiError";
import {
  calculatePagination,
  TPaginationOptions,
} from "../../utils/paginationCalculation";

const sendConnectionRequest = async (authId: string, payload: Connection) => {
  payload.requesterId = authId;
  const existingConnection = await prisma.connection.findFirst({
    where: {
      requesterId: authId,
      receiverId: payload.receiverId,
    },
  });

  if (existingConnection) throw new ApiError(400, "Connection already exists!");
  const result = await prisma.connection.create({ data: payload });
  return result;
};

const getMyConnections = async (
  userId: string,
  query: Record<string, any>,
  options: TPaginationOptions
) => {
  const connectionFilterableFields = ["status", "requesterId", "receiverId"];
  const { searchTerm } = query;
  const andConditions: Prisma.ConnectionWhereInput[] = [];

  connectionFilterableFields.forEach(field => {
    andConditions.push({
      [field]: {
        equals: query[field],
      },
    });
  });

  const whereConditions: Prisma.ConnectionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const { page, take, skip, sortBy, orderBy } = calculatePagination(options);
  const connections = await prisma.connection.findMany({
    where: whereConditions,
    select: {
      id: true,
      status: true,
      receiverId: true,
      requester: {
        select: {
          id: true,
          person: {
            select: {
              id: true,
              image: true,
              name: true,
              title: true,
            },
          },
          business: {
            select: {
              id: true,
              image: true,
              name: true,
              industry: true,
            },
          },
        },
      },
      receiver: {
        select: {
          id: true,
          person: {
            select: {
              id: true,
              image: true,
              name: true,
              title: true,
            },
          },
          business: {
            select: {
              id: true,
              image: true,
              name: true,
              industry: true,
            },
          },
        },
      },
    },
    skip,
    take,
    orderBy: sortBy && orderBy ? { [sortBy]: orderBy } : { createdAt: "desc" },
  });

  let filteredConnections = connections.map(connection => {
    return {
      id: connection.id,
      partner:
        connection.receiverId === userId
          ? connection.requester
          : connection.receiver,
      status: connection.status,
    };
  });

  if (searchTerm) {
    filteredConnections = filteredConnections.filter(connection => {
      return (
        connection.partner.person?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        connection.partner.business?.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });
  }

  const total = await prisma.connection.count({
    where: whereConditions,
  });

  const meta = {
    page,
    limit: take,
    total,
  };
  return { meta, connections: filteredConnections };
};

const acceptOrRejectConnection = async (
  id: string,
  status: "ACCEPTED" | "REJECTED",
  authId: string
) => {
  const connection = await prisma.connection.findUniqueOrThrow({
    where: {
      id,
      status: ConnectionStatus.PENDING,
    },
  });

  if (connection.receiverId !== authId)
    throw new ApiError(401, "Unauthorized!");

  const result = await prisma.connection.update({
    where: {
      id,
    },
    data: {
      status: status,
    },
  });

  const message = `Connection request ${status} successfully!`;
  return { result, message };
};

const deleteConnection = async (id: string, authId: string) => {
  const connection = await prisma.connection.findUniqueOrThrow({
    where: {
      id,
    },
  });

  if (connection.requesterId !== authId && connection.receiverId !== authId)
    throw new ApiError(401, "Unauthorized!");

  const result = await prisma.connection.delete({
    where: {
      id,
    },
  });
  return result;
};

export const connectionServices = {
  sendConnectionRequest,
  getMyConnections,
  acceptOrRejectConnection,
  deleteConnection,
};
