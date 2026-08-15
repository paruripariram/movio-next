"use client";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SELECT_CONFIGS } from "@/config/filters";

interface FilterSelectProps {
    type: "sortBy" | "collectionSortBy";
    value?: string;
    onValueChange: (value: string) => void;
}



export function FilterSelect({
    type,
    value = SELECT_CONFIGS[type].defaultValue,
    onValueChange,
}: FilterSelectProps) {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={SELECT_CONFIGS[type].placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{SELECT_CONFIGS[type].label}</SelectLabel>
                    {SELECT_CONFIGS[type].options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
