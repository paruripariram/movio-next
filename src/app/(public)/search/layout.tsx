import { CollectionProvider } from "@/context/CollectionProvider";

export default function SearchLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <CollectionProvider>{children}</CollectionProvider>;
}
