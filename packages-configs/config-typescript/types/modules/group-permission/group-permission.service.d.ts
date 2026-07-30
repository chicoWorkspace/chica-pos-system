import { GroupPermissionsQuery, GroupPermissionsCreate, TogglePermissionParams } from "./group-permission.schema";
export declare class GroupPermissionsService {
    private feature;
    list(query: GroupPermissionsQuery): Promise<import("@repo/db/group-permissions/index.type").LeanGroupPermissions[]>;
    create(data: GroupPermissionsCreate): Promise<import("@repo/db/group-permissions/index.model").ModelGroupPermissions>;
    toggle(data: TogglePermissionParams): Promise<import("@repo/db/group-permissions/index.model").ModelGroupPermissions>;
}
