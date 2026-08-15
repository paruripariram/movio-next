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

export const SELECT_CONFIGS = {
    sortBy: {
        placeholder: "Сортировка",
        label: "Сортировка",
        defaultValue: "popularity.desc",
        options: [
            { value: "popularity.desc", label: "По популярности" },
            { value: "vote_average.desc", label: "По рейтингу" },
            { value: "primary_release_date.desc", label: "Сначала новые" },
            { value: "primary_release_date.asc", label: "Сначала старые" },
        ],
    },
    collectionSortBy: {
        placeholder: "Сортировка",
        label: "Сортировка",
        defaultValue: "addedAt.desc",
        options: [
            { value: "addedAt.desc", label: "По дате добавления" },
            { value: "vote_average.desc", label: "По рейтингу" },
            { value: "primary_release_date.desc", label: "Сначала новые" },
            { value: "primary_release_date.asc", label: "Сначала старые" },
            { value: "title.asc", label: "По алфавиту (А-Я)" },
        ],
    },
} as const;