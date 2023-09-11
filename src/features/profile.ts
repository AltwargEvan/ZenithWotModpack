type ModData = {
  name: string;
  id: number;
  version: string;
};
type Profile = {
  gameDirectory?: string;
  name: string;
  mods: Array<ModData>;
};

export default Profile;
