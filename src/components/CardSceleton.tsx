export default function CardSkeleton() {
    return (
        <div className="relative flex max-w-92.5 w-full aspect-2/3 overflow-hidden rounded-2xl sm:rounded-4xl bg-zinc-900 p-2.5 sm:p-5 flex-col justify-end">
            <div className="absolute inset-y-0 -left-full w-[300%] bg-linear-to-r from-transparent via-zinc-800/60 to-transparent animate-shimmer pointer-events-none z-10" />

            <div className="absolute top-2.5 right-2.5 sm:top-5 sm:right-5 w-10 h-6 sm:w-15 sm:h-10 rounded-xl sm:rounded-4xl bg-zinc-800/80" />

            <div className="space-y-1.5 sm:space-y-2 z-0">
                <div className="h-3.5 sm:h-6 w-4/5 rounded-md bg-zinc-800" />
                <div className="h-3 sm:h-4 w-2/5 rounded-md bg-zinc-800/60" />
            </div>
        </div>
    );
}