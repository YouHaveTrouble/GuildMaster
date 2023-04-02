const formatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 3,
    // @ts-ignore - typescript doesn't know about this option for some godforsaken reason
    notation: "compact",
    useGrouping: true,
});

export default function formatGold(number: number): string {
    return formatter.format(number);
}