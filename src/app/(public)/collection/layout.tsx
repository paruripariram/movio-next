import ProtectedRoute from "@/components/ProtectedRoute";
import { CollectionProvider } from "@/context/CollectionProvider";

export default function CollectionLayout({
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
