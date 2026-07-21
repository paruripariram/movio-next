"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useGenresStore } from "@/store/genreStore";
import { collectionItem } from "@/types/collection";
import { formatPlural } from "@/helpers/pluralize";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#64748b"];

interface GenrePieChartProps {
    items: collectionItem[];
}

export function GenrePieChart({ items }: GenrePieChartProps) {
    const genresMap = useGenresStore((state) => state.genresMap);

    const chartData = useMemo(() => {
        if (!items || items.length === 0) return [];

        const counts: Record<number, number> = {};
        let totalGenreTags = 0;

        items.forEach((item) => {
            item.genre_ids?.forEach((genreId) => {
                counts[genreId] = (counts[genreId] || 0) + 1;
                totalGenreTags += 1;
            });
        });

        const sortedEntries = Object.entries(counts).sort(
            (a, b) => b[1] - a[1],
        );
        if (sortedEntries.length === 0 || totalGenreTags === 0) return [];

        const topGenres = sortedEntries.slice(0, 4);
        const otherGenres = sortedEntries.slice(4);

        const result = topGenres.map(([idStr, count]) => {
            const id = Number(idStr);
            const rawName =
                genresMap.movieGenres?.[id] ||
                genresMap.tvGenres?.[id] ||
                "Другой";

            const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
            const percentage = Math.round((count / totalGenreTags) * 100);

            return { name, value: count, percentage };
        });

        if (otherGenres.length > 0) {
            const othersCount = otherGenres.reduce(
                (acc, [, count]) => acc + count,
                0,
            );
            const percentage = Math.round((othersCount / totalGenreTags) * 100);
            result.push({ name: "Другие", value: othersCount, percentage });
        }

        return result;
    }, [items, genresMap]);

    if (chartData.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Нет данных по жанрам
            </div>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row items-center w-full h-auto sm:h-72 gap-6 sm:gap-4">
            <div className="w-full sm:w-1/2 h-64 sm:h-full [&_path]:outline-none [&_svg]:outline-none">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart style={{ outline: "none" }}>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius="45%"
                            outerRadius="80%"
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                            style={{ outline: "none" }}
                        >
                            {chartData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    style={{ outline: "none" }}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1f2937",
                                borderRadius: "12px",
                                border: "1px solid #374151",
                                color: "#fff",
                                fontSize: "12px",
                                boxShadow:
                                    "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                            }}
                            itemStyle={{ color: "#fff" }}
                            formatter={(value) => [
                                formatPlural(
                                    value as number,
                                    "проект",
                                    "проекта",
                                    "проектов",
                                ),
                                "Встречается",
                            ]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="w-full sm:w-1/2 flex flex-col justify-center gap-3 px-2">
                {chartData.map((item, index) => {
                    const color = COLORS[index % COLORS.length];

                    return (
                        <div
                            key={item.name}
                            className="flex items-center justify-between text-sm sm:text-base gap-2"
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: color }}
                                />
                                <span
                                    className="text-gray-300 truncate font-medium"
                                    title={item.name}
                                >
                                    {item.name}
                                </span>
                            </div>

                            <span className="text-gray-400 font-bold shrink-0 text-xs sm:text-sm">
                                {formatPlural(
                                    item.value,
                                    "проект",
                                    "проекта",
                                    "проектов",
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
