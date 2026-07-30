"use server";

import { auth } from "@/lib/auth";
import { getHealthApi } from "@/src/api-client/health";
import { AnnouncementResult } from "@repo/api-client";

export interface IHealthAction {
  get(): Promise<unknown>;
}

export async function get() {
  const { api } = await setup();
  return await api.get();
}

export async function setup() {
  const session = await auth();
  const api = await getHealthApi();
  const accessToken = session?.accessToken ?? "";
  return { api, accessToken };
}
