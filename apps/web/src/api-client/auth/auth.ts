import {
  GetPermissionsResult,
  LoginBag,
  LoginResult,
  RefreshBag,
  RefreshResult,
} from "@repo/api-client";
import Api from "../api";

export class ApiAuth extends Api {
  public login(props: LoginBag) {
    const result = this.callWithoutToken<LoginResult>({
      method: "POST",
      uri: "/auth/login",
      props,
    });

    return result;
  }

  public refresh(props: RefreshBag) {
    const result = this.callWithoutToken<RefreshResult>({
      method: "POST",
      uri: "/auth/refresh",
      props,
    });

    return result;
  }

  public getPermissions(token: string) {
    const result = this.call<GetPermissionsResult>({
      method: "GET",
      uri: "/auth/permissions",
      token,
    });

    return result;
  }
}
