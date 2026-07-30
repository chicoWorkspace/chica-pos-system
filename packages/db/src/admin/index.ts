import bcrypt from "bcrypt";
import { ModelAdmin } from "./index.model";
import {
  AdminAddParams,
  AdminUpdateParams,
  IAdmin,
  IAdminDocument,
} from "./index.type";
import mongoose from "mongoose";
import { CheckerZod } from "@repo/lib";

export class Admin {
  public async create(
    bag: AdminAddParams,
    session?: mongoose.mongo.ClientSession,
  ): Promise<ModelAdmin> {
    const { username, password } = bag;

    const usernameMsg = CheckerZod.checkAdminUsername(username);
    if (usernameMsg !== undefined) {
      throw new Error(usernameMsg);
    }
    const passwordMsg = CheckerZod.checkPassword(password);
    if (passwordMsg !== undefined) {
      throw new Error(passwordMsg);
    }

    if (await ModelAdmin.get({ username })) {
      throw new Error("帳號已存在");
    }

    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);

    let admin = await ModelAdmin.add(
      { ...bag, password: hashedPassword },
      session,
    );
    return admin;
  }

  public async login(bag: {
    username: string;
    password: string;
  }): Promise<IAdminDocument> {
    const { username, password } = bag;
    const admin = await ModelAdmin.get({ username });
    if (!admin) {
      throw new Error("帳號不存在");
    }
    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) {
      throw new Error("密碼錯誤");
    }

    return admin;
  }

  public async getAdminByUserId(
    userId: string,
  ): Promise<IAdminDocument | null> {
    const admin = await ModelAdmin.get({ _id: userId });
    return admin;
  }

  public async update(
    filterParams: AdminUpdateParams,
    updateParams: AdminUpdateParams,
  ): Promise<ModelAdmin> {
    return await ModelAdmin.update(filterParams, updateParams);
  }
}
