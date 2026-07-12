export const APP_ROUTES = {
    HOME: { path: "/", title: "Главная" },
    SEARCH: { path: "/search", title: "Поиск" },
    COLLECTION: { path: "/collection", title: "Коллекция" },
    SIGNIN: { path: "/auth/signin", title: "Войти" },
    SIGNUP: { path: "/auth/signup", title: "Зарегистрироваться" },
    PROFILE: {
        path: (username: string) => `/profile/${username}`,
    },
    DETAILS: {
        path: (type: "movie" | "tv" | "person", id: number) =>
            `/details/${type}/${id}`,
    },
} as const;
