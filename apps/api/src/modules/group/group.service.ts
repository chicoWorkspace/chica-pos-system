import { Group } from "@repo/db";
import { GroupCreate, GroupUpdate, GroupAddMember } from "./group.schema";

export class GroupService {
  private feature = new Group();

  async listGroups() {
    return this.feature.groups();
  }

  async create(data: GroupCreate) {
    return this.feature.create({
      ...data,
      description: data.description ?? "",
      members: [],
    });
  }

  async update(groupId: string, data: GroupUpdate) {
    return this.feature.update({ _id: groupId }, data);
  }

  async addMember(groupId: string, member: GroupAddMember) {
    return this.feature.addNewAdminToGroup(
      groupId,
      member.username,
      member.password
    );
  }

  async removeMember(groupId: string, adminId: string) {
    return this.feature.removeMember(groupId, adminId);
  }

  async deleteGroup(groupId: string) {
    return this.feature.deleteGroup(groupId);
  }

  async setLeader(groupId: string, adminId: string) {
    return this.feature.setMemberAsLeader(groupId, adminId);
  }
}
