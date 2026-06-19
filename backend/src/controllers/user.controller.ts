import { Request, Response } from "express";
import { UserService } from "../services/user.services";

const userService = new UserService();

const getParamId = (id: string | string[]) =>
  Array.isArray(id) ? id[0] : id;

export class UserController {
  async createUser(
    req: Request,
    res: Response
  ) {
    try {
      const user =
        await userService.createUser(req.body);

      return res.status(201).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getUsers(
    req: Request,
    res: Response
  ) {
    try {
      const users =
        await userService.getAllUsers();

      return res.status(200).json({
        success: true,
        data: users
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getUserById(
    req: Request,
    res: Response
  ) {
    try {
      const user =
        await userService.getUserById(
          getParamId(req.params.id)
        );

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateUser(
    req: Request,
    res: Response
  ) {
    try {
      const user =
        await userService.updateUser(
          getParamId(req.params.id),
          req.body
        );

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteUser(
    req: Request,
    res: Response
  ) {
    try {
      await userService.deleteUser(
        getParamId(req.params.id)
      );

      return res.status(200).json({
        success: true,
        message:
          "User deleted successfully"
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

export const userController =
  new UserController();
