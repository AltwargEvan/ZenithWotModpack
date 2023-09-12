import { ModType } from "./mod";

export type Avatar = {
  color: string;
};

export type ModInstallData = ModType & {
  installConfigIndex: number;
};
type Profile = {
  id: string;
  name: string;
  mods: Array<ModInstallData>;
  avatar: Avatar;
  createdAt: string;
};

export const defaultProfile: Profile = {
  id: crypto.randomUUID(),
  name: "Default",
  mods: [],
  createdAt: new Date().toLocaleDateString(),
  avatar: {
    color: "hsl(181, 63%, 41%)",
  },
};
export default Profile;
