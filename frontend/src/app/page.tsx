"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest, API_BASE_URL } from "@/lib/api";
import type { AuthResponse, RideDto, UserRole } from "@/lib/types";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="card-surface w-full max-w-md p-8 relative animate-modal-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to RideShare</h2>
          <p className="text-slate-400 text-sm">Sign in or create an account to get started</p>
        </div>

        <div className="flex gap-2 rounded-full bg-white/5 p-1 mb-6">
          {["login", "register"].map((mode) => (
            <button
              key={mode}
              onClick={() => setAuthMode(mode as AuthMode)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                authMode === mode ? "bg-white text-slate-900" : "text-slate-300"
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
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
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
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
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
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
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
                className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
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
                    className={`rounded-xl border px-4 py-3 text-left transition ${
                      registerForm.role === option.role
                        ? "border-sky-400/70 bg-sky-500/10 text-white"
                        : "border-white/10 text-slate-300 hover:border-white/20"
                    }`}
                    onClick={() => setRegisterForm((prev) => ({ ...prev, role: option.role }))}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <p className="text-sm font-semibold">{option.label}</p>
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-3 text-base font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [rideForm, setRideForm] = useState({ pickupLocation: "", dropLocation: "" });
  const [token, setToken] = useState<string | null>(null);
  const [sessionUser, setSessionUser] = useState<{ username: string; role: UserRole } | null>(null);
  const [userRides, setUserRides] = useState<RideDto[]>([]);
  const [pendingRides, setPendingRides] = useState<RideDto[]>([]);
  const [acceptedByDriver, setAcceptedByDriver] = useState<RideDto[]>([]);
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
    setSessionUser({ username: response.username, role: response.role });
    showBanner("success", `Welcome ${response.username}! You're signed in as ${response.role.replace("ROLE_", "")}`);
  };

  const refreshUserRides = useCallback(async () => {
    if (!token) return;
    try {
      const rides = await apiRequest<RideDto[]>("/api/v1/user/rides", { token });
      setUserRides(rides);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load rides";
      showBanner("error", message);
    }
  }, [token]);

  const refreshPendingRides = useCallback(async () => {
    if (!token) return;
    try {
      const rides = await apiRequest<RideDto[]>("/api/v1/driver/rides/requests", { token });
      setPendingRides(rides);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load requests";
      showBanner("error", message);
    }
  }, [token]);

  useEffect(() => {
    if (!token || !sessionUser) return;
    if (sessionUser.role === "ROLE_USER") {
      refreshUserRides();
    } else if (sessionUser.role === "ROLE_DRIVER") {
      refreshPendingRides();
    }
  }, [token, sessionUser, refreshPendingRides, refreshUserRides]);

  const handleCreateRide = async () => {
    if (!token) return;
    setLoadingKey("create-ride");
    try {
      await apiRequest<RideDto>("/api/v1/rides", {
        method: "POST",
        body: rideForm,
        token,
      });
      setRideForm({ pickupLocation: "", dropLocation: "" });
      await refreshUserRides();
      showBanner("success", "Ride requested successfully! Waiting for a driver.");
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
      const ride = await apiRequest<RideDto>(`/api/v1/driver/rides/${rideId}/accept`, {
        method: "POST",
        token,
      });
      setAcceptedByDriver((prev) => [ride, ...prev.filter((r) => r.id !== ride.id)]);
      await refreshPendingRides();
      showBanner("success", `Ride accepted! You're now assigned to this trip.`);
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
      const ride = await apiRequest<RideDto>(`/api/v1/rides/${rideId}/complete`, {
        method: "POST",
        token,
      });
      if (isPassenger) {
        await refreshUserRides();
      }
      if (isDriver) {
        setAcceptedByDriver((prev) => prev.filter((r) => r.id !== ride.id));
      }
      showBanner("success", `Ride completed successfully!`);
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

      <div className="min-h-screen px-4 py-8 md:px-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <header className="card-surface glowing-border relative overflow-hidden px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="chip mb-4 inline-flex bg-white/5 text-xs tracking-[0.3em] text-slate-200">
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
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 min-w-[240px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-wider text-slate-400">Signed in as</span>
                      <button
                        onClick={resetSession}
                        className="text-xs text-slate-400 hover:text-white transition"
                      >
                        Sign out
                      </button>
                    </div>
                    <p className="text-xl font-bold text-white">{sessionUser.username}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                        {sessionUser.role === "ROLE_USER" ? "🚗 Passenger" : "👨‍✈️ Driver"}
                      </span>
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
                className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                  statusBanner.tone === "success"
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                    : "border-rose-500/40 bg-rose-500/10 text-rose-200"
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
                        <label className="text-xs uppercase tracking-wider text-slate-400">Pickup Location</label>
                        <input
                          type="text"
                          value={rideForm.pickupLocation}
                          onChange={(e) => setRideForm((prev) => ({ ...prev, pickupLocation: e.target.value }))}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
                          placeholder="e.g., Koramangala"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-slate-400">Drop Location</label>
                        <input
                          type="text"
                          value={rideForm.dropLocation}
                          onChange={(e) => setRideForm((prev) => ({ ...prev, dropLocation: e.target.value }))}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
                          placeholder="e.g., Indiranagar"
                        />
                      </div>
                      <button
                        onClick={handleCreateRide}
                        disabled={loadingKey === "create-ride"}
                        className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
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
                          <h2 className="text-2xl font-semibold text-white">Trip History</h2>
                        </div>
                      </div>
                      <button
                        onClick={refreshUserRides}
                        className="text-sm text-slate-300 hover:text-white transition"
                      >
                        🔄 Refresh
                      </button>
                    </div>

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
                            </div>
                            <p className="text-base font-semibold text-white mb-1">
                              {ride.pickupLocation} → {ride.dropLocation}
                            </p>
                            {ride.driverUsername && (
                              <p className="text-xs text-slate-400">Driver: {ride.driverUsername}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-2">ID: {ride.id.slice(0, 8)}...</p>
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
                              <p className="text-base font-semibold text-white">
                                {ride.pickupLocation} → {ride.dropLocation}
                              </p>
                              <button
                                onClick={() => handleAcceptRide(ride.id)}
                                disabled={loadingKey === `accept-${ride.id}`}
                                className="rounded-full bg-sky-500/20 px-4 py-2 text-xs font-semibold text-sky-200 hover:bg-sky-500/30 transition disabled:opacity-60"
                              >
                                {loadingKey === `accept-${ride.id}` ? "Accepting..." : "Accept"}
                              </button>
                            </div>
                            {ride.passengerUsername && (
                              <p className="text-xs text-slate-400">Passenger: {ride.passengerUsername}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-2">ID: {ride.id.slice(0, 8)}...</p>
                          </article>
                        ))
                      )}
                    </div>
                  </section>

                  <section className="card-surface px-6 py-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="text-3xl">✅</div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Active Rides</p>
                        <h2 className="text-2xl font-semibold text-white">My Accepted Trips</h2>
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
                            <p className="text-base font-semibold text-white mb-1">
                              {ride.pickupLocation} → {ride.dropLocation}
                            </p>
                            {ride.passengerUsername && (
                              <p className="text-xs text-slate-400">Passenger: {ride.passengerUsername}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-2">ID: {ride.id.slice(0, 8)}...</p>
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
