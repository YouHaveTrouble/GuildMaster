import type {GuildUpgrade} from "@/classes/GuildUpgrade";
import {AdventurerCapacityUpgrade} from "@/classes/guildUpgrades/AdventurerCapacityUpgrade";
import formatGold from "@/classes/NumberMagic";

export class Guild {
    gold: number;
    level: number;
    displayUpgradeCost: number|string;
    upgradeCost: number|null = null;
    adventurerCapacity: AdventurerCapacityUpgrade;

    constructor(level: number, gold: number, upgrades: {[index:string]: GuildUpgrade} = {}) {
        this.gold = gold;
        this.level = level;
        const rawDisplayUpgradeCost = this.getUpgradeCost();
        this.displayUpgradeCost = rawDisplayUpgradeCost ? formatGold(rawDisplayUpgradeCost) : "Max level";
        this.upgradeCost = this.getUpgradeCost();

        this.adventurerCapacity = upgrades.adventurerCapacity as AdventurerCapacityUpgrade ?? new AdventurerCapacityUpgrade();

    }

    upgrade(): void {
        const cost = this.getUpgradeCost();
        if (cost === null) return;
        if (this.gold < cost) return;
        this.gold -= cost;
        this.level += 1;
        if (this.level >= 7) {
            this.displayUpgradeCost = "Max level";
            this.upgradeCost = null;
        } else {
            const newCost = this.getUpgradeCost();
            if (newCost === null) return;
            this.displayUpgradeCost = formatGold(newCost);
            this.upgradeCost = newCost;
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
