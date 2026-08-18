import { Metadata } from "next";
import Person from "./Person";
import { getPersonFullData } from "@/services/tmdb/movieService";

type Params = { id: string };

export async function generateMetadata({
    params,
}: {
    params: Promise<Params>;
}): Promise<Metadata> {
    const { id } = await params;
    try {
        const person = await getPersonFullData(id);
        return {
            title: person?.name ? `${person.name} — Фильмы и сериалы` : "Актер",
        };
    } catch {
        return {
            title: "Актер",
        };
    }
}

export default async function ProfilePage({
    params,
}: {
    params: Promise<Params>;
}) {
    const { id } = await params;

    const personData = await getPersonFullData(id);

    const credits = personData?.combined_credits?.cast || [];

    return <Person person={personData} credits={credits} />;
}