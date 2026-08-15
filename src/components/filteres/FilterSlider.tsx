"use client";

import { Slider } from "@/components/ui/slider";
import { SLIDER_CONFIG } from "@/config/filters";
import { useState } from "react";

interface FilterSliderProps {
    type: "vote_average" | "release_date";
    value: number[];
    onValueCommit?: (value: number[]) => void;
}

export default function FilterSlider({
    type,
    value,
    onValueCommit,
}: FilterSliderProps) {
    const [localValue, setLocalValue] = useState(value);
    const { min, max, step, label } = SLIDER_CONFIG[type];

    const sliderId = `${type}-slider`;

    const formattedRange = localValue
        .map((v) => (type === "vote_average" ? v.toFixed(1) : Math.round(v)))
        .join(" — ");

    return (
        <div className="mx-auto grid w-full max-w-xs gap-3">
            <div className="flex items-center justify-between gap-2">
                <label htmlFor={sliderId}>{label}</label>
                <span className="text-sm text-muted-foreground">
                    {formattedRange}
                </span>
            </div>
            <Slider
                id={sliderId}
                value={localValue}
                onValueChange={setLocalValue}
                onValueCommit={onValueCommit}
                min={min}
                max={max}
                step={step}
            />
        </div>
    );
}
