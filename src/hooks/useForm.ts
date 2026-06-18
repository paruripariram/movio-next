'use client'

import { useState } from "react";

export default function useForm<T>(initialState: T) {
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const fieldName = id.replace("-input", "") as keyof T;
        setFormData({
            ...formData,
            [fieldName]: value,
        });
    };
    const resetForm = () => setFormData(initialState);

    return { formData, handleChange, resetForm };
}