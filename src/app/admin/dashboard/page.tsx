"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBoxOpen, FaStar, FaCar, FaUsers, FaArrowRight } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "../../../lib/supabase";
import { Package } from "../../../types";

const COLORS = ["#3b82f6", "#eab308", "#22c55e", "#ef4444", "#a855f7", "#ec4899", "#f97316"];

interface DashboardMetrics {
  totalPackages: number;
  popularPackages: number;
  totalVehicles: number;
  totalAdmins: number;
}

interface VehicleStat {
  name: string;
  value: number;
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalPackages: 0,
    popularPackages: 0,
    totalVehicles: 0,
    totalAdmins: 0,
  });
  const [vehicleStats, setVehicleStats] = useState<VehicleStat[]>([]);
  const [adminName, setAdminName] = useState<string>("Admin");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);

      // Fetch user session for name
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email) {
        const nameFromEmail = authData.user.email.split("@")[0];
        setAdminName(nameFromEmail);
      }

      // Fetch packages
      const { data: packagesData, error: packagesError } = await supabase
        .from("packages")
        .select("*");

      // Fetch admins 
      const { data: adminsData, error: adminsError } = await supabase
        .from("admin_users_view")
        .select("id");

      if (!packagesError && packagesData) {
        const pkgs = packagesData as Package[];
        const total = pkgs.length;
        const popular = pkgs.filter((p) => p.is_popular).length;

        // Group by vehicle
        const vehicleCounts: Record<string, number> = {};
        pkgs.forEach((p) => {
          const v = p.vehicle?.trim() || "Tidak Diketahui";
          vehicleCounts[v] = (vehicleCounts[v] || 0) + 1;
        });

        const uniqueVehicles = Object.keys(vehicleCounts).length;
        const statsArray = Object.keys(vehicleCounts).map((key) => ({
          name: key,
          value: vehicleCounts[key],
        })).sort((a, b) => b.value - a.value);

        setVehicleStats(statsArray);

        setMetrics((prev) => ({
          ...prev,
          totalPackages: total,
          popularPackages: popular,
          totalVehicles: uniqueVehicles,
        }));
      }

      if (!adminsError && adminsData) {
        setMetrics((prev) => ({
          ...prev,
          totalAdmins: adminsData.length,
        }));
      }

      setIsLoading(false);
    }

    void fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Section: Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 p-8 shadow-lg">
        {/* Decorative circle */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-blue-300/20 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row md:gap-0">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              Selamat datang kembali, {adminName}!
            </h1>
            <p className="mt-2 max-w-xl text-blue-50">
              Berikut adalah ringkasan data paket kursus dan aktivitas admin Anda hari ini. Kelola sistem LPK Sadewa dengan mudah dan cepat.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link
                href="/admin/packages"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary transition-transform hover:scale-105 hover:bg-gray-50 hover:shadow-md"
              >
                Kelola Paket <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Paket", value: metrics.totalPackages, icon: FaBoxOpen, color: "text-blue-600", bg: "bg-blue-100" },
          { title: "Paket Populer", value: metrics.popularPackages, icon: FaStar, color: "text-yellow-600", bg: "bg-yellow-100" },
          { title: "Varian Kendaraan", value: metrics.totalVehicles, icon: FaCar, color: "text-green-600", bg: "bg-green-100" },
          { title: "Admin Aktif", value: metrics.totalAdmins, icon: FaUsers, color: "text-purple-600", bg: "bg-purple-100" },
        ].map((stat, idx) => (
          <div key={idx} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? "-" : stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section: Charts */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Distribusi Kendaraan Paket</h2>
          <span className="text-sm font-semibold text-gray-500">
            {metrics.totalPackages} total
          </span>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-primary"></div>
          </div>
        ) : vehicleStats.length === 0 ? (
          <div className="flex h-64 items-center justify-center text-gray-500">
            Belum ada data kendaraan.
          </div>
        ) : (
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-start lg:gap-16">
            {/* Donut Chart (Left) */}
            <div className="relative h-64 w-full md:w-1/2 lg:w-1/3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {vehicleStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    itemStyle={{ fontWeight: "bold" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Inner Text for Donut */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-gray-900">{metrics.totalPackages}</p>
                  <p className="text-xs font-semibold text-gray-500">Paket</p>
                </div>
              </div>
            </div>

            {/* Horizontal Bars (Right) */}
            <div className="w-full flex-1 space-y-5 md:pt-4">
              {vehicleStats.map((stat, idx) => {
                const color = COLORS[idx % COLORS.length];
                const percentage = Math.round((stat.value / metrics.totalPackages) * 100) || 0;
                
                return (
                  <div key={idx} className="relative">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 font-semibold text-gray-700">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }}></span>
                        {stat.name}
                      </div>
                      <span className="font-bold text-gray-900">{stat.value}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
