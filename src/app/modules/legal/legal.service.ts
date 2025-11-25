import prisma from "../../utils/prisma";
import { TLegalInfo } from "./legal.validation";

const createOrUpdateLegal = async (payload: TLegalInfo) => {
  const existing = await prisma.legal.findFirst({});
  let result = null;
  if (existing) {
    result = await prisma.legal.update({
      where: { id: existing.id },
      data: payload,
    });
  } else {
    result = await prisma.legal.create({ data: payload });
  }
  return result;
};

const getLegalInfo = async () => {
  const result = await prisma.legal.findFirst({});
  return result;
};

export const legalService = { createOrUpdateLegal, getLegalInfo };
