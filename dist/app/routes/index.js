"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const admin_routes_1 = require("../modules/admin/admin.routes");
const uploadFile_routes_1 = require("../modules/uploadFile/uploadFile.routes");
const otp_routes_1 = require("../modules/otp/otp.routes");
const person_routes_1 = require("../modules/person/person.routes");
const post_routes_1 = require("../modules/post/post.routes");
const reaction_routes_1 = require("../modules/reaction/reaction.routes");
const comment_routes_1 = require("../modules/comment/comment.routes");
const resume_routes_1 = require("../modules/resume/resume.routes");
const business_routes_1 = require("../modules/business/business.routes");
const job_routes_1 = require("../modules/job/job.routes");
const favorite_routes_1 = require("../modules/favorite/favorite.routes");
const connection_routes_1 = require("../modules/connection/connection.routes");
const chat_routes_1 = require("../modules/chat/chat.routes");
const recommendation_routes_1 = require("../modules/recommendation/recommendation.routes");
const group_routes_1 = require("../modules/group/group.routes");
const class_routes_1 = require("../modules/class/class.routes");
const message_routes_1 = require("../modules/message/message.routes");
const call_routes_1 = require("../modules/call/call.routes");
const complaint_routes_1 = require("../modules/complaint/complaint.routes");
const boostPackage_routes_1 = require("../modules/boostPackage/boostPackage.routes");
const legal_routes_1 = require("../modules/legal/legal.routes");
const dashboard_routes_1 = require("../modules/dashboard/dashboard.routes");
const boost_routes_1 = require("../modules/boost/boost.routes");
const notification_routes_1 = require("../modules/notification/notification.routes");
const router = (0, express_1.Router)();
const routes = [
    { path: "/auths", route: auth_routes_1.authRoutes },
    { path: "/otps", route: otp_routes_1.otpRoutes },
    { path: "/persons", route: person_routes_1.personRoutes },
    { path: "/posts", route: post_routes_1.postRoutes },
    { path: "/reactions", route: reaction_routes_1.reactionRoutes },
    { path: "/comments", route: comment_routes_1.commentRoutes },
    { path: "/resumes", route: resume_routes_1.resumeRoutes },
    { path: "/businesses", route: business_routes_1.businessRoutes },
    { path: "/jobs", route: job_routes_1.jobRoutes },
    { path: "/favorites", route: favorite_routes_1.favoriteRoutes },
    { path: "/connections", route: connection_routes_1.connectionRoutes },
    { path: "/recommendations", route: recommendation_routes_1.recommendationRoutes },
    { path: "/groups", route: group_routes_1.groupRoutes },
    { path: "/classes", route: class_routes_1.classRoutes },
    { path: "/chats", route: chat_routes_1.chatRoutes },
    { path: "/messages", route: message_routes_1.messageRoutes },
    { path: "/calls", route: call_routes_1.callRoutes },
    { path: "/complaints", route: complaint_routes_1.complaintRoutes },
    { path: "/boost-packages", route: boostPackage_routes_1.boostPackageRoutes },
    { path: "/legal", route: legal_routes_1.legalRoutes },
    { path: "/dashboard", route: dashboard_routes_1.dashboardRoutes },
    { path: "/boosts", route: boost_routes_1.boostRoutes },
    { path: "/notifications", route: notification_routes_1.notificationRoutes },
    { path: "/admins", route: admin_routes_1.adminRoutes },
    { path: "/upload-files", route: uploadFile_routes_1.fileRoutes },
];
routes.forEach(route => {
    router.use(route.path, route.route);
});
exports.default = router;
//# sourceMappingURL=index.js.map