export type UserRole = "ROLE_USER" | "ROLE_DRIVER";

export type RideStatus = "REQUESTED" | "ACCEPTED" | "COMPLETED";

export interface RideDto {
  id: string;
  pickupLocation: string;
  dropLocation: string;
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
}
