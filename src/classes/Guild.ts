export class Guild {
    gold: number;
    level: number;
    displayUpgradeCost: number|string;

    upgradeCost: number|null = null;

    constructor(level: number, gold: number) {
        this.gold = gold;
        this.level = level;
        this.displayUpgradeCost = this.getUpgradeCost() ?? "Max level";
        this.upgradeCost = this.getUpgradeCost();
    }

    upgrade(): void {
        const cost = this.getUpgradeCost();
        if (cost === null) return;
        if (this.gold < cost) return;
        this.gold -= cost;
        this.level += 1;
        if (this.level >= 7) {
            this.displayUpgradeCost = "Max level";
        } else {
            const newCost = this.getUpgradeCost();
            if (newCost === null) return;
            this.displayUpgradeCost = newCost;
        }
    }

    getUpgradeCost(): number|null {
        return upgradeCosts[this.level] ?? null;
    }

    isMaxLevel(): boolean {
        return this.level >= 7;
    }
}

const upgradeCosts = {
    "1": 1000,
    "2": 2500,
    "3": 5000,
    "4": 10000,
    "5": 25000,
    "6": 50000,
} as {[index:string]: number}