"use client";

import { APP_ROUTES } from "@/config/routes";
import useCollectionActions from "@/hooks/useCollectionActions";
import { useAuthStore } from "@/store/authStore";
import { useWatchedModalStore } from "@/store/watchedModalStore";
import { collectionItem, MovieDetails, SearchResult, TVDetails } from "@/types";
import { Bookmark, Check, Trash2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

interface BaseProps {
    item: MovieDetails | TVDetails | collectionItem | SearchResult;
    mediaType: "movie" | "tv";
}

type CollectionButtonProps =
    | (BaseProps & {
          variant: "full";
          type: "watched" | "wishlist" | "remove" | "notAnAccount";
      })
    | (BaseProps & { variant: "icon"; type: "watched" | "remove" | "wishlist" });

const mapTitles = {
    watched: "Добавить в коллекцию",
    wishlist: "Хочу посмотреть",
    remove: "Удалить",
    notAnAccount: "Войти для добавления",
};

const mapIcons = {
    watched: <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />,
    wishlist: <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />,
    remove: <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />,
    notAnAccount: <LogIn className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />,
};

const buttonStyles = {
    watched: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/20",
    wishlist: "bg-primary hover:bg-primary/90 text-white shadow-primary/20",
    remove: "bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30",
    notAnAccount: "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-white/10",
};

export default function CollectionButton({
    item,
    mediaType,
    type,
    variant,
}: CollectionButtonProps) {
    const router = useRouter();
    const { user } = useAuthStore();
    const openModal = useWatchedModalStore((state) => state.openModal);
    const { isPending, handleAddToCollection, handleRemoveFromCollection } =
        useCollectionActions(mediaType, item, user);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        switch (type) {
            case "watched":
                openModal(item, mediaType);
                break;
            case "wishlist":
                handleAddToCollection("wishlist");
                break;
            case "remove":
                handleRemoveFromCollection();
                break;
            case "notAnAccount":
                router.push(APP_ROUTES.SIGNIN.path);
                break;
        }
    };

    if (variant === "full") {
        return (
            <button
                onClick={handleClick}
                disabled={isPending}
                className={`
                    flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 
                    rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm text-center
                    transition-all duration-200 ease-out shadow-lg
                    hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none
                    w-full sm:w-auto shrink-0 cursor-pointer
                    ${buttonStyles[type]}
                `}
            >
                {mapIcons[type]}
                <span>{mapTitles[type]}</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            className={`
                w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center cursor-pointer
                transition-all duration-200 ease-out hover:scale-110 active:scale-95 disabled:opacity-50
                ${type === "watched" 
                    ? "bg-emerald-950/60 text-emerald-400 hover:bg-emerald-600 hover:text-white" 
                    : type === "wishlist" 
                    ? "bg-primary/20 text-primary hover:bg-primary hover:text-white" 
                    : "bg-rose-950/60 text-rose-400 hover:bg-rose-600 hover:text-white"}
            `}
        >
            {mapIcons[type]}
        </button>
    );
}