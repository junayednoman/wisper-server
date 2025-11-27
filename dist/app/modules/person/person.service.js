"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.personServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const ApiError_1 = __importDefault(require("../../middlewares/classes/ApiError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateOTP_1 = __importDefault(require("../../utils/generateOTP"));
const sendEmail_1 = require("../../utils/sendEmail");
const awss3_1 = require("../../utils/awss3");
const paginationCalculation_1 = require("../../utils/paginationCalculation");
const signUp = async (payload) => {
    const existingUser = await prisma_1.default.auth.findUnique({
        where: {
            email: payload.person.email,
            OR: [
                { status: client_1.UserStatus.ACTIVE },
                { status: client_1.UserStatus.BLOCKED },
                { status: client_1.UserStatus.DELETED },
            ],
        },
    });
    if (existingUser)
        throw new ApiError_1.default(400, "User already exists!");
    const hashedPassword = await bcrypt_1.default.hash(payload.password, 10);
    const authData = {
        email: payload.person.email,
        password: hashedPassword,
        role: client_1.UserRole.PERSON,
    };
    const otp = (0, generateOTP_1.default)();
    const result = await prisma_1.default.$transaction(async (tn) => {
        await tn.auth.upsert({
            where: {
                email: payload.person.email,
            },
            create: authData,
            update: authData,
        });
        const result = await tn.person.upsert({
            where: {
                email: payload.person.email,
            },
            create: payload.person,
            update: payload.person,
        });
        const hashedOtp = await bcrypt_1.default.hash(otp.toString(), 10);
        const otpExpires = new Date(Date.now() + 3 * 60 * 1000);
        const otpData = {
            email: payload.person.email,
            otp: hashedOtp,
            expires: otpExpires,
            attempts: 0,
        };
        await tn.otp.upsert({
            where: {
                email: payload.person.email,
            },
            update: otpData,
            create: otpData,
        });
        return result;
    });
    // sendEmail
    if (result) {
        const subject = "Complete your signup – verify your email";
        const replacements = {
            name: payload.person.name,
            otp,
        };
        const path = "./src/app/emailTemplates/welcome.html";
        (0, sendEmail_1.sendEmail)(payload.person.email, subject, path, replacements);
    }
    return result;
};
const getSingle = async (id) => {
    const result = await prisma_1.default.auth.findUnique({
        where: {
            id: id,
            role: client_1.UserRole.PERSON,
        },
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
        },
    });
    const recommendations = await prisma_1.default.recommendation.findMany({
        where: {
            receiverId: id,
        },
        select: {
            id: true,
            receiver: {
                select: {
                    person: {
                        select: {
                            image: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });
    return { auth: result, recommendations };
};
const getMyProfile = async (id) => {
    const result = await prisma_1.default.auth.findUnique({
        where: {
            id: id,
        },
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
                    defaultResume: {
                        select: {
                            name: true,
                            file: true,
                            fileSize: true,
                            createdAt: true,
                        },
                    },
                    address: true,
                },
            },
        },
    });
    const recommendations = await prisma_1.default.recommendation.findMany({
        where: {
            receiverId: id,
        },
        select: {
            id: true,
            receiver: {
                select: {
                    person: {
                        select: {
                            image: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });
    return { auth: result, recommendations };
};
const updateMyProfile = async (email, payload) => {
    const result = await prisma_1.default.person.update({
        where: {
            email,
        },
        data: payload,
    });
    return result;
};
const updateProfileImage = async (email, file) => {
    if (!file)
        throw new Error("No file provided!");
    const person = await prisma_1.default.person.findUnique({
        where: {
            email,
        },
    });
    const image = await (0, awss3_1.uploadToS3)(file);
    console.log("image, ", image);
    const result = await prisma_1.default.person.update({
        where: {
            email,
        },
        data: {
            image,
        },
    });
    if (result && person?.image)
        await (0, awss3_1.deleteFromS3)(person.image);
    return result;
};
const getUserRoles = async (options) => {
    const { page, take, skip, sortBy, orderBy } = (0, paginationCalculation_1.calculatePagination)(options);
    const roles = await prisma_1.default.auth.findMany({
        where: {
            role: client_1.UserRole.PERSON,
        },
        select: {
            id: true,
            person: {
                select: {
                    name: true,
                    image: true,
                    title: true,
                },
            },
            _count: {
                select: {
                    posts: true,
                    receivedRecommendations: true,
                },
            },
        },
        skip,
        take,
        orderBy: sortBy && orderBy ? { [sortBy]: orderBy } : { createdAt: "desc" },
    });
    const total = await prisma_1.default.auth.count({
        where: {
            role: client_1.UserRole.PERSON,
        },
    });
    const meta = {
        page,
        limit: take,
        total,
    };
    return { meta, roles };
};
exports.personServices = {
    signUp,
    getSingle,
    getMyProfile,
    updateMyProfile,
    updateProfileImage,
    getUserRoles,
};
//# sourceMappingURL=person.service.js.map