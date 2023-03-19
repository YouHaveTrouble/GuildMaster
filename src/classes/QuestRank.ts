export enum QuestRank {
    S = "S",
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
    F = "F",
}

export function getFromString(string: keyof typeof QuestRank): QuestRank {
    return QuestRank[string];
}