import { VehicleOption } from './types';

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    type: 'MOTO',
    label: 'Moto',
    capacity: 1,
    basePrice: 20,
    icon: '🏍️',
  },
  {
    type: 'AUTORIKSHAW',
    label: 'Auto Rickshaw',
    capacity: 3,
    basePrice: 35,
    icon: '🛺',
  },
  {
    type: 'CAR',
    label: 'Car',
    capacity: 4,
    basePrice: 50,
    icon: '🚗',
  },
];

export function getVehicleOption(type: string) {
  return VEHICLE_OPTIONS.find(v => v.type === type);
}
