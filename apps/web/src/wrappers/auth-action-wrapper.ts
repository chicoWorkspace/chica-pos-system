import { IAuthAction } from "../action/auth/action";
import { getPermissions } from "../action/auth/action";

/**
 * 這是 auth Actions 的組裝物件。
 * 這個物件本身不是一個 Server Action，但它包含的屬性都是 Server Actions。
 * 它的用途是方便在 Server Component 中傳遞給 Client Component。
 */
export const authActionWrapper: IAuthAction = {
  getPermissions,
};
