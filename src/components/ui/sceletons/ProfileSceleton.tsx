export default function ProfileSkeleton() {
    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4 lg:px-8 py-6">
            <div className="flex flex-col gap-8 sm:gap-10">
                <div className="relative overflow-hidden flex flex-col gap-6 bg-form-color shadow-lg rounded-3xl w-full p-6 sm:p-8 lg:p-10 border border-white/5">
                    <div className="absolute inset-y-0 -left-full w-[300%] bg-linear-to-r from-transparent via-gray-800/50 to-transparent animate-shimmer pointer-events-none z-10" />
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full sm:w-auto">

                            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-bgcolor shrink-0" />

                            <div className="flex flex-col gap-3 w-full">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 sm:h-10 w-48 sm:w-64 bg-bgcolor rounded-xl" />
                                    <div className="h-6 sm:h-8 w-24 bg-bgcolor rounded-full" />
                                </div>
                                <div className="h-5 w-40 bg-bgcolor rounded-md" />
                            </div>
                        </div>
                    </div>

                    <div className="h-10 sm:h-11 w-full sm:w-44 bg-bgcolor rounded-xl self-start relative z-0" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="relative overflow-hidden bg-form-color shadow-lg rounded-3xl p-5 sm:p-6 min-h-45 flex flex-col justify-between border border-white/5">
                            <div className="absolute inset-y-0 -left-full w-[300%] bg-linear-to-r from-transparent via-gray-800/50 to-transparent animate-shimmer pointer-events-none z-10" />
                            
                            <div className="flex items-center justify-between gap-2 relative z-0">
                                <div className="w-10 h-10 rounded-xl bg-bgcolor shrink-0" />
                                <div className="h-4 w-20 bg-bgcolor rounded-md" />
                            </div>
                            <div className="space-y-2 relative z-0 mt-4">
                                <div className="h-3.5 w-28 bg-bgcolor rounded-md" />
                                <div className="h-7 w-20 bg-bgcolor rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="relative overflow-hidden flex flex-col gap-6 bg-form-color shadow-lg rounded-3xl w-full p-6 sm:p-8 border border-white/5">
                    <div className="absolute inset-y-0 -left-full w-[300%] bg-linear-to-r from-transparent via-gray-800/50 to-transparent animate-shimmer pointer-events-none z-10" />
                    
                    <div className="flex items-center justify-between relative z-0">
                        <div className="h-6 w-48 bg-bgcolor rounded-md" />
                        <div className="w-5 h-5 bg-bgcolor rounded-md" />
                    </div>
                    <div className="w-full min-h-65 flex items-center justify-center relative z-0">
                        <div className="w-48 h-48 rounded-full bg-bgcolor" />
                    </div>
                </div>
            </div>
        </div>
    );
}