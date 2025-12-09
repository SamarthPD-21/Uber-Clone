"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest, API_BASE_URL } from "@/lib/api";
import type { AuthResponse, RideDto, UserRole, VehicleType, UserProfile } from "@/lib/types";
import { formatRelativeTime, formatDateTime, calculateDuration } from "@/lib/utils";
import { VEHICLE_OPTIONS, getVehicleOption } from "@/lib/constants";

type AuthMode = "register" | "login";

type StatusBanner = {
  tone: "success" | "error";
  message: string;
};

// Auth Modal Component
function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (response: AuthResponse) => void;
}) {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    role: "ROLE_USER" as UserRole,
    vehicleType: undefined as VehicleType | undefined,
  });
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = await apiRequest<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: registerForm,
      });
      onSuccess(payload);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = await apiRequest<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: loginForm,
      });
      onSuccess(payload);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="card-surface w-full max-w-md p-8 relative animate-modal-slide-up shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-all duration-200 hover:rotate-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2 gradient-text">Welcome to RideShare</h2>
          <p className="text-slate-400 text-sm">Sign in or create an account to get started</p>
        </div>

        <div className="flex gap-2 rounded-full bg-white/[0.03] border border-white/10 p-1.5 mb-6">
          {["login", "register"].map((mode) => (
            <button
              key={mode}
              onClick={() => setAuthMode(mode as AuthMode)}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                authMode === mode 
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20" 
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {mode === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {authMode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/[0.05] focus:outline-none transition-all duration-200"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/[0.05] focus:outline-none transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400">Username</label>
              <input
                type="text"
                value={registerForm.username}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, username: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/[0.05] focus:outline-none transition-all duration-200"
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400">Password</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/[0.05] focus:outline-none transition-all duration-200"
                placeholder="Choose a password"
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-400 mb-2 block">I want to</label>
              <div className="grid gap-3 grid-cols-2">
                {[
                  { role: "ROLE_USER" as UserRole, label: "Request Rides", icon: "🚗" },
                  { role: "ROLE_DRIVER" as UserRole, label: "Drive", icon: "👨‍✈️" },
                ].map((option) => (
                  <button
                    key={option.role}
                    type="button"
                    className={`rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                      registerForm.role === option.role
                        ? "border-blue-400/60 bg-blue-500/15 text-white shadow-lg shadow-blue-500/20 scale-105"
                        : "border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5"
                    }`}
                    onClick={() => setRegisterForm((prev) => ({ ...prev, role: option.role, vehicleType: undefined }))}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <p className="text-sm font-semibold">{option.label}</p>
                  </button>
                ))}
              </div>
            </div>
            {registerForm.role === "ROLE_DRIVER" && (
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 mb-2 block">Select Your Vehicle</label>
                <div className="grid gap-3 grid-cols-3">
                  {VEHICLE_OPTIONS.map((vehicle) => (
                    <button
                      key={vehicle.type}
                      type="button"
                      className={`rounded-xl border px-3 py-3 text-center transition-all duration-200 ${
                        registerForm.vehicleType === vehicle.type
                          ? "border-green-400/60 bg-green-500/15 text-white shadow-lg shadow-green-500/20 scale-105"
                          : "border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5"
                      }`}
                      onClick={() => setRegisterForm((prev) => ({ ...prev, vehicleType: vehicle.type }))}
                    >
                      <div className="text-2xl mb-1">{vehicle.icon}</div>
                      <p className="text-xs font-semibold">{vehicle.label}</p>
                      <p className="text-xs text-slate-400">₹{vehicle.basePrice}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// Profile Settings Modal Component
function ProfileModal({
  isOpen,
  onClose,
  currentVehicleType,
  onUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentVehicleType?: VehicleType;
  onUpdate: (vehicleType: VehicleType) => void;
}) {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>(currentVehicleType || "CAR");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(selectedVehicle);
      onClose();
    } catch (error) {
      // Error handled in parent
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="card-surface w-full max-w-md p-8 relative animate-modal-slide-up shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-all duration-200 hover:rotate-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2 gradient-text">Driver Settings</h2>
          <p className="text-slate-400 text-sm">Select your vehicle type</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-400 mb-3 block font-semibold">
              Your Vehicle Type
            </label>
            <div className="grid gap-3 grid-cols-3">
              {VEHICLE_OPTIONS.map((vehicle) => (
                <button
                  key={vehicle.type}
                  type="button"
                  className={`rounded-xl border px-3 py-4 text-center transition-all duration-200 ${
                    selectedVehicle === vehicle.type
                      ? "border-blue-400/60 bg-blue-500/15 text-white shadow-lg shadow-blue-500/20 scale-105"
                      : "border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5"
                  }`}
                  onClick={() => setSelectedVehicle(vehicle.type)}
                >
                  <div className="text-3xl mb-2">{vehicle.icon}</div>
                  <p className="text-xs font-semibold mb-1">{vehicle.label}</p>
                  <p className="text-xs text-slate-400">{vehicle.capacity}P</p>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">₹{vehicle.basePrice} base</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-base font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "Saving..." : "Save Vehicle Type"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [rideForm, setRideForm] = useState({ pickupLocation: "", dropLocation: "", distanceKm: "", vehicleType: "CAR" as VehicleType });
  const [token, setToken] = useState<string | null>(null);
  const [sessionUser, setSessionUser] = useState<{ username: string; role: UserRole; vehicleType?: VehicleType } | null>(null);
  const [userRides, setUserRides] = useState<RideDto[]>([]);
  const [pendingRides, setPendingRides] = useState<RideDto[]>([]);
  const [acceptedByDriver, setAcceptedByDriver] = useState<RideDto[]>([]);
  const [completedRides, setCompletedRides] = useState<RideDto[]>([]);
  const [statusBanner, setStatusBanner] = useState<StatusBanner | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const isPassenger = sessionUser?.role === "ROLE_USER";
  const isDriver = sessionUser?.role === "ROLE_DRIVER";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("rideshare-session");
    if (stored) {
      const parsed = JSON.parse(stored) as { token: string; username: string; role: UserRole };
      setToken(parsed.token);
      setSessionUser({ username: parsed.username, role: parsed.role });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (token && sessionUser) {
      window.localStorage.setItem(
        "rideshare-session",
        JSON.stringify({ token, username: sessionUser.username, role: sessionUser.role })
      );
    } else {
      window.localStorage.removeItem("rideshare-session");
    }
  }, [token, sessionUser]);

  const showBanner = (tone: StatusBanner["tone"], message: string) => {
    setStatusBanner({ tone, message });
    setTimeout(() => setStatusBanner(null), 4000);
  };

  const handleAuthSuccess = (response: AuthResponse) => {
    setToken(response.token);
    setSessionUser({ username: response.username, role: response.role, vehicleType: response.vehicleType });
    showBanner("success", `Welcome ${response.username}! You're signed in as ${response.role.replace("ROLE_", "")}`);
  };

  const refreshUserRides = useCallback(async () => {
    if (!token) return;
    try {
      const rides = await apiRequest<RideDto[]>("/api/v1/rides", { token });
      // Sort by most recent first (assuming newer rides have higher IDs or add timestamp)
      setUserRides(rides.reverse());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load rides";
      showBanner("error", message);
    }
  }, [token]);

  const refreshPendingRides = useCallback(async () => {
    if (!token) return;
    try {
      const rides = await apiRequest<RideDto[]>("/api/v1/rides/pending", { token });
      // Sort by most recent first
      setPendingRides(rides.reverse());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load requests";
      showBanner("error", message);
    }
  }, [token]);

  const refreshDriverRides = useCallback(async () => {
    if (!token) return;
    try {
      const rides = await apiRequest<RideDto[]>("/api/v1/rides/driver/my-rides", { token });
      const accepted = rides.filter(ride => ride.status === "ACCEPTED");
      const completed = rides.filter(ride => ride.status === "COMPLETED");
      setAcceptedByDriver(accepted);
      setCompletedRides(completed);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load rides";
      showBanner("error", message);
    }
  }, [token]);

  useEffect(() => {
    if (!token || !sessionUser) return;
    if (sessionUser.role === "ROLE_USER") {
      refreshUserRides();
    } else if (sessionUser.role === "ROLE_DRIVER") {
      refreshPendingRides();
      refreshDriverRides();
    }
  }, [token, sessionUser, refreshPendingRides, refreshUserRides, refreshDriverRides]);

  const handleUpdateProfile = async (vehicleType: VehicleType) => {
    if (!token) return;
    try {
      const profile = await apiRequest<UserProfile>("/api/v1/user/profile", {
        method: "PUT",
        body: { vehicleType },
        token,
      });
      setSessionUser(prev => prev ? { ...prev, vehicleType: profile.vehicleType } : null);
      showBanner("success", `Vehicle type updated to ${getVehicleOption(vehicleType)?.icon} ${getVehicleOption(vehicleType)?.label}`);
      
      // Refresh pending rides to show only relevant vehicle types
      if (sessionUser?.role === "ROLE_DRIVER") {
        await refreshPendingRides();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      showBanner("error", message);
      throw error;
    }
  };

  const handleCreateRide = async () => {
    if (!token) return;
    setLoadingKey("create-ride");
    try {
      await apiRequest<RideDto>("/api/v1/rides", {
        method: "POST",
        body: {
          pickupLocation: rideForm.pickupLocation,
          dropLocation: rideForm.dropLocation,
          distanceKm: parseFloat(rideForm.distanceKm),
          vehicleType: rideForm.vehicleType,
        },
        token,
      });
      setRideForm({ pickupLocation: "", dropLocation: "", distanceKm: "", vehicleType: "CAR" });
      await refreshUserRides();
      const vehicle = getVehicleOption(rideForm.vehicleType);
      showBanner("success", `${vehicle?.icon} ${vehicle?.label} requested successfully! Waiting for a driver.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not create ride";
      showBanner("error", message);
    } finally {
      setLoadingKey(null);
    }
  };

  const handleAcceptRide = async (rideId: string) => {
    if (!token) return;
    setLoadingKey(`accept-${rideId}`);
    try {
      const ride = await apiRequest<RideDto>(`/api/v1/rides/accept/${rideId}`, {
        method: "POST",
        token,
      });
      await refreshPendingRides();
      await refreshDriverRides();
      showBanner("success", `Ride accepted! You'll earn ₹${ride.driverRevenue?.toFixed(2) || '0'}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to accept ride";
      showBanner("error", message);
    } finally {
      setLoadingKey(null);
    }
  };

  const handleCompleteRide = async (rideId: string) => {
    if (!token) return;
    setLoadingKey(`complete-${rideId}`);
    try {
      const ride = await apiRequest<RideDto>(`/api/v1/rides/complete/${rideId}`, {
        method: "POST",
        token,
      });
      if (isPassenger) {
        await refreshUserRides();
        showBanner("success", `Ride completed successfully!`);
      }
      if (isDriver) {
        await refreshDriverRides();
        const earnings = ride.driverRevenue || 0;
        showBanner("success", `Ride completed! You earned ₹${earnings.toFixed(2)} 💰`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to complete ride";
      showBanner("error", message);
    } finally {
      setLoadingKey(null);
    }
  };

  const resetSession = () => {
    setToken(null);
    setSessionUser(null);
    setUserRides([]);
    setPendingRides([]);
    setAcceptedByDriver([]);
    setCompletedRides([]);
    showBanner("success", "Signed out successfully.");
  };

  const ridesForCompletion = useMemo(() => {
    if (isPassenger) return userRides.filter((ride) => ride.status === "ACCEPTED");
    if (isDriver) return acceptedByDriver;
    return [];
  }, [acceptedByDriver, isDriver, isPassenger, userRides]);

  return (
    <>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        currentVehicleType={sessionUser?.vehicleType}
        onUpdate={handleUpdateProfile}
      />

      <div className="min-h-screen px-4 py-8 md:px-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <header className="card-surface glowing-border relative overflow-hidden px-8 py-10">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
              <div>
                <div className="chip mb-4 inline-flex text-xs tracking-[0.3em] text-slate-300">
                  Spring Boot · MongoDB · JWT · Validation
                </div>
                <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                  🚗 RideShare Platform
                </h1>
                <p className="mt-3 max-w-2xl text-base text-slate-300">
                  Modern ride-sharing backend with real-time ride management, JWT authentication, and role-based access control.
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                {sessionUser ? (
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-5 min-w-[240px] backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Signed in as</span>
                      <button
                        onClick={resetSession}
                        className="text-xs text-slate-400 hover:text-rose-400 transition-colors duration-200 font-medium"
                      >
                        Sign out
                      </button>
                    </div>
                    <p className="text-xl font-bold text-white mb-3">{sessionUser.username}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                        {sessionUser.role === "ROLE_USER" ? "🚗 Passenger" : "👨‍✈️ Driver"}
                      </span>
                      {sessionUser.role === "ROLE_DRIVER" && sessionUser.vehicleType && (
                        <span className="rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 px-3 py-1.5 text-xs font-semibold text-blue-200">
                          {getVehicleOption(sessionUser.vehicleType)?.icon} {getVehicleOption(sessionUser.vehicleType)?.label}
                        </span>
                      )}
                      {sessionUser.role === "ROLE_DRIVER" && (
                        <button
                          onClick={() => setShowProfileModal(true)}
                          className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                        >
                          ⚙️ Settings
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-base font-semibold text-white transition hover:brightness-110"
                  >
                    Sign In / Sign Up
                  </button>
                )}
              </div>
            </div>

            {statusBanner && (
              <div
                className={`mt-6 rounded-2xl border px-5 py-3.5 text-sm font-medium backdrop-blur-sm ${
                  statusBanner.tone === "success"
                    ? "border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 to-green-500/10 text-emerald-200 shadow-lg shadow-emerald-500/10"
                    : "border-rose-500/40 bg-gradient-to-r from-rose-500/15 to-red-500/10 text-rose-200 shadow-lg shadow-rose-500/10"
                }`}
              >
                {statusBanner.message}
              </div>
            )}
          </header>

          {/* Main Content */}
          {!sessionUser ? (
            <div className="card-surface px-8 py-16 text-center">
              <div className="mx-auto max-w-md space-y-6">
                <div className="text-6xl">🚕</div>
                <h2 className="text-3xl font-bold text-white">Get Started</h2>
                <p className="text-slate-300">
                  Sign in or create an account to start requesting rides or driving for RideShare.
                </p>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-8 py-3 text-base font-semibold text-white transition hover:brightness-110"
                >
                  Get Started Now
                </button>
              </div>
            </div>
          ) : (
            <main className="grid gap-6 lg:grid-cols-2">
              {/* Passenger Section */}
              {isPassenger && (
                <>
                  <section className="card-surface px-6 py-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="text-3xl">🚗</div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Request Ride</p>
                        <h2 className="text-2xl font-semibold text-white">Book Your Trip</h2>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Pickup Location</label>
                        <input
                          type="text"
                          value={rideForm.pickupLocation}
                          onChange={(e) => setRideForm((prev) => ({ ...prev, pickupLocation: e.target.value }))}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/[0.05] focus:outline-none transition-all duration-200"
                          placeholder="e.g., Koramangala"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Drop Location</label>
                        <input
                          type="text"
                          value={rideForm.dropLocation}
                          onChange={(e) => setRideForm((prev) => ({ ...prev, dropLocation: e.target.value }))}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/[0.05] focus:outline-none transition-all duration-200"
                          placeholder="e.g., Indiranagar"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 block">Select Vehicle Type</label>
                        <div className="grid gap-3 grid-cols-3">
                          {VEHICLE_OPTIONS.map((vehicle) => (
                            <button
                              key={vehicle.type}
                              type="button"
                              className={`rounded-xl border px-3 py-3 text-center transition-all duration-200 ${
                                rideForm.vehicleType === vehicle.type
                                  ? "border-blue-400/60 bg-blue-500/15 text-white shadow-lg shadow-blue-500/20 scale-105"
                                  : "border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/5"
                              }`}
                              onClick={() => setRideForm((prev) => ({ ...prev, vehicleType: vehicle.type }))}
                            >
                              <div className="text-2xl mb-1">{vehicle.icon}</div>
                              <p className="text-xs font-semibold">{vehicle.label}</p>
                              <p className="text-xs text-slate-400">{vehicle.capacity}P • ₹{vehicle.basePrice}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Distance (km)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          value={rideForm.distanceKm}
                          onChange={(e) => setRideForm((prev) => ({ ...prev, distanceKm: e.target.value }))}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-slate-500 focus:border-blue-400/60 focus:bg-white/[0.05] focus:outline-none transition-all duration-200"
                          placeholder="e.g., 5.5"
                        />
                        {rideForm.distanceKm && parseFloat(rideForm.distanceKm) > 0 && (
                          <div className="mt-3 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 to-green-500/10 p-4 backdrop-blur-sm shadow-lg shadow-emerald-500/10">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-slate-300 font-medium">Estimated Fare:</span>
                              <span className="text-2xl font-bold text-emerald-200">
                                ₹{(() => {
                                  const vehicle = getVehicleOption(rideForm.vehicleType);
                                  const basePrice = vehicle?.basePrice || 50;
                                  return (basePrice + parseFloat(rideForm.distanceKm) * 10).toFixed(2);
                                })()}
                              </span>
                            </div>
                            <div className="mt-2 text-xs text-slate-400 font-medium">
                              Base ₹{getVehicleOption(rideForm.vehicleType)?.basePrice || 50} + ₹10/km × {parseFloat(rideForm.distanceKm).toFixed(1)} km
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={handleCreateRide}
                        disabled={loadingKey === "create-ride"}
                        className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingKey === "create-ride" ? "Requesting..." : "Request Ride"}
                      </button>
                    </div>
                  </section>

                  <section className="card-surface px-6 py-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">📋</div>
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">My Rides</p>
                          <h2 className="text-2xl font-semibold text-white">All Trips</h2>
                        </div>
                      </div>
                      <button
                        onClick={refreshUserRides}
                        className="text-sm text-slate-300 hover:text-white transition"
                      >
                        🔄 Refresh
                      </button>
                    </div>

                    {userRides.length > 0 && (
                      <div className="mb-4 rounded-xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 p-5 backdrop-blur-sm shadow-lg">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Requested</p>
                            <p className="text-2xl font-bold text-amber-200">
                              {userRides.filter(r => r.status === "REQUESTED").length}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">In Progress</p>
                            <p className="text-2xl font-bold text-sky-200">
                              {userRides.filter(r => r.status === "ACCEPTED").length}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-1">Completed</p>
                            <p className="text-2xl font-bold text-emerald-200">
                              {userRides.filter(r => r.status === "COMPLETED").length}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {userRides.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                          <div className="text-4xl mb-3">📭</div>
                          <p>No rides yet. Request your first ride!</p>
                        </div>
                      ) : (
                        userRides.map((ride) => (
                          <article
                            key={ride.id}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 hover:bg-white/10 transition"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                  ride.status === "REQUESTED"
                                    ? "bg-amber-500/20 text-amber-200"
                                    : ride.status === "ACCEPTED"
                                      ? "bg-sky-500/20 text-sky-200"
                                      : "bg-emerald-500/20 text-emerald-200"
                                }`}
                              >
                                {ride.status}
                              </span>
                              {ride.fare && (
                                <span className="text-lg font-bold text-emerald-200">₹{ride.fare.toFixed(2)}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              {ride.vehicleType && (
                                <span className="text-xl">{getVehicleOption(ride.vehicleType)?.icon}</span>
                              )}
                              <p className="text-base font-semibold text-white">
                                {ride.pickupLocation} → {ride.dropLocation}
                              </p>
                            </div>
                            {ride.vehicleType && (
                              <p className="text-xs text-blue-300 font-medium mb-1">
                                {getVehicleOption(ride.vehicleType)?.label} • {getVehicleOption(ride.vehicleType)?.capacity}P
                              </p>
                            )}
                            {ride.distanceKm && (
                              <p className="text-xs text-slate-400">Distance: {ride.distanceKm.toFixed(1)} km</p>
                            )}
                            {ride.driverUsername && (
                              <p className="text-xs text-slate-400">Driver: {ride.driverUsername}</p>
                            )}
                            <div className="mt-3 flex items-center justify-between text-xs">
                              <div className="space-y-0.5">
                                <p className="text-slate-500">
                                  <span className="text-slate-400">Requested:</span> {formatRelativeTime(ride.createdAt)}
                                </p>
                                {ride.acceptedAt && (
                                  <p className="text-slate-500">
                                    <span className="text-sky-400">Accepted:</span> {formatRelativeTime(ride.acceptedAt)}
                                  </p>
                                )}
                                {ride.completedAt && (
                                  <p className="text-slate-500">
                                    <span className="text-emerald-400">Completed:</span> {formatRelativeTime(ride.completedAt)}
                                    {ride.acceptedAt && <span className="ml-2 text-slate-600">({calculateDuration(ride.acceptedAt, ride.completedAt)})</span>}
                                  </p>
                                )}
                              </div>
                            </div>
                            {ride.status === "ACCEPTED" && (
                              <div className="mt-3 flex justify-end">
                                <button
                                  onClick={() => handleCompleteRide(ride.id)}
                                  disabled={loadingKey === `complete-${ride.id}`}
                                  className="rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/30 transition disabled:opacity-60"
                                >
                                  {loadingKey === `complete-${ride.id}` ? "Completing..." : "Complete Ride"}
                                </button>
                              </div>
                            )}
                          </article>
                        ))
                      )}
                    </div>
                  </section>
                </>
              )}

              {/* Driver Section */}
              {isDriver && (
                <>
                  <section className="card-surface px-6 py-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">📡</div>
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Available Rides</p>
                          <h2 className="text-2xl font-semibold text-white">Pending Requests</h2>
                        </div>
                      </div>
                      <button
                        onClick={refreshPendingRides}
                        className="text-sm text-slate-300 hover:text-white transition"
                      >
                        🔄 Refresh
                      </button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {pendingRides.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                          <div className="text-4xl mb-3">⏳</div>
                          <p>No pending rides at the moment.</p>
                        </div>
                      ) : (
                        pendingRides.map((ride) => (
                          <article
                            key={ride.id}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 hover:bg-white/10 transition"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  {ride.vehicleType && (
                                    <span className="text-xl">{getVehicleOption(ride.vehicleType)?.icon}</span>
                                  )}
                                  <p className="text-base font-semibold text-white">
                                    {ride.pickupLocation} → {ride.dropLocation}
                                  </p>
                                </div>
                                {ride.vehicleType && (
                                  <p className="text-xs text-blue-300 font-medium mb-1">
                                    {getVehicleOption(ride.vehicleType)?.label}
                                  </p>
                                )}
                                {ride.distanceKm && (
                                  <p className="text-xs text-slate-400 mt-1">Distance: {ride.distanceKm.toFixed(1)} km</p>
                                )}
                              </div>
                              <div className="text-right">
                                {ride.fare && ride.driverRevenue && (
                                  <div className="mb-2">
                                    <p className="text-xs text-slate-400">You earn</p>
                                    <p className="text-lg font-bold text-emerald-200">₹{ride.driverRevenue.toFixed(2)}</p>
                                    <p className="text-xs text-slate-500">of ₹{ride.fare.toFixed(2)}</p>
                                  </div>
                                )}
                                <button
                                  onClick={() => handleAcceptRide(ride.id)}
                                  disabled={loadingKey === `accept-${ride.id}`}
                                  className="rounded-full bg-sky-500/20 px-4 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-500/30 transition disabled:opacity-60"
                                >
                                  {loadingKey === `accept-${ride.id}` ? "Accepting..." : "Accept"}
                                </button>
                              </div>
                            </div>
                            {ride.passengerUsername && (
                              <p className="text-xs text-slate-400">Passenger: {ride.passengerUsername}</p>
                            )}
                            <div className="mt-2 flex items-center justify-between">
                              <p className="text-xs text-slate-500">
                                <span className="text-slate-400">Requested:</span> {formatRelativeTime(ride.createdAt)}
                              </p>
                              <p className="text-xs text-slate-600">ID: {ride.id.slice(0, 8)}...</p>
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </section>

                  <section className="card-surface px-6 py-8">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">✅</div>
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Active Rides</p>
                          <h2 className="text-2xl font-semibold text-white">My Accepted Trips</h2>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {acceptedByDriver.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                          <div className="text-4xl mb-3">🚙</div>
                          <p>No active rides. Accept a ride to get started!</p>
                        </div>
                      ) : (
                        acceptedByDriver.map((ride) => (
                          <article
                            key={ride.id}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 hover:bg-white/10 transition"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {ride.vehicleType && (
                                <span className="text-xl">{getVehicleOption(ride.vehicleType)?.icon}</span>
                              )}
                              <p className="text-base font-semibold text-white">
                                {ride.pickupLocation} → {ride.dropLocation}
                              </p>
                            </div>
                            {ride.vehicleType && (
                              <p className="text-xs text-blue-300 font-medium mb-1">
                                {getVehicleOption(ride.vehicleType)?.label}
                              </p>
                            )}
                            {ride.passengerUsername && (
                              <p className="text-xs text-slate-400">Passenger: {ride.passengerUsername}</p>
                            )}
                            <div className="mt-2 space-y-0.5 text-xs">
                              <p className="text-slate-500">
                                <span className="text-slate-400">Requested:</span> {formatRelativeTime(ride.createdAt)}
                              </p>
                              {ride.acceptedAt && (
                                <p className="text-slate-500">
                                  <span className="text-sky-400">Accepted:</span> {formatRelativeTime(ride.acceptedAt)}
                                </p>
                              )}
                            </div>
                            <div className="mt-3 flex justify-end">
                              <button
                                onClick={() => handleCompleteRide(ride.id)}
                                disabled={loadingKey === `complete-${ride.id}`}
                                className="rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/30 transition disabled:opacity-60"
                              >
                                {loadingKey === `complete-${ride.id}` ? "Completing..." : "Complete Ride"}
                              </button>
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </section>

                  {/* Driver Earnings Section */}
                  <section className="card-surface px-6 py-8 lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">💰</div>
                        <div>
                          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Earnings</p>
                          <h2 className="text-2xl font-semibold text-white">Completed Rides & Income</h2>
                        </div>
                      </div>
                      <button
                        onClick={refreshDriverRides}
                        className="text-sm text-slate-300 hover:text-white transition"
                      >
                        🔄 Refresh
                      </button>
                    </div>

                    {completedRides.length > 0 && (
                      <div className="mb-6 rounded-xl bg-gradient-to-br from-emerald-500/12 via-green-500/10 to-teal-500/10 border border-emerald-500/25 p-6 backdrop-blur-sm shadow-xl shadow-emerald-500/10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div>
                            <p className="text-xs text-slate-400 mb-2">Total Rides</p>
                            <p className="text-3xl font-bold text-white">{completedRides.length}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-2">Total Earned</p>
                            <p className="text-3xl font-bold text-emerald-200">
                              ₹{completedRides.reduce((sum, ride) => sum + (ride.driverRevenue || 0), 0).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-2">Avg per Ride</p>
                            <p className="text-3xl font-bold text-sky-200">
                              ₹{(completedRides.reduce((sum, ride) => sum + (ride.driverRevenue || 0), 0) / completedRides.length).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 mb-2">Total Distance</p>
                            <p className="text-3xl font-bold text-purple-200">
                              {completedRides.reduce((sum, ride) => sum + (ride.distanceKm || 0), 0).toFixed(1)} km
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {completedRides.length === 0 ? (
                        <div className="text-center py-8 text-slate-400">
                          <div className="text-4xl mb-3">🎯</div>
                          <p>No completed rides yet. Accept and complete rides to start earning!</p>
                        </div>
                      ) : (
                        completedRides.map((ride) => (
                          <article
                            key={ride.id}
                            className="rounded-xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.08] to-green-500/[0.05] px-4 py-4 hover:border-emerald-500/40 hover:bg-gradient-to-br hover:from-emerald-500/[0.12] hover:to-green-500/[0.08] transition-all duration-300 backdrop-blur-sm shadow-lg shadow-emerald-500/5"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                                    ✓ COMPLETED
                                  </span>
                                  {ride.vehicleType && (
                                    <span className="text-lg">{getVehicleOption(ride.vehicleType)?.icon}</span>
                                  )}
                                </div>
                                <p className="text-base font-semibold text-white mb-1">
                                  {ride.pickupLocation} → {ride.dropLocation}
                                </p>
                                {ride.vehicleType && (
                                  <p className="text-xs text-blue-300 font-medium mb-1">
                                    {getVehicleOption(ride.vehicleType)?.label}
                                  </p>
                                )}
                                {ride.distanceKm && (
                                  <p className="text-xs text-slate-400">Distance: {ride.distanceKm.toFixed(1)} km</p>
                                )}
                                {ride.passengerUsername && (
                                  <p className="text-xs text-slate-400">Passenger: {ride.passengerUsername}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-slate-400 mb-1">You Earned</p>
                                <p className="text-2xl font-bold text-emerald-200">
                                  ₹{(ride.driverRevenue || 0).toFixed(2)}
                                </p>
                                {ride.fare && ride.companyRevenue && (
                                  <div className="mt-2 text-xs text-slate-500">
                                    <p>Total: ₹{ride.fare.toFixed(2)}</p>
                                    <p>Platform: ₹{ride.companyRevenue.toFixed(2)}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-emerald-500/20">
                              <div className="grid grid-cols-3 gap-3 text-xs">
                                <div>
                                  <p className="text-slate-500 mb-0.5">Requested</p>
                                  <p className="text-slate-400 font-medium">{formatRelativeTime(ride.createdAt)}</p>
                                </div>
                                {ride.acceptedAt && (
                                  <div>
                                    <p className="text-slate-500 mb-0.5">Accepted</p>
                                    <p className="text-sky-400 font-medium">{formatRelativeTime(ride.acceptedAt)}</p>
                                  </div>
                                )}
                                {ride.completedAt && (
                                  <div>
                                    <p className="text-slate-500 mb-0.5">Completed</p>
                                    <p className="text-emerald-400 font-medium">{formatRelativeTime(ride.completedAt)}</p>
                                  </div>
                                )}
                              </div>
                              {ride.acceptedAt && ride.completedAt && (
                                <div className="mt-2 text-center">
                                  <p className="text-xs text-slate-500">
                                    Trip Duration: <span className="text-slate-400 font-semibold">{calculateDuration(ride.acceptedAt, ride.completedAt)}</span>
                                  </p>
                                </div>
                              )}
                            </div>
                          </article>
                        ))
                      )}
                    </div>
                  </section>
                </>
              )}
            </main>
          )}

          {/* Footer */}
          <footer className="text-center text-sm text-slate-400 py-4">
            <p>Made With Love By SPD ❤️❤️</p>
          </footer>
        </div>
      </div>
    </>
  );
}
