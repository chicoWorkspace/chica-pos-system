"use client";

import LoginComp from "@/components/login";
import { healthActionWrapper } from "@/src/wrappers/health-action-wrapper";
import { announcementActionWrapper } from "@/src/wrappers/announcement-action-wrapper";

export default function PageLogin() {
  return (
    <LoginComp
      healthAction={healthActionWrapper}
      announcementAction={announcementActionWrapper}
    />
  );
}
