type ModData = {
  name: string;
  id: number;
  version: string;
};
type Profile = {
  name: string;
  mods: Array<ModData>;
};

export default Profile;
