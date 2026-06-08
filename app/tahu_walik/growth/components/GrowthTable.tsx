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

    // Sort items by date DESC (newest first) for table display
    const sortedItems = [...items].sort(
        (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
    );

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

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Followers IG</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Followers TikTok</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Total Cust.</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Visitor Web</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Order Aktif</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Testimoni</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Omzet</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Catatan</th>
                            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                                    Memuat data pertumbuhan...
                                </td>
                            </tr>
                        ) : currentItems.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
                                        {formatNumber(item.igFollowers)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
                                        {formatNumber(item.tiktokFollowers)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
                                        {formatNumber(item.totalCustomers)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
                                        {formatNumber(item.websiteVisitors)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
                                        <span className={item.activeOrders && item.activeOrders > 0 ? "text-amber-600 font-bold" : "text-gray-400"}>
                                            {formatNumber(item.activeOrders)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right font-medium">
                                        {formatNumber(item.testimonials)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right font-black">
                                        {formatIDR(item.totalRevenue)}
                                    </td>
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
