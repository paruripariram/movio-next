'use client'

interface CollectionButtonProps {
    type: "watched" | "wishlist" | "remove" | "notAnAccount";
    onClick?: () => void;
    disabled?: boolean;
}

const mapTitles = {
    watched: "Добавить в коллекцию",
    wishlist: "Хочу посмотреть",
    remove: "Удалить из коллекции",
    notAnAccount: "Войдите, чтобы добавить в коллекцию",
};
export default function CollectionButton({ type, onClick, disabled }: CollectionButtonProps) {
    return (
        <button
            className={`w-40 ${type === "watched" || type === "wishlist" || type === "remove" ? "h-15" : "h-20" }  ${type === "watched" ? "bg-green-800" : type === "wishlist" ? "bg-primary" : type === "remove" ? "bg-red-800" : "bg-gray-500"} text-white rounded-2xl font-bold hover:bg-form-color transition-all duration-300 ease-in-out hover:scale-115`}
            onClick={onClick}
            disabled={disabled}
        >
            {mapTitles[type]}
        </button>
    );
}