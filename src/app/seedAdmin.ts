import prisma from "./utils/prisma";
import config from "./config";
import bcrypt from "bcrypt";
import { UserRole, UserStatus } from "@prisma/client";

const seedAdmin = async () => {
  try {
    const exist = await prisma.auth.findUnique({
      where: {
        email: config.admin.email,
        role: UserRole.ADMIN,
      },
    });

    if (exist) return console.log("Admin already exists");

    const hashedPass = await bcrypt.hash(config.admin.password as string, 10);
    await prisma.$transaction(async tn => {
      await tn.auth.create({
        data: {
          email: config.admin.email as string,
          password: hashedPass,
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
          needsPasswordChange: false,
        },
      });

      await tn.admin.create({
        data: {
          email: config.admin.email as string,
          name: "Admin",
        },
      });
    });
    console.log("Admin created");
  } catch (error) {
    console.log(error);
  }
};

seedAdmin();
