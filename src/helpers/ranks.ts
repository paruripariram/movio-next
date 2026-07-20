export interface Rank {
    min: number;
    max: number;
    title: string;
    textColor: string;
    bgColor: string;
    borderColor: string;
}

export const RANKS: Rank[] = [
    {
        min: 0,
        max: 0,
        title: "Зритель на паузе",
        textColor: "text-slate-400",
        bgColor: "bg-slate-500/10",
        borderColor: "border-slate-500/20",
    },
    {
        min: 1,
        max: 10,
        title: "Любитель попкорна",
        textColor: "text-amber-400",
        bgColor: "bg-amber-500/15",
        borderColor: "border-amber-500/30",
    },
    {
        min: 11,
        max: 30,
        title: "Заядлый киноман",
        textColor: "text-sky-400",
        bgColor: "bg-sky-500/15",
        borderColor: "border-sky-500/30",
    },
    {
        min: 31,
        max: 70,
        title: "Марафонщик",
        textColor: "text-indigo-400",
        bgColor: "bg-indigo-500/15",
        borderColor: "border-indigo-500/30",
    },
    {
        min: 71,
        max: 150,
        title: "Диванный критик",
        textColor: "text-rose-400",
        bgColor: "bg-rose-500/15",
        borderColor: "border-rose-500/30",
    },
    {
        min: 151,
        max: 300,
        title: "Магистр синематографа",
        textColor: "text-purple-400",
        bgColor: "bg-purple-500/15",
        borderColor: "border-purple-500/30",
    },
    {
        min: 301,
        max: Infinity,
        title: "Повелитель пультов",
        textColor: "text-yellow-300",
        bgColor: "bg-amber-400/20",
        borderColor: "border-yellow-400/50",
    },
];

export function getRank(totalCount: number): Rank {
    return (
        RANKS.find((r) => totalCount >= r.min && totalCount <= r.max) ||
        RANKS[0]
    );
}