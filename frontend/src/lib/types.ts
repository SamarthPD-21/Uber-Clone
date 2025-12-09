export type UserRole = "ROLE_USER" | "ROLE_DRIVER";

export type RideStatus = "REQUESTED" | "ACCEPTED" | "COMPLETED";

export type VehicleType = "MOTO" | "AUTORIKSHAW" | "CAR";

export interface VehicleOption {
  type: VehicleType;
  label: string;
  capacity: number;
  basePrice: number;
  icon: string;
}

export interface RideDto {
  id: string;
  pickupLocation: string;
  dropLocation: string;
  vehicleType?: VehicleType;
  basePrice?: number;
  distanceKm?: number;
  fare?: number;
  driverRevenue?: number;
  companyRevenue?: number;
  status: RideStatus;
  userId: string;
  driverId?: string | null;
  passengerUsername?: string;
  driverUsername?: string;
  createdAt?: string;
  acceptedAt?: string;
  completedAt?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: UserRole;
  vehicleType?: VehicleType;
}

export interface UserProfile {
  id: string;
  username: string;
  role: UserRole;
  vehicleType?: VehicleType;
}
