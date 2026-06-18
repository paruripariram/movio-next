import ProtectedRoute from "@/components/ProtectedRoute";
import { CollectionProvider } from "@/context/CollectionProvider";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <CollectionProvider>{children}</CollectionProvider>
        </ProtectedRoute>
    );
}
