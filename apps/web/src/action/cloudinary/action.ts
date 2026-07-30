"use server";

import { auth } from "@/lib/auth";
import { getCloudinaryApi } from "@/src/api-client/cloudinary";
import { CategoryGetParams } from "@repo/api-client";

export async function getSignature() {
    "use server";

  const session = await auth();
  const api = await getCloudinaryApi();
  return await api.signature(session?.accessToken ?? "");
}
