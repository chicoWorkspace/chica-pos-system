import {
  addMember,
  create,
  deleteGroup,
  deleteMember,
  getGroups,
  IGroupAction,
  setMemberAsLeader,
  update,
} from "../action/group/action";

/**
 * 這是 Group Actions 的組裝物件。
 * 這個物件本身不是一個 Server Action，但它包含的屬性都是 Server Actions。
 * 它的用途是方便在 Server Component 中傳遞給 Client Component。
 */
export const groupActionWrapper: IGroupAction = {
  getGroups,
  create,
  update,
  deleteGroup,
  addMember,
  deleteMember,
  setMemberAsLeader,
};
