import { IoniconsName } from "../assets/icons";

export type SettingsOption = {
  key: string;
  title: string;
  icon: IoniconsName;
};

const settingsOptions: SettingsOption[] = [
  {key: 'currency', title: 'Waluta', icon: 'wallet-outline'},
  {key: 'language', title: 'Język', icon: 'globe-outline'},
  {key: 'about', title: 'O aplikacji', icon: 'information-circle-outline'},
];

export default settingsOptions;
