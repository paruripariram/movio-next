interface LoaderProps {
    children: React.ReactNode;
    size: "small" | "medium" | "large";
}

export default function Loader({ children, size }: LoaderProps) {
    const spinnerSizes = {
        small: "h-12 w-12 border-4",
        medium: "h-24 w-24 border-8",
        large: "h-36 w-36 border-12",
    };
    const textSizes = {
        small: "text-sm",
        medium: "text-lg",
        large: "text-xl",
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-40 w-full h-full">
            <div
                className={`animate-spin rounded-full ${spinnerSizes[size]} border-gray-200 border-t-primary`}
            ></div>
            <p className={` ${textSizes[size]} text-gray-500 mt-2`}>
                {children}
            </p>
        </div>
    );
}
