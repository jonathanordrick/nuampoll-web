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
    isRightAxis?: boolean;
}

const IG_METRICS: MetricConfig[] = [
    { key: "igFollowers", label: "Followers", color: "#833AB4" },
    { key: "igViews", label: "Views (Kanan)", color: "#E1306C", isRightAxis: true },
    { key: "igPosts", label: "Postingan", color: "#F77737" },
    { key: "igLikes", label: "Likes", color: "#FCAF45" },
];

const TIKTOK_METRICS: MetricConfig[] = [
    { key: "tiktokFollowers", label: "Followers", color: "#A855F7" },
    { key: "tiktokViews", label: "Views (Kanan)", color: "#EE1D52", isRightAxis: true },
    { key: "tiktokPosts", label: "Postingan", color: "#06B6D4" },
    { key: "tiktokLikes", label: "Likes", color: "#F59E0B" },
];

const WEBSITE_METRICS: MetricConfig[] = [
    { key: "websiteVisitors", label: "Viewer", color: "#10B981" },
    { key: "websiteViews", label: "Views", color: "#3B82F6" },
];

const SALES_METRICS: MetricConfig[] = [
    { key: "totalCustomers", label: "Customer", color: "#3B82F6" },
    { key: "activeOrders", label: "Order Aktif", color: "#F59E0B" },
    { key: "testimonials", label: "Testimoni", color: "#8B5CF6" },
    { key: "totalRevenue", label: "Omzet (Kanan)", color: "#EF4444", isRightAxis: true },
];

