export type UserRole = "ROLE_USER" | "ROLE_DRIVER";

export type RideStatus = "REQUESTED" | "ACCEPTED" | "COMPLETED";

export interface RideDto {
  id: string;
  pickupLocation: string;
  dropLocation: string;
  status: RideStatus;
  userId: string;
  driverId?: string | null;
  passengerUsername?: string;
  driverUsername?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: UserRole;
}
