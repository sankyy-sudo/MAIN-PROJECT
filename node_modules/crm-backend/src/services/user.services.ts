import bcrypt from "bcryptjs";
import { IUser, User } from "../models/User";

export class UserService {
  async createUser(data: Partial<IUser>) {
    const payload = { ...data };

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    return User.create(payload as any);
  }

  async getAllUsers() {
    return User.findAll({ order: [["createdAt", "DESC"]] });
  }

  async getUserById(id: string) {
    return User.findByPk(id);
  }

  async updateUser(id: string, data: Partial<IUser>) {
    const user = await User.findByPk(id);
    if (!user) return null;

    const payload = { ...data };
    delete (payload as any).id;
    delete (payload as any)._id;

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    return user.update(payload);
  }

  async deleteUser(id: string) {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return user;
  }
}
