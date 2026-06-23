"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiTrendingUp, FiGlobe, FiDollarSign, FiUsers, FiMessageSquare, FiShoppingBag, FiLayers, FiEye } from "react-icons/fi";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import AdminNavbar from "../../components/AdminNavbar";
import GrowthForm, { GrowthMetric } from "./GrowthForm";
import GrowthTable from "./GrowthTable";
import GrowthChart from "./GrowthChart";

export default function GrowthDashboard() {
    const [metrics, setMetrics] = useState<GrowthMetric[]>([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

    // Modal state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GrowthMetric | null>(null);
    const [deletingItem, setDeletingItem] = useState<GrowthMetric | null>(null);

    // Fetch data whenever range changes
    useEffect(() => {
        fetchData();
    }, [range]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/growth?range=${range}`);
            if (res.ok) {
                const data = await res.json();
                setMetrics(data);
            } else {
                console.error("Gagal memuat data pertumbuhan");
            }
        } catch (error) {
            console.error("Error fetching growth data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingItem(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (item: GrowthMetric) => {
        setEditingItem(item);
        setIsFormOpen(true);
    };

    const handleOpenDelete = (item: GrowthMetric) => {
        setDeletingItem(item);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingItem) return;

        try {
            const res = await fetch(`/api/growth/${deletingItem.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchData();
                setIsDeleteOpen(false);
                setDeletingItem(null);
            } else {
                alert("Gagal menghapus data");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Terjadi kesalahan koneksi saat menghapus data");
        }
    };

    // Card summaries calculations (Instagram, TikTok, Visitors, Omzet) based on latest entry vs previous entry
    const getSummaries = () => {
        if (metrics.length === 0) return null;

        // Metrics is sorted by recordedAt ASC (from oldest to newest)
        const latest = metrics[metrics.length - 1];
        const prev = metrics.length > 1 ? metrics[metrics.length - 2] : null;

        const calcChange = (cur: number | null, old: number | null) => {
            if (cur === null || old === null || old === 0) return null;
            const diff = cur - old;
            const percent = (diff / old) * 100;
            return {
                diff,
                percent: percent.toFixed(1),
                isPositive: diff >= 0
            };
        };

        return {
            ig: {
                val: latest.igFollowers !== null ? latest.igFollowers.toLocaleString("id-ID") : "-",
                change: prev ? calcChange(latest.igFollowers, prev.igFollowers) : null
            },
            tiktok: {
                val: latest.tiktokFollowers !== null ? latest.tiktokFollowers.toLocaleString("id-ID") : "-",
                change: prev ? calcChange(latest.tiktokFollowers, prev.tiktokFollowers) : null
            },
            visitors: {
                val: latest.websiteVisitors !== null ? latest.websiteVisitors.toLocaleString("id-ID") : "-",
                change: prev ? calcChange(latest.websiteVisitors, prev.websiteVisitors) : null
            },
            revenue: {
                val: latest.totalRevenue !== null ? `Rp ${latest.totalRevenue.toLocaleString("id-ID")}` : "-",
                change: prev ? calcChange(latest.totalRevenue, prev.totalRevenue) : null
            }
        };
    };

    const summaries = getSummaries();

    // Convert numbers to Roman numerals
    const toRoman = (num: number): string => {
        const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];
        return roman[num] || num.toString();
    };

    // Calculate maximum growth (highest positive surge) for key metrics
    const getHighlights = () => {
        if (metrics.length < 2) return [];

        const keyMetrics: { key: keyof Omit<GrowthMetric, "id" | "recordedAt" | "notes">; label: string; unit: string; isCurrency?: boolean }[] = [
            { key: "igFollowers", label: "Followers Instagram", unit: "followers" },
            { key: "igViews", label: "Views Instagram", unit: "views" },
            { key: "igPosts", label: "Postingan Instagram", unit: "posts" },
            { key: "igLikes", label: "Likes Instagram", unit: "likes" },
            { key: "tiktokFollowers", label: "Followers TikTok", unit: "followers" },
            { key: "tiktokViews", label: "Views TikTok", unit: "views" },
            { key: "tiktokPosts", label: "Postingan TikTok", unit: "posts" },
            { key: "tiktokLikes", label: "Likes TikTok", unit: "likes" },
            { key: "websiteVisitors", label: "Visitor Website", unit: "visitor" },
            { key: "websiteViews", label: "Views Website", unit: "views" },
            { key: "totalCustomers", label: "Total Customer", unit: "customers" },
            { key: "activeOrders", label: "Order Aktif", unit: "orders" },
            { key: "testimonials", label: "Testimoni", unit: "ulasan" },
            { key: "totalRevenue", label: "Omzet", unit: "", isCurrency: true },
        ];

        const highlightsList: {
            metricLabel: string;
            entryIndex: number; // 1-based index
            date: string;
            diff: number;
            percent: number;
            isCurrency?: boolean;
            unit: string;
        }[] = [];

        keyMetrics.forEach(({ key, label, unit, isCurrency }) => {
            let maxDiff = -Infinity;
            let bestEntryIndex = -1;
            let bestEntryDate = "";
            let bestPercent = 0;

            for (let i = 1; i < metrics.length; i++) {
                const prevVal = metrics[i - 1][key];
                const currVal = metrics[i][key];

                if (prevVal !== null && currVal !== null) {
                    const diff = Number(currVal) - Number(prevVal);
                    if (diff > maxDiff && diff > 0) { // must be a positive growth
                        maxDiff = diff;
                        bestEntryIndex = i + 1; // 1-based index (entry II, entry III, etc.)
                        bestEntryDate = new Date(metrics[i].recordedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        });
                        bestPercent = prevVal !== 0 ? (diff / Number(prevVal)) * 100 : 0;
                    }
                }
            }

            if (bestEntryIndex !== -1) {
                highlightsList.push({
                    metricLabel: label,
                    entryIndex: bestEntryIndex,
                    date: bestEntryDate,
                    diff: maxDiff,
                    percent: bestPercent,
                    isCurrency,
                    unit
                });
            }
        });

        return highlightsList;
    };

    const highlights = getHighlights();

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
                        <h2 className="text-xl font-bold text-gray-800 animate-pulse">Memuat Data Growth...</h2>
                        <p className="text-gray-500 text-sm mt-1">Sabar ya bro, lagi ngambil data ter-update</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <AdminNavbar />

            <div className="min-h-screen bg-[#fff0c7] pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">

                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Growth <span className="text-red-600">Tracker</span>
                            </h1>
                            <p className="text-gray-600 mt-2">Pantau dan kelola performa pertumbuhan bisnis Nuampoll.</p>
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#111111] hover:bg-red-600 text-white font-bold rounded-full transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            <FiPlus className="w-5 h-5" />
                            Tambah Data Growth
                        </button>
                    </div>

                    {/* Quick Stats Grid (Summaries of the latest record compared to previous) */}
                    {summaries && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { title: "Followers IG", value: summaries.ig.val, change: summaries.ig.change, color: "border-pink-500/20" },
                                { title: "Followers TikTok", value: summaries.tiktok.val, change: summaries.tiktok.change, color: "border-cyan-500/20" },
                                { title: "Visitor Web", value: summaries.visitors.val, change: summaries.visitors.change, color: "border-green-500/20" },
                                { title: "Total Omzet", value: summaries.revenue.val, change: summaries.revenue.change, color: "border-red-500/20" },
                            ].map((card, idx) => (
                                <div key={idx} className={`bg-white rounded-3xl p-6 shadow-md border ${card.color} flex flex-col justify-between hover:scale-[1.01] transition-all`}>
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{card.title}</span>
                                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 mt-2 mb-1 truncate">{card.value}</h3>
                                    {card.change ? (
                                        <span className={`text-xs font-bold flex items-center gap-1 ${card.change.isPositive ? "text-green-600" : "text-red-600"}`}>
                                            {card.change.isPositive ? "+" : ""}{card.change.diff.toLocaleString("id-ID")} ({card.change.isPositive ? "+" : ""}{card.change.percent}%)
                                            <span className="text-[10px] text-gray-400 font-medium">vs entri sebelumnya</span>
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">-</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Growth Insights Summary Section */}
                    {highlights.length > 0 && (
                        <div className="bg-[#111111] text-white rounded-3xl p-6 shadow-xl mb-8 border border-white/10 relative overflow-hidden">
                            {/* Background glow decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
                            
                            <div className="relative z-10">
                                <h3 className="text-lg font-black flex items-center gap-2 mb-2">
                                    <span className="p-2 bg-red-600/20 rounded-xl text-red-500">
                                        <FiTrendingUp className="w-5 h-5" />
                                    </span>
                                    Insight Peningkatan Terpesat 🚀
                                </h3>
                                <p className="text-gray-400 text-xs sm:text-sm mb-6">
                                    Rekap otomatis metrik-metrik yang mencatatkan lonjakan tertinggi beserta waktu kejadiannya.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {highlights.map((h, idx) => {
                                        let borderTheme = "border-pink-500/30 text-pink-400 bg-pink-950/20";
                                        let ReactIcon = FaInstagram;
                                        if (h.metricLabel.includes("TikTok")) {
                                            borderTheme = "border-cyan-500/30 text-cyan-400 bg-cyan-950/20";
                                            ReactIcon = FaTiktok;
                                        } else if (h.metricLabel.includes("Website") || h.metricLabel.includes("Visitor")) {
                                            borderTheme = "border-emerald-500/30 text-emerald-400 bg-emerald-950/20";
                                            ReactIcon = h.metricLabel.includes("Views") ? FiEye : FiGlobe;
                                        } else if (h.metricLabel.includes("Customer")) {
                                            borderTheme = "border-blue-500/30 text-blue-400 bg-blue-950/20";
                                            ReactIcon = FiUsers;
                                        } else if (h.metricLabel.includes("Order")) {
                                            borderTheme = "border-amber-500/30 text-amber-400 bg-amber-950/20";
                                            ReactIcon = FiShoppingBag;
                                        } else if (h.metricLabel.includes("Testimoni")) {
                                            borderTheme = "border-violet-500/30 text-violet-400 bg-violet-950/20";
                                            ReactIcon = FiMessageSquare;
                                        } else if (h.metricLabel.includes("Omzet")) {
                                            borderTheme = "border-red-500/30 text-red-400 bg-red-950/20";
                                            ReactIcon = FiDollarSign;
                                        }

                                        const formatValChange = (diff: number, isRev?: boolean) => {
                                            if (isRev) return `Rp ${diff.toLocaleString("id-ID")}`;
                                            return diff.toLocaleString("id-ID");
                                        };

                                        return (
                                            <div key={idx} className={`p-4 rounded-2xl border ${borderTheme} flex items-start gap-3 hover:scale-[1.01] transition-all`}>
                                                <div className="p-2.5 rounded-xl bg-white/5 mt-0.5 flex-shrink-0">
                                                    <ReactIcon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-extrabold text-white truncate">{h.metricLabel}</h4>
                                                    <p className="text-xs text-gray-300 mt-1">
                                                        Lonjakan tertinggi pada <span className="font-black text-white bg-white/10 px-1.5 py-0.5 rounded">Entri {toRoman(h.entryIndex)}</span>
                                                    </p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">({h.date})</p>
                                                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                        <span className="text-xs font-black bg-white/10 px-2 py-0.5 rounded text-green-400 flex items-center gap-0.5">
                                                            ▲ +{formatValChange(h.diff, h.isCurrency)} {h.unit}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-400">
                                                            (+{h.percent.toFixed(1)}%)
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chart Section */}
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 mb-8 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 border-b border-gray-100 pb-4">
                            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                <FiTrendingUp className="text-red-600 w-5 h-5" />
                                Grafik Tren Pertumbuhan
                            </h3>

                            {/* Range Selector */}
                            <div className="flex bg-gray-100 p-1 rounded-xl self-start sm:self-auto border border-gray-200/50">
                                {(["7d", "30d", "90d", "all"] as const).map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setRange(r)}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${range === r
                                                ? "bg-[#111] text-white shadow-md"
                                                : "text-gray-500 hover:text-gray-800"
                                            }`}
                                    >
                                        {r === "7d" ? "7 Hari" : r === "30d" ? "30 Hari" : r === "90d" ? "90 Hari" : "Semua"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="h-64 flex items-center justify-center">
                                <p className="text-gray-400 font-bold animate-pulse">Memuat grafik tren...</p>
                            </div>
                        ) : (
                            <GrowthChart data={metrics} />
                        )}
                    </div>

                    {/* Table Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-gray-900 px-1">Tabel Histori Pertumbuhan</h3>
                        <GrowthTable
                            items={metrics}
                            loading={loading}
                            onEdit={handleOpenEdit}
                            onDelete={handleOpenDelete}
                        />
                    </div>

                </div>
            </div>

            {/* Growth Add/Edit Form Modal */}
            <GrowthForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={fetchData}
                editingItem={editingItem}
            />

            {/* Delete Confirmation Modal */}
            {isDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 backdrop-blur-sm">
                    <div className="max-w-sm w-full rounded-3xl bg-[#111111] p-8 text-white shadow-2xl relative border border-white/10 text-center">
                        <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiTrash2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Hapus Data Growth?</h3>
                        <p className="text-gray-400 mb-6">Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus data untuk tanggal ini?</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleteOpen(false)}
                                className="flex-1 rounded-full bg-white/5 hover:bg-white/10 py-3.5 font-bold transition cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 rounded-full bg-red-600 hover:bg-red-700 py-3.5 font-bold transition cursor-pointer"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
