import { Metadata } from "next";
import MediaDetails from "./MediaDetails";
import { getMediaDetails } from "@/services/tmdb/movieService";
import { handleError } from "@/helpers/errorHandler";

interface Props {
    params: Promise<{ type: "movie" | "tv"; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { type, id } = await params;

    try {
        const details = await getMediaDetails(id, type);
        const title = type === "movie" ? details.title : details.name;
        return {
            title: title || "Media Details",
            description: details.overview || "",
        };
    } catch (error) {
        handleError(error, "Error fetching media details for metadata:");
        return { title: "Media Details" };
    }
}

export default function MediaDetailsPage() {
    return <MediaDetails />;
}
