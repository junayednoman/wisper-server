"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodValidation = (schema, { formData = false } = {}) => async (req, _res, next) => {
    try {
        if (!formData) {
            await schema.parseAsync(req.body);
        }
        else if (formData && req?.body?.payload) {
            req.body = await schema.parseAsync(JSON.parse(req?.body?.payload || "{}"));
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = handleZodValidation;
//# sourceMappingURL=handleZodValidation.js.map