"use client";

import { APP_ROUTES } from "@/config/routes";
import useCollectionActions from "@/hooks/useCollectionActions";
import { useAuthStore } from "@/store/authStore";
import { useWatchedModalStore } from "@/store/watchedModalStore";
import { collectionItem, MovieDetails, SearchResult, TVDetails } from "@/types";
import { Check, Trash2 } from "lucide-react";
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
    | (BaseProps & { variant: "icon"; type: "watched" | "remove" });

const mapTitles = {
    watched: "Добавить в коллекцию",
    wishlist: "Хочу посмотреть",
    remove: "Удалить из коллекции",
    notAnAccount: "Войдите, чтобы добавить в коллекцию",
};

const mapIcons = {
    watched: <Check className="w-5 h-5" />,
    remove: <Trash2 className="w-5 h-5" />,
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
        }
    };

    return variant === "full" ? (
        <button
            className={`w-40 ${type === "watched" || type === "wishlist" || type === "remove" ? "h-15" : "h-20"}  ${type === "watched" ? "bg-green-800" : type === "wishlist" ? "bg-primary" : type === "remove" ? "bg-red-800" : "bg-gray-500"} text-white rounded-2xl font-bold hover:bg-form-color transition-all duration-300 ease-in-out hover:scale-115`}
            onClick={handleClick}
            disabled={isPending}
        >
            {mapTitles[type]}
        </button>
    ) : (
        <button
            className={`cursor-pointer ${type === "watched" ? "bg-green-900 text-green-600 hover:bg-green-600 hover:text-green-900" : "bg-red-900 text-red-500 hover:bg-red-500 hover:text-red-900"} w-10 h-10 rounded-4xl flex items-center justify-center hover:scale-110 transition-all duration-300 ease-in-out`}
            onClick={handleClick}
            disabled={isPending}
        >
            {mapIcons[type]}
        </button>
    );
}
