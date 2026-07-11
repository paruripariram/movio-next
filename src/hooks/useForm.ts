"use client";

import { useState } from "react";

type Errors = Record<string, string[] | undefined>;

export default function useForm<T>(initialState: T) {
    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState<Errors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };
    const resetForm = () => {
        setFormData(initialState);
        setErrors({});
    };

    return { formData, handleChange, errors, setErrors, resetForm };
}
