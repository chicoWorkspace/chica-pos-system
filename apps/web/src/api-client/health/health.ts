
import Api from "../api";

export class ApiHealth extends Api {
  public get() {
    const result = this.callWithoutToken({
      method: "GET",
      uri: "/health",
    });

    return result;
  }
}
