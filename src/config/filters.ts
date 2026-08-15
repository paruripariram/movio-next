export const SLIDER_CONFIG = {
    release_date: {
        min: 1870,
        max: new Date().getFullYear(),
        step: 1,
        label: "Дата выхода",
    },
    vote_average: {
        min: 0,
        max: 10,
        step: 0.1,
        label: "Рейтинг",
    },
} as const;