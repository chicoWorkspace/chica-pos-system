// apps/api/src/features/group-permissions/service.ts

import { GroupPermissions } from "@repo/db";
import {
  GroupPermissionsQuery,
  GroupPermissionsCreate,
  TogglePermissionParams,
} from "./group-permission.schema";

export class GroupPermissionsService {
  private feature = new GroupPermissions();

  async list(query: GroupPermissionsQuery) {
    return this.feature.list(query);
  }

  async create(data: GroupPermissionsCreate) {
    return this.feature.add(data);
  }

  async toggle(data: TogglePermissionParams) {
    return this.feature.setPermission(data.pageId, data.groupId, data.permissionKey);
  }
}
