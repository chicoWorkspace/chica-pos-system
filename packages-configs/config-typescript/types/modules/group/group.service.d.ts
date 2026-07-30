import { GroupCreate, GroupUpdate, GroupAddMember } from "./group.schema";
export declare class GroupService {
    private feature;
    listGroups(): Promise<import("@repo/db/group/index.type").GroupResultData[]>;
    create(data: GroupCreate): Promise<import("@repo/db/group/index.model").ModelGroup>;
    update(groupId: string, data: GroupUpdate): Promise<import("@repo/db/group/index.model").ModelGroup>;
    addMember(groupId: string, member: GroupAddMember): Promise<import("@repo/db/group/index.type").GroupResultData>;
    removeMember(groupId: string, adminId: string): Promise<import("@repo/db/group/index.type").GroupResultData>;
    deleteGroup(groupId: string): Promise<import("@repo/db/group/index.model").ModelGroup>;
    setLeader(groupId: string, adminId: string): Promise<import("@repo/db/group/index.type").GroupResultData>;
}
