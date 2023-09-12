import { ModType } from "./mod";

export type Avatar = {
  color: string;
};
type Profile = {
  id: string;
  name: string;
  mods: Array<ModType>;
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
