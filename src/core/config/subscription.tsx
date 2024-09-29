import GradeIcon from '@components/Icons/GradeIcon';
import HotelClassIcon from '@components/Icons/HotelClassIcon';
import { colors } from '@core/styles/theme';

export interface Plan {
  id: string;
  name: string;
  cost: number;
  identifier: string;
  numberOfDoctors: number;
  recommended: boolean;
  icon: React.ReactNode;
  color: keyof typeof colors;
}

export const plans: Plan[] = [
  {
    id: '1',
    name: 'Basic',
    identifier: 'basic',
    cost: 49,
    numberOfDoctors: 1,
    recommended: false,
    icon: <GradeIcon />,
    color: 'accent',
  },
  {
    id: '2',
    name: 'Unlimited',
    identifier: 'unlimited',
    cost: 129,
    numberOfDoctors: Infinity,
    recommended: true,
    icon: <HotelClassIcon />,
    color: 'positiveAction',
  },
];
