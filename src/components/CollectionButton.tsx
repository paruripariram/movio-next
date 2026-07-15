"use client";

import { Check, Trash2 } from "lucide-react";

interface BaseProps {
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
    type,
    onClick,
    disabled,
    variant,
}: CollectionButtonProps) {
    return variant === "full" ? (
        <button
            className={`w-40 ${type === "watched" || type === "wishlist" || type === "remove" ? "h-15" : "h-20"}  ${type === "watched" ? "bg-green-800" : type === "wishlist" ? "bg-primary" : type === "remove" ? "bg-red-800" : "bg-gray-500"} text-white rounded-2xl font-bold hover:bg-form-color transition-all duration-300 ease-in-out hover:scale-115`}
            onClick={onClick}
            disabled={disabled}
        >
            {mapTitles[type]}
        </button>
    ) : (
        <button className={`cursor-pointer ${type === "watched" ? "bg-green-900 text-green-600 hover:bg-green-600 hover:text-green-900" : "bg-red-900 text-red-500 hover:bg-red-500 hover:text-red-900"} w-10 h-10 rounded-4xl flex items-center justify-center hover:scale-110 transition-all duration-300 ease-in-out`} onClick={onClick} disabled={disabled}>
            {mapIcons[type]}
        </button>
    );
}
