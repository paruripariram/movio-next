import ProtectedRoute from "@/components/ProtectedRoute";
import Collection from "./Collection";
import { Metadata } from "next";
import { APP_ROUTES } from "@/config/routes";

export const metadata: Metadata = {
    title: APP_ROUTES.COLLECTION.title,
}

export default function CollectionPage() {
    return (
        <ProtectedRoute>
                <Collection/>
        </ProtectedRoute>
    );
}
