"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface MobileDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export default function MobileDrawer({
    isOpen,
    onClose,
    title,
    children,
}: MobileDrawerProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-60 lg:hidden"
                    />

                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 200,
                        }}
                        className="fixed bottom-0 left-0 right-0 z-70 bg-form-color rounded-t-4xl max-h-[85vh] overflow-y-auto p-5 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.3)] flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6 shrink-0">
                            <h2 className="text-xl font-bold text-white">
                                {title}
                            </h2>
                            <button onClick={onClose}>
                                <X
                                    className="text-gray-400 hover:text-white transition-colors"
                                    size={24}
                                />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
