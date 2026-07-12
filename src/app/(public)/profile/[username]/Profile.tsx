"use client";
;
import { signOut } from "next-auth/react";
import Loader from "@/components/Loader";
import { APP_ROUTES } from "@/config/routes";
import { handleError } from "@/helpers/errorHandler";
import { useCollectionStore } from "@/store/collectionStore";
import { useAuthStore } from "@/store/authStore";

function Profile() {
    const { user, isLoadingUser } = useAuthStore();
    
    const collectionArr = useCollectionStore((state) => state.collectionArr);
    const isLoadingCollection = useCollectionStore(
        (state) => state.isLoadingCollection,
    );
    const watchedMedia = collectionArr.filter(
        (item) => item.status === "watched",
    );

    async function handleLogout() {
        try {
            await signOut({ callbackUrl: APP_ROUTES.SIGNIN.path });
        } catch (error) {
            handleError(error, "Ошибка при выходе из аккаунта");
        }
    }

    return (
        <div className="flex flex-col gap-6">
            {isLoadingUser && <Loader size="large">Аутентификация...</Loader>}
            {!isLoadingUser && user && (
                <h1 className="text-gray-500 text-4xl">
                    {" "}
                    {user.name || user.email}
                </h1>
            )}
            {isLoadingCollection && (
                <Loader size="medium">Загрузка вашей коллекции...</Loader>
            )}
            {!isLoadingCollection && watchedMedia.length === 0 && (
                <p className="text-gray-500 text-lg px-6">
                    Вы еще ничего не смотрели.
                </p>
            )}
            {!isLoadingCollection && watchedMedia.length > 0 && (
                <p className="text-gray-500 text-lg px-6">
                    Вы посмотрели {watchedMedia.length} фильмов или сериалов.
                </p>
            )}
            <button
                className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded w-25 transition duration-200"
                onClick={handleLogout}
            >
                Выйти
            </button>
        </div>
    );
}

export default Profile;
