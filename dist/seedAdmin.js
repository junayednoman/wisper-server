"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./app/utils/prisma"));
const config_1 = __importDefault(require("./app/config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const seedAdmin = async () => {
    try {
        const exist = await prisma_1.default.auth.findUnique({
            where: {
                email: config_1.default.admin.email,
                role: client_1.UserRole.ADMIN,
            },
        });
        if (exist)
            return console.log("Admin already exists");
        const hashedPass = await bcrypt_1.default.hash(config_1.default.admin.password, 10);
        await prisma_1.default.$transaction(async (tn) => {
            await tn.auth.create({
                data: {
                    email: config_1.default.admin.email,
                    password: hashedPass,
                    role: client_1.UserRole.ADMIN,
                    status: client_1.UserStatus.ACTIVE,
                    needsPasswordChange: false,
                },
            });
            await tn.admin.create({
                data: {
                    email: config_1.default.admin.email,
                    name: "Admin",
                },
            });
        });
        console.log("Admin created");
    }
    catch (error) {
        console.log(error);
    }
};
seedAdmin();
//# sourceMappingURL=seedAdmin.js.map