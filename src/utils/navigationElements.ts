import { IoniconsName } from "../assets/icons";

export type NavItem = {
  key: string;
  title: string;
  icon: IoniconsName;
  isCenter?: boolean;
};

const navigationElements: NavItem[] = [
  {
    key: 'Dashboard',
    title: 'Pulpit',
    icon: 'grid-outline',
  },
  {
    key: 'Expenses',
    title: 'Wydatki',
    icon: 'receipt-outline',
  },
  {
    key: 'Scanner',
    title: 'Nowy wydatek',
    icon: 'scan-outline',
    isCenter: true,
  },
  {
    key: 'Budgets',
    title: 'Budżety',
    icon: 'pie-chart-outline',
  },
  {
    key: 'Profile',
    title: 'Profil',
    icon: 'person-outline',
  },
];

export default navigationElements;
