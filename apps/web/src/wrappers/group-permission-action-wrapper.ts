import {
  create,
  getGroupPermissions,
  IGroupPermissionAction,
  updatePermissionToggle,
} from "../action/group-permission/action";

/**
 * 這是 GroupPermission Actions 的組裝物件。
 * 這個物件本身不是一個 Server Action，但它包含的屬性都是 Server Actions。
 * 它的用途是方便在 Server Component 中傳遞給 Client Component。
 */
export const groupPermissionActionWrapper: IGroupPermissionAction = {
  getGroupPermissions,
  create,
  updatePermissionToggle,
};