function SubBarChart({
    title,
    data,
    metrics,
    dualAxis = false,
}: {
    title: string;
    data: GrowthMetric[];
    metrics: MetricConfig[];
    dualAxis?: boolean;
}) {
    const [activeMetrics, setActiveMetrics] = useState<string[]>(
        metrics.map((m) => m.key)
    );
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [hoveredLineKey, setHoveredLineKey] = useState<string | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const toggleMetric = (key: string) => {
        if (activeMetrics.includes(key)) {
            if (activeMetrics.length > 1) {
                setActiveMetrics(activeMetrics.filter((m) => m !== key));
            }
        } else {
            setActiveMetrics([...activeMetrics, key]);
        }
    };

    const rightAxisMetric = metrics.find((m) => m.isRightAxis);
    const rightAxisKey = rightAxisMetric?.key;

    // Dimension config
    const svgWidth = 550;
    const svgHeight = 280;
    const paddingLeft = 55;
    const paddingRight = dualAxis && rightAxisKey && activeMetrics.includes(rightAxisKey as string) ? 65 : 20;
    const paddingTop = 20;
    const paddingBottom = 40;

    const chartWidth = svgWidth - paddingLeft - paddingRight;
    const chartHeight = svgHeight - paddingTop - paddingBottom;
    const colWidth = chartWidth / Math.max(1, data.length);

    // Safe parsing helper
    const isValidVal = (val: any): boolean => {
        return val !== null && val !== undefined && val !== "" && !isNaN(Number(val));
    };

    // 1. Shared Left Y-Axis metrics max
    let maxShared = 10;
    metrics
        .filter((m) => !m.isRightAxis && activeMetrics.includes(m.key))
        .forEach((m) => {
            data.forEach((d) => {
                const val = d[m.key];
                if (isValidVal(val)) {
                    const numVal = Number(val);
                    if (numVal > maxShared) maxShared = numVal;
                }
            });
        });
    maxShared = Math.ceil(maxShared * 1.1);

    // 2. Right Y-Axis metric max
    let maxRight = 10;
    if (dualAxis && rightAxisKey && activeMetrics.includes(rightAxisKey)) {
        data.forEach((d) => {
            const val = d[rightAxisKey];
            if (isValidVal(val)) {
                const numVal = Number(val);
                if (numVal > maxRight) maxRight = numVal;
            }
        });
    }
    maxRight = Math.ceil(maxRight * 1.1);

    const handleMouseMove = (e: MouseEvent<SVGSVGElement>) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        
        const scaleX = svgWidth / rect.width;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const localX = mouseX - paddingLeft;

        if (mouseX >= paddingLeft - 5 && mouseX <= svgWidth - paddingRight + 5) {
            let index = Math.floor(localX / colWidth);
            index = Math.max(0, Math.min(data.length - 1, index));
            
            setHoveredIdx(index);
            
            const isRightHalf = index >= data.length / 2;
            const tooltipX = isRightHalf
                ? (e.clientX - rect.left - 225) // Show left of cursor (w-52 = 208px + margin)
                : (e.clientX - rect.left + 15);  // Show right of cursor

            setTooltipPos({
                x: tooltipX,
                y: e.clientY - rect.top - 100,
            });
        } else {
            setHoveredIdx(null);
        }
    };

    const handleMouseLeave = () => {
        setHoveredIdx(null);
    };

    const formatValue = (val: number, isRevenue?: boolean) => {
        if (isRevenue) {
            if (val >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(1)}M`;
            if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}jt`;
            if (val >= 1_000) return `${(val / 1_000).toFixed(0)}rb`;
            return `Rp ${val}`;
        }
        if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}jt`;
        if (val >= 1_000) return `${(val / 1_000).toFixed(1)}rb`;
        return val.toString();
    };

    const gridTicks = [0, 0.25, 0.5, 0.75, 1];

    return (
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-md flex flex-col justify-between select-none relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h4 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">
                    {title}
                </h4>
                {/* Metric Filters */}
                <div className="flex flex-wrap gap-1.5">
                    {metrics.map((m) => {
                        const isActive = activeMetrics.includes(m.key);
                        return (
                            <button
                                key={m.key}
                                onClick={() => toggleMetric(m.key)}
                                style={{
                                    borderColor: isActive ? m.color : "transparent",
                                    backgroundColor: isActive ? `${m.color}12` : "#F3F4F6",
                                    color: isActive ? m.color : "#6B7280",
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer"
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full inline-block"
                                    style={{ backgroundColor: m.color }}
                                />
                                {m.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SVG Plot */}
            <div className="relative w-full">
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full h-auto overflow-visible"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* Gridlines */}
                    {gridTicks.map((tick, idx) => {
                        const y = paddingTop + chartHeight * (1 - tick);
                        return (
                            <g key={idx}>
                                <line
                                    x1={paddingLeft}
                                    y1={y}
                                    x2={svgWidth - paddingRight}
                                    y2={y}
                                    stroke="#F3F4F6"
                                    strokeWidth="1"
                                />
                                {/* Left axis values */}
                                <text
                                    x={paddingLeft - 8}
                                    y={y + 3}
                                    textAnchor="end"
                                    fill="#9CA3AF"
                                    className="text-[9px] font-bold"
                                >
                                    {formatValue(maxShared * tick, false)}
                                </text>
                                {/* Right axis values */}
                                {dualAxis && rightAxisKey && activeMetrics.includes(rightAxisKey) && (
                                    <text
                                        x={svgWidth - paddingRight + 8}
                                        y={y + 3}
                                        textAnchor="start"
                                        fill={rightAxisMetric?.color || "#EF4444"}
                                        className="text-[9px] font-bold"
                                    >
                                        {formatValue(maxRight * tick, rightAxisMetric?.key === "totalRevenue")}
                                    </text>
                                )}
                            </g>
                        );
                    })}

                    {/* Bottom axis line */}
                    <line
                        x1={paddingLeft}
                        y1={svgHeight - paddingBottom}
                        x2={svgWidth - paddingRight}
                        y2={svgHeight - paddingBottom}
                        stroke="#E5E7EB"
                        strokeWidth="1"
                    />

                    {/* X Axis labels (centered on columns) */}
                    {data.map((d, idx) => {
                        const interval = Math.max(1, Math.ceil(data.length / 5));
                        if (idx % interval !== 0 && idx !== data.length - 1) return null;

                        const date = new Date(d.recordedAt);
                        const label = date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
                        const x = paddingLeft + (idx + 0.5) * colWidth;

                        return (
                            <text
                                key={idx}
                                x={x}
                                y={svgHeight - paddingBottom + 16}
                                textAnchor="middle"
                                fill="#9CA3AF"
                                className="text-[9px] font-bold"
                            >
                                {label}
                            </text>
                        );
                    })}

                    {/* Hover Column Highlight background */}
                    {hoveredIdx !== null && (
                        <rect
                            x={paddingLeft + hoveredIdx * colWidth}
                            y={paddingTop}
                            width={colWidth}
                            height={chartHeight}
                            fill="#F3F4F6"
                            fillOpacity="0.4"
                            rx={4}
                        />
                    )}

                    {/* Draw Grouped Bars (Background volume visualization) */}
                    {data.map((d, idx) => {
                        const activeAndNonNull = metrics.filter(m => {
                            const isMetricActive = activeMetrics.includes(m.key);
                            const val = d[m.key];
                            return isMetricActive && isValidVal(val);
                        });

                        const activeCount = activeAndNonNull.length;
                        if (activeCount === 0) return null;

                        const groupPadding = colWidth * 0.15;
                        const availableWidth = colWidth - (2 * groupPadding);
                        const gapBetweenBars = 1;
                        const barWidth = Math.max(1.5, (availableWidth - (gapBetweenBars * (activeCount - 1))) / activeCount);

                        return activeAndNonNull.map((m, barIdx) => {
                            const val = d[m.key];
                            if (!isValidVal(val)) return null;

                            const maxVal = Math.max(1, m.isRightAxis ? maxRight : maxShared);
                            const barHeight = (Number(val) / maxVal) * chartHeight;
                            
                            const x = paddingLeft + idx * colWidth + groupPadding + barIdx * (barWidth + gapBetweenBars);
                            const y = svgHeight - paddingBottom - barHeight;

                            return (
                                <rect
                                    key={`${idx}-${m.key}`}
                                    x={x}
                                    y={y}
                                    width={barWidth}
                                    height={Math.max(1, barHeight)}
                                    fill={m.color}
                                    rx={1.5}
                                    className="transition-all duration-300 hover:opacity-80"
                                />
                            );
                        });
                    })}

                    {/* Draw Trend Lines & Markers (Foreground growth trend visualization) */}
                    {metrics
                        .filter((m) => activeMetrics.includes(m.key))
                        .map((m) => {
                            const points: { x: number; y: number }[] = [];
                            
                            data.forEach((d, idx) => {
                                const val = d[m.key];
                                if (isValidVal(val)) {
                                    // Find all active and non-null metrics for this specific entry to determine visual offset
                                    const activeAndNonNull = metrics.filter(m2 => activeMetrics.includes(m2.key) && isValidVal(d[m2.key]));
                                    const activeCount = activeAndNonNull.length;
                                    const barIdx = activeAndNonNull.findIndex(m2 => m2.key === m.key);

                                    let x = paddingLeft + (idx + 0.5) * colWidth; // Fallback to group center
                                    
                                    if (barIdx !== -1 && activeCount > 0) {
                                        const groupPadding = colWidth * 0.15;
                                        const availableWidth = colWidth - (2 * groupPadding);
                                        const gapBetweenBars = 1;
                                        const barWidth = Math.max(1.5, (availableWidth - (gapBetweenBars * (activeCount - 1))) / activeCount);
                                        const barX = paddingLeft + idx * colWidth + groupPadding + barIdx * (barWidth + gapBetweenBars);
                                        x = barX + barWidth / 2;
                                    }

                                    const maxVal = Math.max(1, m.isRightAxis ? maxRight : maxShared);
                                    const y = svgHeight - paddingBottom - (Number(val) / maxVal) * chartHeight;
                                    points.push({ x, y });
                                }
                            });

                            if (points.length === 0) return null;

                            // Construct path 'd' attribute
                            const pathD = points
                                .map((pt, pIdx) => `${pIdx === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
                                .join(" ");

                            const isHovered = hoveredLineKey === m.key;

                            return (
                                <g 
                                    key={`line-${m.key}`}
                                    onMouseEnter={() => setHoveredLineKey(m.key)}
                                    onMouseLeave={() => setHoveredLineKey(null)}
                                    className="cursor-pointer"
                                >
                                    {/* Line Shadow / Glow */}
                                    {isHovered && points.length > 1 && (
                                        <path
                                            d={pathD}
                                            fill="none"
                                            stroke={m.color}
                                            strokeWidth="7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            opacity="0.18"
                                            className="transition-all duration-300"
                                        />
                                    )}
                                    {/* Main Trend Line */}
                                    {points.length > 1 && (
                                        <path
                                            d={pathD}
                                            fill="none"
                                            stroke={m.color}
                                            strokeWidth={isHovered ? "3.5" : "1.5"}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            opacity={isHovered ? "1.0" : "0.45"}
                                            className="transition-all duration-200"
                                        />
                                    )}
                                    {/* Data Point Markers */}
                                    {points.map((pt, pIdx) => (
                                        <circle
                                            key={`marker-${m.key}-${pIdx}`}
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={isHovered ? "5" : "3.2"}
                                            fill="#FFFFFF"
                                            stroke={m.color}
                                            strokeWidth={isHovered ? "3" : "1.8"}
                                            style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                                            className="transition-all duration-200 cursor-pointer"
                                        />
                                    ))}
                                </g>
                            );
                        })}
                </svg>

                {/* Independent Tooltip */}
                {hoveredIdx !== null && (
                    <div
                        style={{
                            left: `${tooltipPos.x}px`,
                            top: `${tooltipPos.y}px`,
                        }}
                        className="absolute bg-gray-900/95 text-white p-3 rounded-2xl shadow-xl border border-white/10 text-[10px] w-52 pointer-events-none z-20 backdrop-blur-sm transition-all duration-75"
                    >
                        <p className="font-bold border-b border-white/10 pb-1 mb-1.5 text-gray-300">
                            {new Date(data[hoveredIdx].recordedAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                        <div className="space-y-1">
                             {metrics.map((m) => {
                                const val = data[hoveredIdx][m.key] as number | null;
                                if (!isValidVal(val)) return null;
                                const isSelected = activeMetrics.includes(m.key);

                                // Calculate change from previous entry
                                let changeText = "";
                                let isPositive = true;
                                if (hoveredIdx > 0) {
                                    const prevVal = data[hoveredIdx - 1][m.key];
                                    if (isValidVal(prevVal)) {
                                        const diff = Number(val) - Number(prevVal);
                                        const percent = Number(prevVal) !== 0 ? (diff / Number(prevVal)) * 100 : 0;
                                        if (diff !== 0) {
                                            isPositive = diff > 0;
                                            changeText = `${isPositive ? "+" : ""}${percent.toFixed(1)}%`;
                                        } else {
                                            changeText = "0.0%";
                                        }
                                    }
                                }

                                return (
                                    <div
                                        key={m.key}
                                        className={`flex justify-between items-center ${
                                            isSelected ? "opacity-100" : "opacity-40"
                                        }`}
                                    >
                                        <span className="flex items-center gap-1 text-gray-400">
                                            <span
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ backgroundColor: m.color }}
                                            />
                                            {m.label}
                                        </span>
                                        <div className="flex flex-col items-end">
                                            <span style={{ color: isSelected ? m.color : "#FFF" }} className="font-bold">
                                                {m.isRightAxis && m.key === "totalRevenue"
                                                    ? `Rp ${new Intl.NumberFormat("id-ID").format(Number(val))}`
                                                    : new Intl.NumberFormat("id-ID").format(Number(val))}
                                            </span>
                                            {changeText && (
                                                <span className={`text-[8px] font-black mt-0.5 ${changeText === "0.0%" ? "text-gray-400" : isPositive ? "text-green-400" : "text-red-400"}`}>
                                                    {changeText === "0.0%" ? "=" : isPositive ? "▲" : "▼"} {changeText}
                                                </span>
                                            )}
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

export default function GrowthChart({ data }: GrowthChartProps) {
    if (data.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl text-center py-20">
                <p className="text-gray-400 font-bold">Belum ada data untuk digambar dalam chart.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SubBarChart
                title="Instagram Growth"
                data={data}
                metrics={IG_METRICS}
                dualAxis={true}
            />
            <SubBarChart
                title="TikTok Growth"
                data={data}
                metrics={TIKTOK_METRICS}
                dualAxis={true}
            />
            <SubBarChart
                title="Website Performance"
                data={data}
                metrics={WEBSITE_METRICS}
            />
            <SubBarChart
                title="Penjualan & Finansial"
                data={data}
                metrics={SALES_METRICS}
                dualAxis={true}
            />
        </div>
    );
}
