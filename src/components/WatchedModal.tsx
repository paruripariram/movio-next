"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { PLATFORMS } from "@/config/platforms";
import { motion, AnimatePresence } from "framer-motion";

interface WatchedModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (platformId: string) => void;
    movieTitle?: string;
}

export default function WatchedModal({
    isOpen,
    onClose,
    onConfirm,
    movieTitle,
}: WatchedModalProps) {
    const [selectedPlatform, setSelectedPlatform] = useState<string>("");

    const handleConfirm = () => {
        if (!selectedPlatform) return;
        onConfirm(selectedPlatform);
        setSelectedPlatform("");
    };

    const handleCancel = () => {
        setSelectedPlatform("");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100 flex justify-center items-start pt-[12vh] p-4 overflow-y-auto"
                    onClick={handleCancel}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 15 }}
                        transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 26,
                        }}
                        className="bg-form-color border border-back-link-color text-white rounded-2xl w-full max-w-md p-6 relative shadow-glow-bold flex flex-col gap-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleCancel}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col gap-1.5 pr-6">
                            <h3 className="text-xl font-bold tracking-tight text-white">
                                Где вы посмотрели фильм?
                            </h3>
                            {movieTitle && (
                                <p className="text-gray-400 text-sm font-medium border-l-2 border-zinc-700 pl-2.5 italic truncate">
                                    {movieTitle}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 max-h-85 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                            {PLATFORMS.map((platform) => {
                                const isSelected =
                                    selectedPlatform === platform.id;

                                return (
                                    <button
                                        key={platform.id}
                                        onClick={() =>
                                            setSelectedPlatform(platform.id)
                                        }
                                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl border text-left cursor-pointer transition-all active:scale-[0.99] ${
                                            isSelected
                                                ? "bg-back-link-color border-primary shadow-glow text-white shadow-black/40"
                                                : "bg-input-color/40 border-form-color text-gray-400 hover:bg-input-color hover:border-primary/30"
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center  bg-input-color shrink-0 border border-back-link-color">
                                                <Image
                                                    src={platform.logoUrl}
                                                    alt={platform.name}
                                                    width={32}
                                                    height={32}
                                                    className="object-contain"
                                                />
                                            </div>
                                            <span className="font-semibold text-sm sm:text-base tracking-wide">
                                                {platform.name}
                                            </span>
                                        </div>

                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="radio"
                                                name="platform"
                                                checked={isSelected}
                                                onChange={() =>
                                                    setSelectedPlatform(
                                                        platform.id,
                                                    )
                                                }
                                                className="sr-only"
                                            />
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                                                    isSelected
                                                        ? "border-primary"
                                                        : "border-primary/20"
                                                }`}
                                            >
                                                {isSelected && (
                                                    <motion.div
                                                        layoutId="activeRadioCircle"
                                                        className="w-2.5 h-2.5 rounded-full bg-primary"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex gap-3 mt-1">
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-back-link-color hover:bg-input-color text-gray-300 hover:text-zinc-200 py-3 rounded-xl border border-zinc-800/60 transition-all font-semibold text-sm cursor-pointer active:scale-95"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedPlatform}
                                className="flex-1 bg-primary text-white hover:bg-primary/90 shadow-glow disabled:bg-zinc-900 disabled:text-zinc-700 py-3 rounded-xl transition-all font-bold text-sm cursor-pointer disabled:cursor-not-allowed active:scale-95"
                            >
                                Подтвердить
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
