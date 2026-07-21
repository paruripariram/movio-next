"use client";

import { useEffect } from "react";

export default function Loading() {
    useEffect(() => {
        document.title = "Movio";
    }, []);

    return (
        <div className="flex flex-col items-center justify-center flex-1 w-full col-span-full min-h-[50vh]">
            <div className="animate-spin rounded-full h-20 w-20 sm:h-28 sm:w-28 2xl:h-36 2xl:w-36 border-8 sm:border-10 2xl:border-12 border-gray-200 border-t-blue-500"></div>
            <p className="text-base sm:text-lg 2xl:text-xl text-gray-500 mt-3 sm:mt-4">
                Пожалуйста, подождите...
            </p>
        </div>
    );
}