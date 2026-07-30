import { RootState } from "../index";

export const selectPermissions = (state: RootState) =>
  state.permission.permissions;

export const selectCan =
  (pageKey: string, action: string) =>
  (state: RootState): boolean => {
    const item = state.permission.permissions.find(
      (p) => p.pageKey === pageKey
    );
    return item ? item.actions.includes(action) : false;
  };
