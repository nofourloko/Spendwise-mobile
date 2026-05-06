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
    title: 'Dashboard',
    icon: 'grid-outline',
  },
  {
    key: 'Expenses',
    title: 'Expenses',
    icon: 'receipt-outline',
  },
  {
    key: 'Scanner',
    title: 'Scanner',
    icon: 'scan-outline',
    isCenter: true,
  },
  {
    key: 'Budgets',
    title: 'Budgets',
    icon: 'pie-chart-outline',
  },
  {
    key: 'Profile',
    title: 'Profile',
    icon: 'person-outline',
  },
];

export default navigationElements;
