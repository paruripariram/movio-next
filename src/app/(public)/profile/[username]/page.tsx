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
                <Profile />
    );
}
