'use client'

interface CollectionButtonProps {
    type: "watched" | "wishlist" | "remove" | "notAnAccount";
    onClick?: () => void;
    disabled?: boolean;
}

const mapTitles = {
    watched: "Add to Watched",
    wishlist: "Add to Wishlist",
    remove: "Remove from Collection",
    notAnAccount: "Sign in to add to collection",
};
function CollectionButton({ type, onClick, disabled }: CollectionButtonProps) {
    return (
        <button
            className={`w-35 h-11 ${type === "watched" ? "bg-green-800" : type === "wishlist" ? "bg-primary" : type === "remove" ? "bg-red-800" : "bg-gray-500"} text-white rounded-2xl font-bold hover:bg-form-color transition-all duration-300 ease-in-out hover:scale-115`}
            onClick={onClick}
            disabled={disabled}
        >
            {mapTitles[type]}
        </button>
    );
}

export default CollectionButton;
