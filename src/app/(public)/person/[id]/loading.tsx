import CardSkeleton from "@/components/ui/skeletons/CardSkeleton";

export default function PersonLoading() {
    return (
        <div className="flex flex-col gap-6 w-full animate-pulse">
            <div className="flex gap-6 p-6 bg-zinc-900 rounded-2xl">
                <div className="w-48 h-72 bg-zinc-800 rounded-xl" />
                <div className="flex-1 space-y-4">
                    <div className="h-8 bg-zinc-800 rounded w-1/2" />
                    <div className="h-4 bg-zinc-800 rounded w-full" />
                    <div className="h-4 bg-zinc-800 rounded w-3/4" />
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}