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
const generateOTP_1 = __importDefault(require("../../utils/generateOTP"));
const jsonwebtoken_2 = __importDefault(require("jsonwebtoken"));
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
const verifyOtp = async (payload) => {
    await prisma_1.default.auth.findUniqueOrThrow({
        where: {
            email: payload.email,
        },
    });
    const otp = await prisma_1.default.otp.findUniqueOrThrow({
        where: {
            email: payload.email,
            isVerified: false,
        },
    });
    const hasOtpExpired = otp.expires < new Date();
    if (otp.attempts > 3)
        throw new ApiError_1.default(400, "Too many attempts! Please request a new one!");
    if (hasOtpExpired) {
        throw new ApiError_1.default(400, "OTP expired! Please request a new one!");
    }
    // Update the OTP attempts
    await prisma_1.default.otp.update({
        where: {
            email: payload.email,
        },
        data: {
            attempts: {
                increment: 1,
            },
        },
    });
    const hasMatched = await bcrypt_1.default.compare(payload.otp, otp.otp);
    if (!hasMatched) {
        throw new ApiError_1.default(400, "Invalid OTP! Please try again!");
    }
    const result = await prisma_1.default.$transaction(async (tn) => {
        if (payload.verifyAccount) {
            const updatedAuth = await tn.auth.update({
                where: {
                    email: payload.email,
                },
                data: {
                    status: client_1.UserStatus.ACTIVE,
                },
                include: {
                    person: true,
                },
            });
            await prisma_1.default.otp.delete({
                where: {
                    email: payload.email,
                },
            });
            // send verification success email
            if (updatedAuth) {
                const subject = "🎉 Welcome to wisper! Your Email is Verified";
                const name = updatedAuth.person?.name;
                const path = "./src/app/emailTemplates/verificationSuccess.html";
                (0, sendEmail_1.sendEmail)(updatedAuth.email, subject, path, { name });
            }
        }
        else {
            await tn.otp.update({
                where: {
                    email: payload.email,
                },
                data: {
                    isVerified: true,
                },
            });
        }
    });
    return result;
};
const sendOtp = async (email) => {
    const auth = await prisma_1.default.auth.findUniqueOrThrow({
        where: {
            email: email,
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
    const otp = (0, generateOTP_1.default)();
    const hashedOtp = await bcrypt_1.default.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    const otpData = {
        email: email,
        otp: hashedOtp,
        expires: otpExpires,
        attempts: 0,
        isVerified: false,
    };
    await prisma_1.default.otp.upsert({
        where: {
            email,
        },
        update: otpData,
        create: otpData,
    });
    // send email
    const subject = "Your One-Time Password (OTP) for Password Reset";
    const path = "./src/app/emailTemplates/otp.html";
    (0, sendEmail_1.sendEmail)(email, subject, path, { otp, name: auth.person?.name });
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
exports.authServices = {
    verifyOtp,
    login,
    sendOtp,
    refreshToken,
    resetPassword,
    changePassword,
    changeAccountStatus,
};
//# sourceMappingURL=auth.service.js.map