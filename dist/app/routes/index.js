"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const admin_routes_1 = require("../modules/admin/admin.routes");
const uploadFile_routes_1 = require("../modules/uploadFile/uploadFile.routes");
const router = (0, express_1.Router)();
const routes = [
    { path: "/auths", route: auth_routes_1.authRoutes },
    { path: "/admins", route: admin_routes_1.adminRoutes },
    { path: "/upload-files", route: uploadFile_routes_1.fileRoutes },
];
routes.forEach(route => {
    router.use(route.path, route.route);
});
exports.default = router;
//# sourceMappingURL=index.js.map