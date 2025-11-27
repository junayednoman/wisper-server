"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../../middlewares/classes/ApiError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const sendEmail_1 = require("../../utils/sendEmail");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const jsonwebtoken_2 = __importDefault(require("jsonwebtoken"));
const paginationCalculation_1 = require("../../utils/paginationCalculation");
const login = async (payload) => {
    const auth = await prisma_1.default.auth.findUniqueOrThrow({
        where: {
            email: payload.email,
            NOT: [
                {
                    status: client_1.UserStatus.DELETED,
                },
            ],
        },
    });
    if (auth.status === client_1.UserStatus.PENDING)
        throw new ApiError_1.default(400, "Please verify your account!");
    if (auth.status === client_1.UserStatus.BLOCKED)
        throw new ApiError_1.default(400, "Your account is blocked!");
    if (auth.loginProvider === client_1.LoginProvider.GOOGLE)
        throw new ApiError_1.default(400, "Your account was created using Google!");
    const hasMatched = await bcrypt_1.default.compare(payload.password, auth.password);
    if (!hasMatched)
        throw new ApiError_1.default(400, "Invalid credentials!");
    // prepare tokens
    const jwtPayload = {
        email: auth.email,
        role: auth.role,
        id: auth.id,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt.accessSecret, {
        expiresIn: payload.isMobileApp
            ? config_1.default.jwt.refreshExpiration
            : config_1.default.jwt.accessExpiration,
    });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt.refreshSecret, {
        expiresIn: config_1.default.jwt.refreshExpiration,
    });
    // update fcmToken if any
    if (payload.fcmToken) {
        await prisma_1.default.auth.update({
            where: {
                email: payload.email,
            },
            data: {
                fcmToken: payload.fcmToken,
            },
        });
    }
    return {
        accessToken,
        refreshToken,
    };
};
const getAll = async (options) => {
    const andConditions = [];
    andConditions.push({
        OR: [
            {
                role: client_1.UserRole.PERSON,
            },
            {
                role: client_1.UserRole.BUSINESS,
            },
        ],
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const { page, take, skip, sortBy, orderBy } = (0, paginationCalculation_1.calculatePagination)(options);
    const personAuths = await prisma_1.default.auth.findMany({
        where: whereConditions,
        select: {
            id: true,
            createdAt: true,
            person: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    phone: true,
                    title: true,
                    industry: true,
                    address: true,
                },
            },
            business: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    phone: true,
                    industry: true,
                    address: true,
                },
            },
        },
        skip,
        take,
        orderBy: sortBy && orderBy ? { [sortBy]: orderBy } : { createdAt: "desc" },
    });
    const total = await prisma_1.default.auth.count({
        where: whereConditions,
    });
    const meta = {
        page,
        limit: take,
        total,
    };
    return { meta, personAuths };
};
const resetPassword = async (payload) => {
    const auth = await prisma_1.default.auth.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: client_1.UserStatus.ACTIVE,
        },
        select: {
            person: {
                select: {
                    name: true,
                },
            },
        },
    });
    const otp = await prisma_1.default.otp.findUniqueOrThrow({
        where: {
            email: payload.email,
            isVerified: true,
        },
    });
    if (!otp)
        throw new ApiError_1.default(401, "OTP is not verified!");
    const hashedPassword = await bcrypt_1.default.hash(payload.password, 10);
    await prisma_1.default.$transaction(async (tn) => {
        await tn.auth.update({
            where: {
                email: payload.email,
            },
            data: {
                password: hashedPassword,
            },
        });
        await tn.otp.delete({
            where: {
                email: payload.email,
            },
        });
    });
    // send email
    const subject = "Your wisper Password Has Been Reset 🎉";
    const path = "./src/app/emailTemplates/passwordResetSuccess.html";
    const replacements = { name: auth.person?.name };
    (0, sendEmail_1.sendEmail)(payload.email, subject, path, replacements);
};
const changePassword = async (payload, userId) => {
    const auth = await prisma_1.default.auth.findUniqueOrThrow({
        where: {
            id: userId,
            status: client_1.UserStatus.ACTIVE,
        },
    });
    const hasMatched = await bcrypt_1.default.compare(payload.oldPassword, auth.password);
    if (!hasMatched) {
        throw new ApiError_1.default(400, "Old password is incorrect!");
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.newPassword, 10);
    await prisma_1.default.auth.update({
        where: {
            id: userId,
        },
        data: {
            password: hashedPassword,
        },
    });
};
const changeAccountStatus = async (userId, status) => {
    const auth = await prisma_1.default.auth.findUniqueOrThrow({
        where: {
            id: userId,
        },
    });
    if (auth.role === client_1.UserRole.ADMIN)
        throw new ApiError_1.default(400, "Admin account cannot be changed!");
    await prisma_1.default.auth.update({
        where: {
            id: userId,
        },
        data: {
            status: status,
        },
    });
    const message = status === client_1.UserStatus.ACTIVE
        ? "Account activated successfully!"
        : status === "BLOCKED"
            ? "Account blocked successfully!"
            : status === "DELETED"
                ? "Account deleted successfully!"
                : "";
    return { message };
};
const refreshToken = async (token) => {
    if (!token)
        throw new ApiError_1.default(401, "Unauthorized!");
    const decodedUser = jsonwebtoken_2.default.verify(token, config_1.default.jwt.refreshSecret);
    if (!decodedUser)
        throw new ApiError_1.default(401, "Unauthorized!");
    const user = await prisma_1.default.auth.findUniqueOrThrow({
        where: {
            id: decodedUser.id,
        },
        select: {
            id: true,
            email: true,
            role: true,
        },
    });
    const jwtPayload = {
        email: user.email,
        role: user.role,
        id: user.id,
    };
    const accessToken = jsonwebtoken_2.default.sign(jwtPayload, config_1.default.jwt.accessSecret, {
        expiresIn: config_1.default.jwt.accessExpiration,
    });
    return { accessToken };
};
const toggleNotificationPermission = async (id) => {
    const auth = await prisma_1.default.auth.findUniqueOrThrow({
        where: {
            id,
        },
    });
    const result = await prisma_1.default.auth.update({
        where: {
            id,
        },
        data: {
            allowNotifications: !auth.allowNotifications,
        },
        select: {
            id: true,
            allowNotifications: true,
        },
    });
    return result;
};
exports.authServices = {
    login,
    getAll,
    refreshToken,
    resetPassword,
    changePassword,
    changeAccountStatus,
    toggleNotificationPermission,
};
//# sourceMappingURL=auth.service.js.map