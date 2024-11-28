"use client";

import { useContext } from "react";
import { ProfileContext } from "./profile";
import { UserProfile } from "@/types";

export const useProfile = (): { profile: UserProfile } => {
  const { profile } = useContext(ProfileContext);

  return { profile };
};
