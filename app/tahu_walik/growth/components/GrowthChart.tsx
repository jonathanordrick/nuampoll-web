"use client";
import { useState, useRef, MouseEvent } from "react";
import { GrowthMetric } from "./GrowthForm";

interface GrowthChartProps {
    data: GrowthMetric[];
}

interface MetricConfig {
    key: keyof Omit<GrowthMetric, "id" | "recordedAt" | "notes">;
    label: string;
    color: string;
    isRevenue?: boolean;
}

const METRICS: MetricConfig[] = [
    { key: "igFollowers", label: "Followers IG", color: "#E1306C" },
    { key: "tiktokFollowers", label: "Followers TikTok", color: "#06B6D4" }, // Cyan-600
    { key: "totalCustomers", label: "Total Customer", color: "#3B82F6" }, // Blue-500
    { key: "websiteVisitors", label: "Pengunjung Website", color: "#10B981" }, // Green-500
    { key: "activeOrders", label: "Order Aktif", color: "#F59E0B" }, // Yellow-500
    { key: "testimonials", label: "Testimoni", color: "#8B5CF6" }, // Purple-500
    { key: "totalRevenue", label: "Total Omzet (Rp)", color: "#EF4444", isRevenue: true }, // Red-500
];

export default function GrowthChart({ data }: GrowthChartProps) {
    // State to toggle visibility of each metric
    const [activeMetrics, setActiveMetrics] = useState<string[]>(
        METRICS.map((m) => m.key)
    );

    // Hover state for tooltip & hover lines
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const svgRef = useRef<SVGSVGElement | null>(null);

    // Toggle active metrics
    const toggleMetric = (key: string) => {
        if (activeMetrics.includes(key)) {
            // Keep at least one metric active
            if (activeMetrics.length > 1) {
                setActiveMetrics(activeMetrics.filter((m) => m !== key));
            }
        } else {
            setActiveMetrics([...activeMetrics, key]);
        }
    };

    if (data.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center py-20">
                <p className="text-gray-400 font-bold">Belum ada data untuk digambar dalam chart.</p>
            </div>
        );
    }

    // Chart dimensions inside SVG viewbox
    const svgWidth = 850;
    const svgHeight = 400;
    const paddingLeft = 70;
    const paddingRight = 90;
    const paddingTop = 30;
    const paddingBottom = 50;

    const chartWidth = svgWidth - paddingLeft - paddingRight;
    const chartHeight = svgHeight - paddingTop - paddingBottom;

    // Calculate maximum values for scaling
    // 1. Shared Left Y-Axis metrics max
    let maxShared = 10;
    METRICS.filter((m) => !m.isRevenue && activeMetrics.includes(m.key)).forEach((m) => {
        data.forEach((d) => {
            const val = d[m.key] as number | null;
            if (val !== null && val > maxShared) maxShared = val;
        });
    });
    // Add 10% padding to maxShared
    maxShared = Math.ceil(maxShared * 1.1);

    // 2. Right Y-Axis revenue metric max
    let maxRevenue = 100000;
    if (activeMetrics.includes("totalRevenue")) {
        data.forEach((d) => {
            const val = d.totalRevenue;
            if (val !== null && val > maxRevenue) maxRevenue = val;
        });
    }
    // Add 10% padding to maxRevenue
    maxRevenue = Math.ceil(maxRevenue * 1.1);

    // Get coordinates for a data point
    const getCoordinates = (index: number, value: number, isRevenue: boolean) => {
        const x = paddingLeft + (index / Math.max(1, data.length - 1)) * chartWidth;
        const maxVal = isRevenue ? maxRevenue : maxShared;
        const y = svgHeight - paddingBottom - (value / maxVal) * chartHeight;
        return { x, y };
    };

    // Handle hover / mouse move inside SVG
    const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        
        // Calculate coordinates relative to SVG
        const scaleX = svgWidth / rect.width;
        const scaleY = svgHeight / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;

        // Only track inside plotting area plus a small margin
        if (mouseX >= paddingLeft - 20 && mouseX <= svgWidth - paddingRight + 20) {
            // Find closest data index
            const fraction = (mouseX - paddingLeft) / chartWidth;
            let index = Math.round(fraction * (data.length - 1));
            index = Math.max(0, Math.min(data.length - 1, index));
            
            setHoveredIdx(index);
            // Position tooltip near cursor
            setTooltipPos({
                x: e.clientX - rect.left + 15,
                y: e.clientY - rect.top - 80,
            });
        } else {
            setHoveredIdx(null);
        }
    };

    const handleMouseLeave = () => {
        setHoveredIdx(null);
    };

    // Formatting numbers helper
    const formatValue = (val: number, isRevenue?: boolean) => {
        if (isRevenue) {
            if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}M`;
            if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}jt`;
            if (val >= 1_000) return `${(val / 1_000).toFixed(0)}rb`;
            return `Rp ${val}`;
        }
        if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
        if (val >= 1_000) return `${(val / 1_000).toFixed(1)}k`;
        return val.toString();
    };

    // Gridlines (4 horizontal lines)
    const gridTicks = [0, 0.25, 0.5, 0.75, 1];

    return (
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex flex-col justify-between select-none">
            {/* Top Metric Filters (Pills) */}
            <div className="flex flex-wrap gap-2 mb-6">
                {METRICS.map((m) => {
                    const isActive = activeMetrics.includes(m.key);
                    return (
                        <button
                            key={m.key}
                            onClick={() => toggleMetric(m.key)}
                            style={{
                                borderColor: isActive ? m.color : "transparent",
                                backgroundColor: isActive ? `${m.color}15` : "#F3F4F6",
                                color: isActive ? m.color : "#6B7280",
                            }}
                            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            <span
                                className="w-2.5 h-2.5 rounded-full inline-block"
                                style={{ backgroundColor: m.color }}
                            />
                            {m.label}
                        </button>
                    );
                })}
            </div>

            {/* Line Chart Area */}
            <div className="relative w-full">
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full h-auto overflow-visible"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* SVG Filters for soft drop shadow */}
                    <defs>
                        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
                        </filter>
                    </defs>

                    {/* Horizontal Gridlines */}
                    {gridTicks.map((tick, idx) => {
                        const y = paddingTop + chartHeight * (1 - tick);
                        return (
                            <g key={idx}>
                                <line
                                    x1={paddingLeft}
                                    y1={y}
                                    x2={svgWidth - paddingRight}
                                    y2={y}
                                    stroke="#E5E7EB"
                                    strokeWidth="1"
                                    strokeDasharray={tick === 0 ? "none" : "4 4"}
                                />
                                {/* Left Axis Labels (Shared Metrics) */}
                                <text
                                    x={paddingLeft - 10}
                                    y={y + 4}
                                    textAnchor="end"
                                    fill="#9CA3AF"
                                    className="text-[10px] font-bold"
                                >
                                    {formatValue(maxShared * tick, false)}
                                </text>
                                {/* Right Axis Labels (Omzet/Revenue) */}
                                {activeMetrics.includes("totalRevenue") && (
                                    <text
                                        x={svgWidth - paddingRight + 12}
                                        y={y + 4}
                                        textAnchor="start"
                                        fill="#EF4444"
                                        className="text-[10px] font-bold"
                                    >
                                        {formatValue(maxRevenue * tick, true)}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Vertical X Axis Line */}
                    <line
                        x1={paddingLeft}
                        y1={svgHeight - paddingBottom}
                        x2={svgWidth - paddingRight}
                        y2={svgHeight - paddingBottom}
                        stroke="#D1D5DB"
                        strokeWidth="1.5"
                    />

                    {/* X Axis Labels (Dates) */}
                    {data.map((d, idx) => {
                        // Display 6 labels maximum to avoid overlap
                        const interval = Math.max(1, Math.ceil(data.length / 6));
                        if (idx % interval !== 0 && idx !== data.length - 1) return null;

                        const date = new Date(d.recordedAt);
                        const label = date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
                        const pos = getCoordinates(idx, 0, false);

                        return (
                            <text
                                key={idx}
                                x={pos.x}
                                y={svgHeight - paddingBottom + 20}
                                textAnchor="middle"
                                fill="#9CA3AF"
                                className="text-[10px] font-bold"
                            >
                                {label}
                            </text>
                        );
                    })}

                    {/* Plot Lines */}
                    {METRICS.map((m) => {
                        if (!activeMetrics.includes(m.key)) return null;

                        // Create SVG path string
                        const points = data
                            .map((d, idx) => {
                                const val = d[m.key] as number | null;
                                if (val === null) return null;
                                return { idx, val };
                            })
                            .filter((item): item is { idx: number; val: number } => item !== null);

                        if (points.length < 2) return null;

                        const pathD = points
                            .map((p, i) => {
                                const { x, y } = getCoordinates(p.idx, p.val, m.isRevenue || false);
                                return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                            })
                            .join(" ");

                        return (
                            <path
                                key={m.key}
                                d={pathD}
                                fill="none"
                                stroke={m.color}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="transition-all duration-300"
                                style={{ filter: "url(#shadow)" }}
                            />
                        );
                    })}

                    {/* Hover Vertical Guide Line */}
                    {hoveredIdx !== null && (
                        <line
                            x1={getCoordinates(hoveredIdx, 0, false).x}
                            y1={paddingTop}
                            x2={getCoordinates(hoveredIdx, 0, false).x}
                            y2={svgHeight - paddingBottom}
                            stroke="#6B7280"
                            strokeWidth="1.5"
                            strokeDasharray="4 4"
                        />
                    )}

                    {/* Hover circles / points */}
                    {hoveredIdx !== null &&
                        METRICS.map((m) => {
                            if (!activeMetrics.includes(m.key)) return null;
                            const val = data[hoveredIdx][m.key] as number | null;
                            if (val === null) return null;

                            const { x, y } = getCoordinates(hoveredIdx, val, m.isRevenue || false);
                            return (
                                <g key={m.key}>
                                    {/* Inner glowing circle */}
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="7"
                                        fill={m.color}
                                        stroke="white"
                                        strokeWidth="2"
                                        className="transition-all duration-150 shadow"
                                    />
                                    {/* Outer pulsing glow */}
                                    <circle
                                        cx={x}
                                        cy={y}
                                        r="12"
                                        fill={m.color}
                                        fillOpacity="0.25"
                                        className="animate-pulse"
                                    />
                                </g>
                            );
                        })}
                </svg>

                {/* HTML Float Tooltip */}
                {hoveredIdx !== null && (
                    <div
                        style={{
                            left: `${tooltipPos.x}px`,
                            top: `${tooltipPos.y}px`,
                        }}
                        className="absolute bg-gray-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-white/10 text-xs w-64 pointer-events-none z-20 backdrop-blur-md transition-all duration-75"
                    >
                        <p className="font-bold border-b border-white/10 pb-1.5 mb-2 text-gray-300 text-left">
                            {new Date(data[hoveredIdx].recordedAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                        <div className="space-y-1.5">
                            {METRICS.map((m) => {
                                const val = data[hoveredIdx][m.key] as number | null;
                                if (val === null) return null;
                                const isSelected = activeMetrics.includes(m.key);
                                return (
                                    <div
                                        key={m.key}
                                        className={`flex justify-between items-center ${
                                            isSelected ? "opacity-100 font-bold" : "opacity-40"
                                        }`}
                                    >
                                        <span className="flex items-center gap-1.5 text-gray-400">
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: m.color }}
                                            />
                                            {m.label}
                                        </span>
                                        <span style={{ color: isSelected ? m.color : "#FFF" }}>
                                            {m.isRevenue
                                                ? `Rp ${new Intl.NumberFormat("id-ID").format(val)}`
                                                : new Intl.NumberFormat("id-ID").format(val)}
                                        </span>
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
