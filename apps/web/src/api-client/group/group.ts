import {
  GroupAddMemberParams,
  GroupCreateParams,
  GroupResult,
  GroupsResult,
  GroupUpdateParams,
} from "@repo/api-client";
import Api from "../api";

export class ApiGroup extends Api {
  public getGroups(token: string) {
    const result = this.call<GroupsResult>({
      method: "GET",
      uri: "/group/groups",
      token,
    });

    return result;
  }

  public create(token: string, props: GroupCreateParams) {
    const result = this.call<GroupResult>({
      method: "POST",
      uri: "/group",
      token,
      props,
    });

    return result;
  }

  public addMember(
    token: string,
    groupId: string,
    props: GroupAddMemberParams
  ) {
    const result = this.call<GroupResult>({
      method: "POST",
      uri: `/group/${groupId}/members`,
      token,
      props,
    });

    return result;
  }

  public update(token: string, groupId: string, props: GroupUpdateParams) {
    const result = this.call<GroupResult>({
      method: "PATCH",
      uri: `/group/${groupId}`,
      token,
      props,
    });

    return result;
  }

  public setMemberAsLeader(token: string, groupId: string, adminId: string) {
    const result = this.call<GroupResult>({
      method: "PATCH",
      uri: `/group/${groupId}/members/${adminId}/leader`,
      token,
    });
    return result;
  }

  public delete(token: string, groupId: string) {
    const result = this.call<GroupResult>({
      method: "DELETE",
      uri: `/group/${groupId}`,
      token,
      props: {},
    });

    return result;
  }

  public deleteMember(token: string, groupId: string, adminId: string) {
    const result = this.call<GroupResult>({
      method: "DELETE",
      uri: `/group/${groupId}/members/${adminId}`,
      token,
      props: {},
    });
    return result;
  }
}
