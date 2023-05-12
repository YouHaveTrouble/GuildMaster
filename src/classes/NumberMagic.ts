const goldFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 3,
    // @ts-ignore - typescript doesn't know about this option for some godforsaken reason
    notation: "compact",
    useGrouping: true,
});

const damageFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    // @ts-ignore - typescript doesn't know about this option for some godforsaken reason
    notation: "compact",
});

export function formatGold(number: number | null): string {
    if (number === null) return "";
    return goldFormatter.format(number);
}

export function formatDamage(number: number): string {
    return damageFormatter.format(number);
}