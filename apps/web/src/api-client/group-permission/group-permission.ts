import {
  GroupPermissionCreateParams,
  GroupPermissionResult,
  GroupPermissionsGetParams,
  GroupPermissionsResult,
  TogglePermissionParams,
} from "@repo/api-client";
import Api from "../api";

export class ApiGroupPermission extends Api {
  public getGroupPermissions(token: string, params: GroupPermissionsGetParams) {
    const query = new URLSearchParams(params as any).toString();
    const uri = query ? `/group-permission?${query}` : "/group-permission";

    const result = this.call<GroupPermissionsResult>({
      method: "GET",
      uri,
      token,
    });

    return result;
  }

  public create(token: string, props: GroupPermissionCreateParams) {
    const result = this.call<GroupPermissionResult>({
      method: "POST",
      uri: "/group-permission",
      token,
      props,
    });

    return result;
  }

  public updatePermissionToggle(
    token: string,
   
    props: TogglePermissionParams
  ) {
    const result = this.call<GroupPermissionResult>({
      method: "PATCH",
      uri: `/group-permission/toggle`,
      token,
      props,
    });

    return result;
  }
}
