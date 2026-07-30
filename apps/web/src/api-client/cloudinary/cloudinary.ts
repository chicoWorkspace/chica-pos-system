import { SignatureResult } from "@repo/api-client";
import Api from "../api";

export class ApiCloudinary extends Api {
  public signature(token: string) {
    const result = this.call<SignatureResult>({
      method: "POST",
      uri: "/cloudinary/signature",
      token,
      props: {},
    });

    return result;
  }
}
