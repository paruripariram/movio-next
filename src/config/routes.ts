export const APP_ROUTES = {
    HOME: { path: "/", title: "Home" },
    SEARCH: { path: "/search", title: "Search" },
    COLLECTION: { path: "/collection", title: "Collection" },
    SIGNIN: { path: "/auth/signin", title: "Sign In" },
    SIGNUP: { path: "/auth/signup", title: "Sign Up" },
    PROFILE: {
        path: (username: string) => `/profile/${username}`,
    },
    DETAILS: {
        path: (type: "movie" | "tv" | "person", id: number) =>
            `/details/${type}/${id}`,
    },
} as const;
