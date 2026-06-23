"use client";
import { useState } from "react";
import { FiEdit, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { GrowthMetric } from "./GrowthForm";

interface GrowthTableProps {
    items: GrowthMetric[];
    loading: boolean;
    onEdit: (item: GrowthMetric) => void;
    onDelete: (item: GrowthMetric) => void;
}

export default function GrowthTable({ items, loading, onEdit, onDelete }: GrowthTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [activeTab, setActiveTab] = useState<"summary" | "instagram" | "tiktok" | "sales">("summary");

    // Sort items by date DESC (newest first) for table display
    const sortedItems = [...items].sort(
        (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    );

    // Calculate growth changes chronologically (oldest to newest)
    const calculateChanges = () => {
        const chronoItems = [...items].sort(
            (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
        );

        const changesMap = new Map<string, Record<string, { diff: number; percent: number; isPositive: boolean }>>();

        chronoItems.forEach((item, idx) => {
            if (idx === 0) return;
            const prev = chronoItems[idx - 1];
            const itemChanges: Record<string, { diff: number; percent: number; isPositive: boolean }> = {};

            const keys: (keyof Omit<GrowthMetric, "id" | "recordedAt" | "notes">)[] = [
                "igFollowers", "igViews", "igPosts", "igLikes",
                "tiktokFollowers", "tiktokViews", "tiktokPosts", "tiktokLikes",
                "totalCustomers", "websiteVisitors", "websiteViews", "activeOrders",
                "testimonials", "totalRevenue"
            ];

            keys.forEach((key) => {
                const currVal = item[key];
                const prevVal = prev[key];
                if (currVal !== null && prevVal !== null && prevVal !== undefined) {
                    const currNum = Number(currVal);
                    const prevNum = Number(prevVal);
                    const diff = currNum - prevNum;
                    const percent = prevNum !== 0 ? (diff / prevNum) * 100 : 0;
                    itemChanges[key] = {
                        diff,
                        percent,
                        isPositive: diff >= 0
                    };
                }
            });

            changesMap.set(item.id, itemChanges);
        });

        return changesMap;
    };

    const changesMap = calculateChanges();

    // Format IDR Currency
    const formatIDR = (value: number | null) => {
        if (value === null) return "-";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    // Format standard large numbers (followers, visitors)
    const formatNumber = (value: number | null) => {
        if (value === null) return "-";
        return new Intl.NumberFormat("id-ID").format(value);
    };

    // Render cell with raw value and growth percentage
    const renderCellWithChange = (value: number | null, key: string, itemId: string, isCurrency = false) => {
        if (value === null) return <span className="text-gray-400">-</span>;
        const formatted = isCurrency ? formatIDR(value) : formatNumber(value);
        const change = changesMap.get(itemId)?.[key];

        return (
            <div className="flex flex-col items-end justify-center">
                <span className={isCurrency ? "text-red-600 font-black" : "text-gray-900 font-semibold"}>
                    {formatted}
                </span>
                {change && change.diff !== 0 ? (
                    <span className={`text-[10px] font-extrabold flex items-center gap-0.5 mt-0.5 ${change.isPositive ? "text-green-600" : "text-red-500"}`}>
                        {change.isPositive ? "▲" : "▼"} {change.isPositive ? "+" : ""}{change.percent.toFixed(1)}%
                    </span>
                ) : change && change.diff === 0 ? (
                    <span className="text-[10px] text-gray-400 font-bold mt-0.5">
                        = 0%
                    </span>
                ) : (
                    <span className="text-[10px] text-gray-300 font-semibold mt-0.5">-</span>
                )}
            </div>
        );
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const colSpan = activeTab === "sales" ? 9 : 7;

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
            {/* Tabs Control */}
            <div className="flex flex-wrap bg-gray-50 border-b border-gray-100 p-3 gap-2">
                {[
                    { id: "summary", label: "Ringkasan" },
                    { id: "instagram", label: "Instagram" },
                    { id: "tiktok", label: "TikTok" },
                    { id: "sales", label: "Web & Penjualan" }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id as any);
                            setCurrentPage(1); // reset page on tab switch
                        }}
                        className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                            activeTab === tab.id
                                ? "bg-[#111] text-white shadow-sm"
                                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                            
                            {activeTab === "summary" && (
                                <>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Followers IG</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Followers TikTok</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Visitor Web</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Omzet</th>
                                </>
                            )}

                            {activeTab === "instagram" && (
                                <>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Followers IG</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Views IG</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Postingan IG</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Likes IG</th>
                                </>
                            )}

                            {activeTab === "tiktok" && (
                                <>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Followers TikTok</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Views TikTok</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Postingan TikTok</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Likes TikTok</th>
                                </>
                            )}

                            {activeTab === "sales" && (
                                <>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Visitor Web</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Views Web</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Total Cust.</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Order Aktif</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Testimoni</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Omzet</th>
                                </>
                            )}

                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Catatan</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={colSpan} className="px-6 py-12 text-center text-gray-500">
                                    Memuat data pertumbuhan...
                                </td>
                            </tr>
                        ) : currentItems.length === 0 ? (
                            <tr>
                                <td colSpan={colSpan} className="px-6 py-12 text-center text-gray-500">
                                    Belum ada data pertumbuhan dicatat.
                                </td>
                            </tr>
                        ) : (
                            currentItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                                        {new Date(item.recordedAt).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>

                                    {activeTab === "summary" && (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.igFollowers, "igFollowers", item.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.tiktokFollowers, "tiktokFollowers", item.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.websiteVisitors, "websiteVisitors", item.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.totalRevenue, "totalRevenue", item.id, true)}
                                            </td>
                                        </>
                                    )}

                                    {activeTab === "instagram" && (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.igFollowers, "igFollowers", item.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.igViews, "igViews", item.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.igPosts, "igPosts", item.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.igLikes, "igLikes", item.id)}
                                            </td>
                                        </>
                                    )}

                                    {activeTab === "tiktok" && (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.tiktokFollowers, "tiktokFollowers", item.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.tiktokViews, "tiktokViews", item.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.tiktokPosts, "tiktokPosts", item.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.tiktokLikes, "tiktokLikes", item.id)}
                                            </td>
                                        </>
                                    )}

                                    {activeTab === "sales" && (
                                        <>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.websiteVisitors, "websiteVisitors", item.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.websiteViews, "websiteViews", item.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.totalCustomers, "totalCustomers", item.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.activeOrders, "activeOrders", item.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.testimonials, "testimonials", item.id)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                                {renderCellWithChange(item.totalRevenue, "totalRevenue", item.id, true)}
                                            </td>
                                        </>
                                    )}

                                    <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate" title={item.notes || ""}>
                                        {item.notes || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex justify-center gap-1.5">
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                                                title="Edit Data"
                                            >
                                                <FiEdit className="w-4.5 h-4.5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(item)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                                title="Hapus Data"
                                            >
                                                <FiTrash2 className="w-4.5 h-4.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {!loading && sortedItems.length > 0 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Baris per halaman:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 p-1.5 cursor-pointer font-semibold outline-none"
                        >
                            {[5, 10, 25, 50].map((val) => (
                                <option key={val} value={val}>
                                    {val}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 font-medium">
                            Halaman {currentPage} dari {totalPages || 1}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => paginate(currentPage - 1)}
                                className="p-2 rounded-xl hover:bg-gray-200 disabled:opacity-30 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                            >
                                <FiChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                disabled={currentPage === totalPages || totalPages === 0}
                                onClick={() => paginate(currentPage + 1)}
                                className="p-2 rounded-xl hover:bg-gray-200 disabled:opacity-30 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                            >
                                <FiChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
