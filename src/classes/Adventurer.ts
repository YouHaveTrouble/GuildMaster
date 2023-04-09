export class Adventurer {
    id: string;
    name: string;
    portrait: string;
    level: number;
    exp: number;
    attackExponent: number;
    prestige: number;
    busy: boolean;

    constructor(
        id: string,
        name: string,
        portrait: string,
        attackExponent: number,
        level: number = 1,
        exp: number = 0,
        prestige: number = 0
    ) {
        this.id = id;
        this.name = name;
        this.portrait = portrait;
        this.attackExponent = attackExponent;
        this.level = level;
        this.exp = exp;
        this.prestige = prestige;
        this.busy = false;
    }

    levelUp(): void {
        this.exp = 0;
        this.level += 1;
    }

    prestigeUp(): void {
        this.level = 1;
        this.exp = 0;
        this.prestige += 1;
    }

    canLevelUp(): boolean {
        if (this.level >= this.getMaxLevel()) return false;
        return this.exp >= this.getNextLevelExpRequirement();
    }

    canPrestigeUp(): boolean {
        if (this.busy) return false;
        if (this.level < getMaxLevelForPrestige(this.prestige)) return false;
        return this.prestige < 5
    }

    getNextLevelExpRequirement(): number {
        return Math.max(1, Math.floor((3 * Math.pow(1.2, this.level - 1)) * Math.pow(1.025, this.level - 1)));
    }

    /**
     * Returns the percentage of exp to the next level
     */
    getExpPercentage(): number {
        return (this.exp / this.getNextLevelExpRequirement()) * 100;
    }

    addExp(exp: number): void {
        if (this.isMaxLevel()) return;
        this.exp += exp;
        if (this.canLevelUp()) {
            this.levelUp();
        }
    }

    getAttack(): number {
        const scalingFactor = Math.pow(1.05, this.level - 1);
        return (2 * scalingFactor) * Math.pow(this.attackExponent, this.level - 1);
    }

    getDPS(): number {
        return this.getAttack() * 4;
    }

    getMaxLevel(): number {
        return getMaxLevelForPrestige(this.prestige);
    }

    isMaxLevel(): boolean {
        return this.level >= this.getMaxLevel();
    }

}

function getMaxLevelForPrestige(prestige: number): number {
    return 25 + (prestige * 5);
}
