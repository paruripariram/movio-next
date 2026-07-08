interface PlatformOption {
    id: string;
    name: string;
    logoUrl: string;
}

export const PLATFORMS: PlatformOption[] = [
    { id: "kinopoisk", name: "Кинопоиск", logoUrl: "/streamings/kinopoisk.webp" },
    { id: "ivi", name: "Иви", logoUrl: "/streamings/ivi.webp" },
    { id: "okko", name: "Okko", logoUrl: "/streamings/okko.webp" },
    { id: "start", name: "START", logoUrl: "/streamings/start.webp" },
    { id: "kion", name: "КИОН", logoUrl: "/streamings/kion.webp" },
    { id: "wink", name: "Wink", logoUrl: "/streamings/wink.webp" },
    { id: "netflix", name: "Netflix", logoUrl: "/streamings/netflix.webp" },
    { id: "disneyplus", name: "Disney+", logoUrl: "/streamings/disneyplus.webp" },
    { id: "hbomax", name: "HBO Max", logoUrl: "/streamings/hbomax.webp" },
    { id: "primevideo", name: "Amazon Prime Video", logoUrl: "/streamings/primevideo.webp" },
    { id: "appletv", name: "Apple TV", logoUrl: "/streamings/appletv.webp" },

    { id: "cinema", name: "В кинотеатре", logoUrl: "/streamings/cinema.webp" },
    { id: "home", name: "Дома на диване", logoUrl: "/streamings/home.webp" },
    { id: "other", name: "Другое", logoUrl: "/streamings/internet.webp" },
];