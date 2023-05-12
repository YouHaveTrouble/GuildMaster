import type {GuildUpgrade} from "@/classes/GuildUpgrade";
import AdventurerCapacityUpgrade from "@/classes/guildUpgrades/AdventurerCapacityUpgrade";
import {formatGold} from "@/classes/NumberMagic";
import QuestExpUpgrade from "@/classes/guildUpgrades/QuestExpUpgrade";
import QuestGoldUpgrade from "@/classes/guildUpgrades/QuestGoldUpgrade";
import AutoFinishQuestsUpgrade from "@/classes/guildUpgrades/AutoFinishQuestsUpgrade";

const MAX_LEVEL: number = 8;

export class Guild {
    gold: number;
    level: number;
    displayUpgradeCost: number|string;
    upgradeCost: number|null = null;
    adventurerCapacity: AdventurerCapacityUpgrade;
    expModifier: QuestExpUpgrade;
    goldModifier: QuestGoldUpgrade;
    autoFinishQuestsUpgrade: AutoFinishQuestsUpgrade;

    constructor(level: number, gold: number, upgrades: {[index:string]: GuildUpgrade} = {}) {
        this.gold = gold;
        this.level = level;
        const rawDisplayUpgradeCost = this.getUpgradeCost();
        this.displayUpgradeCost = rawDisplayUpgradeCost ? formatGold(rawDisplayUpgradeCost) : "Max level";
        this.upgradeCost = this.getUpgradeCost();

        this.adventurerCapacity = upgrades.adventurerCapacity as AdventurerCapacityUpgrade ?? new AdventurerCapacityUpgrade();
        this.expModifier = upgrades.expModifier as QuestExpUpgrade ?? new QuestExpUpgrade();
        this.goldModifier = upgrades.goldModifier as QuestGoldUpgrade ?? new QuestGoldUpgrade();
        this.autoFinishQuestsUpgrade = upgrades.autoFinishQuestsUpgrade as AutoFinishQuestsUpgrade ?? new AutoFinishQuestsUpgrade();

    }

    upgrade(): void {
        const cost = this.getUpgradeCost();
        if (cost === null) return;
        if (this.gold < cost) return;
        this.gold -= cost;
        this.level += 1;
        if (this.level >= MAX_LEVEL) {
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
        return this.level >= MAX_LEVEL;
    }
}

const upgradeCosts = {
    "1": 1000,
    "2": 2500,
    "3": 5000,
    "4": 10000,
    "5": 25000,
    "6": 100000,
    "7": 750000,
} as {[index:string]: number}
