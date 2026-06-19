"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
class UserService {
    async createUser(data) {
        const payload = { ...data };
        if (payload.password) {
            payload.password = await bcryptjs_1.default.hash(payload.password, 10);
        }
        return User_1.User.create(payload);
    }
    async getAllUsers() {
        return User_1.User.findAll({ order: [["createdAt", "DESC"]] });
    }
    async getUserById(id) {
        return User_1.User.findByPk(id);
    }
    async updateUser(id, data) {
        const user = await User_1.User.findByPk(id);
        if (!user)
            return null;
        const payload = { ...data };
        delete payload.id;
        delete payload._id;
        if (payload.password) {
            payload.password = await bcryptjs_1.default.hash(payload.password, 10);
        }
        return user.update(payload);
    }
    async deleteUser(id) {
        const user = await User_1.User.findByPk(id);
        if (!user)
            return null;
        await user.destroy();
        return user;
    }
}
exports.UserService = UserService;
