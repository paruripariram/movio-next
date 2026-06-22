import ProtectedRoute from "@/components/ProtectedRoute";
import { CollectionProvider } from "@/context/CollectionProvider";
import Profile from "./Profile";
import { Metadata } from "next";

type Params = { username: string };

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    return {
        title: "@" + (await params).username,
    };
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <CollectionProvider>
                <Profile />
            </CollectionProvider>
        </ProtectedRoute>
    );
}
