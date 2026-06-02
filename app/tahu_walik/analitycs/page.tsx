"use client";
import { useState, useEffect } from "react";
import { FiUsers, FiEye, FiClock, FiSmartphone, FiMonitor, FiCalendar, FiArrowUpRight, FiTrendingUp } from "react-icons/fi";
import AdminNavbar from "../components/AdminNavbar";

interface VisitLog {
  id: number;
  path: string;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
}

interface ChartItem {
  label: string;
  count: number;
}

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  viewsToday: number;
  viewsYesterday: number;
  viewsThisMonth: number;
  chartData7d: ChartItem[];
  chartData30d: ChartItem[];
  chartDataAllTime: ChartItem[];
  hourStats: {
    pagi: number;
    siang: number;
    sore: number;
    malam: number;
  };
  deviceStats: {
    mobile: number;
    desktop: number;
  };
  recentLogs: VisitLog[];
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timescale, setTimescale] = useState<"7d" | "30d" | "all">("7d");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get browser/OS name from User Agent
  const parseUA = (uaString: string | null) => {
    if (!uaString) return { browser: "Unknown", os: "Unknown" };
    const ua = uaString.toLowerCase();
    
    let browser = "Lainnya";
    if (ua.includes("chrome") || ua.includes("crios")) browser = "Chrome";
    else if (ua.includes("safari") && !ua.includes("chrome") && !ua.includes("android")) browser = "Safari";
    else if (ua.includes("firefox")) browser = "Firefox";
    else if (ua.includes("edge")) browser = "Edge";
    
    let os = "Desktop";
    if (ua.includes("android")) os = "Android";
    else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";
    else if (ua.includes("windows")) os = "Windows";
    else if (ua.includes("macintosh") || ua.includes("mac os")) os = "macOS";
    else if (ua.includes("linux")) os = "Linux";

    return { browser, os };
  };

  // Anonymize IP address (e.g. 192.168.1.100 -> 192.168.1.xxx)
  const anonymizeIP = (ip: string | null) => {
    if (!ip) return "Anonim";
    if (ip === "::1" || ip === "127.0.0.1") return "Localhost";
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
    }
    return ip.slice(0, 15) + "...";
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-[#fff0c7] flex items-center justify-center pt-20">
          <div className="text-center">
            {/* Beautiful Custom Pepper Loader */}
            <div className="relative w-20 h-20 mx-auto mb-4 animate-bounce">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg border border-red-500 shadow-red-600/30">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C11.5 2 11 3 11 4.5C11 5.3 11.2 6.1 11.5 6.7C8.4 7.2 6 9.8 6 13C6 16.9 9.1 20 13 20C16.9 20 20 16.9 20 13C20 10 18 7.5 15.2 6.8C15.3 6.6 15.4 6.3 15.4 6C15.4 4.5 14.5 2 14 2C13.5 2 13 3.5 13 4.5C13 4.8 12.9 5.2 12.7 5.5C12.5 5.2 12.3 4.8 12.3 4.5C12.3 3.5 12.5 2 12 2Z" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-800 animate-pulse">Memuat Analitik Nuampoll...</h2>
            <p className="text-gray-500 text-sm mt-1">Sabar ya bro, lagi ngambil data ter-update</p>
          </div>
        </div>
      </>
    );
  }

  // Determine active chart data and parameters based on timescale selection
  let activeChartData: ChartItem[] = [];
  let chartTitle = "Kunjungan Harian (7 Hari Terakhir)";
  
  if (data) {
    if (timescale === "7d") {
      activeChartData = data.chartData7d;
      chartTitle = "Kunjungan Harian (7 Hari Terakhir)";
    } else if (timescale === "30d") {
      activeChartData = data.chartData30d;
      chartTitle = "Kunjungan Harian (30 Hari Terakhir)";
    } else {
      activeChartData = data.chartDataAllTime;
      chartTitle = "Kunjungan Bulanan (Semua Waktu)";
    }
  }

  const maxChartCount = Math.max(...activeChartData.map((d) => d.count), 1);

  // Time metrics calculations
  const totalHourVisits = (data?.hourStats.pagi || 0) + (data?.hourStats.siang || 0) + (data?.hourStats.sore || 0) + (data?.hourStats.malam || 0) || 1;
  const percentPagi = Math.round(((data?.hourStats.pagi || 0) / totalHourVisits) * 100);
  const percentSiang = Math.round(((data?.hourStats.siang || 0) / totalHourVisits) * 100);
  const percentSore = Math.round(((data?.hourStats.sore || 0) / totalHourVisits) * 100);
  const percentMalam = Math.round(((data?.hourStats.malam || 0) / totalHourVisits) * 100);

  // Device calculations
  const totalDeviceVisits = (data?.deviceStats.mobile || 0) + (data?.deviceStats.desktop || 0) || 1;
  const percentMobile = Math.round(((data?.deviceStats.mobile || 0) / totalDeviceVisits) * 100);
  const percentDesktop = Math.round(((data?.deviceStats.desktop || 0) / totalDeviceVisits) * 100);

  // Quick stats cards data (Now featuring 4 cards: All-Time, Monthly, Today, and Unique Visitors)
  const statCards = [
    {
      title: "Total Kunjungan",
      value: data?.totalViews.toLocaleString("id-ID") || 0,
      sub: "Seluruh waktu (All-Time)",
      icon: FiEye,
      color: "from-blue-600 to-indigo-600",
    },
    {
      title: "Bulan Ini",
      value: data?.viewsThisMonth.toLocaleString("id-ID") || 0,
      sub: "Bulan kalender berjalan",
      icon: FiTrendingUp,
      color: "from-purple-600 to-indigo-600",
    },
    {
      title: "Hari Ini",
      value: data?.viewsToday.toLocaleString("id-ID") || 0,
      sub: `Kemarin: ${data?.viewsYesterday || 0} kunjungan`,
      icon: FiCalendar,
      color: "from-red-600 to-orange-600",
      trend: data && data.viewsToday >= data.viewsYesterday,
    },
    {
      title: "Pengunjung Unik",
      value: data?.uniqueVisitors.toLocaleString("id-ID") || 0,
      sub: "Berdasarkan IP unik",
      icon: FiUsers,
      color: "from-green-600 to-emerald-600",
    },
  ];

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-[#fff0c7] pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Statistik <span className="text-red-600">Kunjungan</span>
              </h1>
              <p className="text-gray-600 mt-1">Pantau perkembangan performa dan statistik traffic website Anda secara real-time.</p>
            </div>
            <button
              onClick={fetchAnalytics}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-red-50 text-red-600 font-bold rounded-2xl transition-all shadow-md hover:shadow-lg border border-red-100 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Refresh Data
            </button>
          </div>

          {/* Quick Stats Grid (4 columns on larger screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] transition-all duration-300`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full -mr-12 -mt-12 group-hover:scale-125 transition-transform duration-500 opacity-50"></div>
                  <div className="space-y-2 relative z-10">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.title}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-gray-900">{card.value}</span>
                      {card.trend !== undefined && (
                        <span className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          card.trend ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {card.trend ? "+" : "-"}
                          <FiTrendingUp className="ml-0.5 w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">{card.sub}</p>
                  </div>
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-lg relative z-10`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Visualizations Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Custom Bar Chart - Dynamic History */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
                  <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <FiCalendar className="text-red-500" />
                    {chartTitle}
                  </h3>
                  
                  {/* Segmented Controller (Tab Switcher) for timescale selector */}
                  <div className="flex bg-gray-100 p-1 rounded-xl self-start sm:self-auto border border-gray-200/50">
                    {(["7d", "30d", "all"] as const).map((ts) => (
                      <button
                        key={ts}
                        onClick={() => setTimescale(ts)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          timescale === ts
                            ? "bg-[#111111] text-white shadow-md scale-105"
                            : "text-gray-500 hover:text-gray-800"
                        }`}
                      >
                        {ts === "7d" ? "7 Hari" : ts === "30d" ? "30 Hari" : "Semua"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Responsive CSS Chart */}
                <div className="h-64 flex items-end justify-between gap-1 sm:gap-2 px-2 pt-6 border-b border-gray-100">
                  {activeChartData.map((day, idx) => {
                    const barHeightPercent = (day.count / maxChartCount) * 85 + 5; // Min 5% height
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group h-full justify-end cursor-pointer">
                        {/* Tooltip on Hover */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#111] text-white text-xs font-bold py-1.5 px-2.5 rounded-lg mb-2 absolute transform -translate-y-12 shadow-md pointer-events-none z-10 whitespace-nowrap">
                          {day.count} views ({day.label})
                          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-[#111]"></div>
                        </div>

                        {/* Bar Segment */}
                        <div
                          style={{ height: `${barHeightPercent}%` }}
                          className={`w-full rounded-t-md transition-all duration-500 bg-red-500 group-hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.1)] group-hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] relative overflow-hidden`}
                        >
                          {/* Inner Shine Stripe */}
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20"></div>
                        </div>

                        {/* Label (Show all on 7d, show every 5th on 30d to prevent clutter, show all on Monthly) */}
                        <span className="text-[8px] sm:text-[10px] text-gray-400 font-bold mt-2.5 whitespace-nowrap">
                          {timescale === "30d" 
                            ? idx % 5 === 0 
                              ? day.label 
                              : "" 
                            : day.label
                          }
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 font-medium">
                <FiArrowUpRight className="text-green-500 w-4 h-4" />
                <span>Menampilkan traffic website berdasarkan filter waktu yang dipilih.</span>
              </div>
            </div>

            {/* Side Distribution Breakdown */}
            <div className="space-y-6">
              {/* Hour Distribution Cards */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-4">
                  <FiClock className="text-red-500" />
                  Waktu Kunjungan (30 Hari)
                </h3>
                <div className="space-y-3.5">
                  {[
                    { label: "Pagi (06.00 - 12.00)", count: data?.hourStats.pagi || 0, percent: percentPagi, color: "bg-amber-400" },
                    { label: "Siang (12.00 - 17.00)", count: data?.hourStats.siang || 0, percent: percentSiang, color: "bg-orange-500" },
                    { label: "Sore (17.00 - 21.00)", count: data?.hourStats.sore || 0, percent: percentSore, color: "bg-red-500" },
                    { label: "Malam (21.00 - 06.00)", count: data?.hourStats.malam || 0, percent: percentMalam, color: "bg-indigo-900" },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-gray-600">
                        <span>{item.label}</span>
                        <span>{item.count} ({item.percent}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${item.percent}%` }}
                          className={`${item.color} h-full rounded-full transition-all duration-500`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Devices Distribution Card */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-4">
                  <FiSmartphone className="text-red-500" />
                  Perangkat Pengunjung
                </h3>
                <div className="space-y-4">
                  {/* Progress Line */}
                  <div className="flex h-5 w-full rounded-full overflow-hidden bg-gray-100 shadow-inner">
                    <div
                      style={{ width: `${percentMobile}%` }}
                      className="bg-red-500 h-full transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold"
                    >
                      {percentMobile > 15 && `${percentMobile}%`}
                    </div>
                    <div
                      style={{ width: `${percentDesktop}%` }}
                      className="bg-[#111111] h-full transition-all duration-500 flex items-center justify-center text-[10px] text-white font-bold"
                    >
                      {percentDesktop > 15 && `${percentDesktop}%`}
                    </div>
                  </div>

                  {/* Badges Legend */}
                  <div className="flex justify-around">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <div className="w-3.5 h-3.5 rounded-full bg-red-500"></div>
                      <FiSmartphone className="w-4 h-4 text-gray-400" />
                      <span>Mobile ({data?.deviceStats.mobile || 0})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#111]"></div>
                      <FiMonitor className="w-4 h-4 text-gray-400" />
                      <span>Desktop ({data?.deviceStats.desktop || 0})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Logs Section */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <FiUsers className="text-red-500" />
                10 Kunjungan Terakhir (Real-time)
              </h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                Sistem Aktif
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Halaman</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Alamat IP (Tersensor)</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sistem Operasi</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Browser</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.recentLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-medium">
                        Belum ada aktivitas kunjungan terekam.
                      </td>
                    </tr>
                  ) : (
                    data?.recentLogs.map((log) => {
                      const { browser, os } = parseUA(log.userAgent);
                      return (
                        <tr key={log.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                            {new Date(log.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(log.createdAt).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                            {log.path}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium font-mono">
                            {anonymizeIP(log.ip)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              os === "Android" || os === "iOS" 
                                ? "bg-amber-100 text-amber-800" 
                                : "bg-indigo-100 text-indigo-800"
                            }`}>
                              {os}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">
                            {browser}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
