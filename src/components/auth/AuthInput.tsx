'use client'

import type {LucideIcon } from "lucide-react";

interface AuthInputProps {
    inputName: string;
    inputType: string;
    label: string;
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: LucideIcon
    isLoading?: boolean;
}

export default function AuthInput({inputName, inputType, label, value, placeholder, onChange, icon: Icon, isLoading }: AuthInputProps) {
    return (
        <div className="flex flex-col gap-1">
                    <label
                        htmlFor={`${inputName   }-input`}
                        className="text-gray-500 font-bold"
                    >
                        {label}
                    </label>
                    <div className="relative">
                        <Icon  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
                        <input
                            id={`${inputName}-input`}
                            name={inputName}
                            type={inputType}
                            className="auth-input"
                            placeholder={placeholder}
                            required
                            value={value}
                            onChange={onChange}
                            disabled={isLoading}
                        />
                    </div>
                </div>
    )
}


