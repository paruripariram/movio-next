import { CollectionProvider } from "@/context/CollectionProvider";
import Search from "./Search";
import { Metadata } from "next";
import { APP_ROUTES } from "@/config/routes";

export const metadata: Metadata = {
    title: APP_ROUTES.SEARCH.title,
}

export default function SearchLayout() {
    return <CollectionProvider><Search/></CollectionProvider>;
}
