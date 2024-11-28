"use client";

import { FC, createContext, PropsWithChildren } from "react";
import { UserProfile } from "@/types";

interface ProfileContextProps {
  profile: UserProfile;
}

interface ProfileProviderProps extends PropsWithChildren {
  profile: UserProfile;
}

export const ProfileContext = createContext<ProfileContextProps>({
  profile: {
    address: "",
    created_at: "",
    dni: "",
    id: 0,
    last_name: "",
    name: "",
    phone: "",
    updated_at: "",
  },
});

export const ProfileProvider: FC<ProfileProviderProps> = ({
  children,
  profile,
}) => {
  return (
    <ProfileContext.Provider value={{ profile }}>
      {children}
    </ProfileContext.Provider>
  );
};
