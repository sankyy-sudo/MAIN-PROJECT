"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_services_1 = require("../services/user.services");
const userService = new user_services_1.UserService();
const getParamId = (id) => Array.isArray(id) ? id[0] : id;
class UserController {
    async createUser(req, res) {
        try {
            const user = await userService.createUser(req.body);
            return res.status(201).json({
                success: true,
                data: user
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).json({
                success: true,
                data: users
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(getParamId(req.params.id));
            return res.status(200).json({
                success: true,
                data: user
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async updateUser(req, res) {
        try {
            const user = await userService.updateUser(getParamId(req.params.id), req.body);
            return res.status(200).json({
                success: true,
                data: user
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
    async deleteUser(req, res) {
        try {
            await userService.deleteUser(getParamId(req.params.id));
            return res.status(200).json({
                success: true,
                message: "User deleted successfully"
            });
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
