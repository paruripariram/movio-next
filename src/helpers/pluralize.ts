export function getPluralWord(
    count: number,
    one: string,
    few: string,
    many: string,
): string {
    const absCount = Math.abs(count);
    const lastTwo = absCount % 100;
    
    if (lastTwo >= 11 && lastTwo <= 19) return many;

    const last = absCount % 10;
    if (last === 1) return one;
    if (last >= 2 && last <= 4) return few;
    return many;
}

export function formatPlural(
    count: number,
    one: string,
    few: string,
    many: string,
): string {
    return `${count} ${getPluralWord(count, one, few, many)}`;
}