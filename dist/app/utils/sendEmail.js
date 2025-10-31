"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const ApiError_1 = __importDefault(require("../middlewares/classes/ApiError"));
const config_1 = __importDefault(require("../config"));
const sendEmail = async (to, subject, templatePath, replacements) => {
    const year = new Date().getFullYear().toString();
    fs_1.default.readFile(templatePath, "utf8", async (err, data) => {
        if (err)
            throw new ApiError_1.default(500, err.message || "Something went wrong");
        // Replace all placeholders
        let emailContent = data;
        for (const [key, value] of Object.entries(replacements)) {
            emailContent = emailContent.replace(`{{${key}}}`, value.toString());
        }
        emailContent = emailContent.replace("{{year}}", year);
        const emailData = {
            to,
            subject,
            html: emailContent,
        };
        await axios_1.default.post(config_1.default.email.emailSendingApi, emailData);
    });
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map