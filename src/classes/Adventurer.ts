export class Adventurer {
    id: string;
    name: string;
    portrait: string;
    level: number;
    exp: number;
    attackPerLevel: number;
    defensePerLevel: number;
    busy: boolean;

    constructor(id: string, name: string, portrait: string, attackPerLevel: number, defensePerLevel: number, level: number = 1) {
        this.id = id;
        this.name = name;
        this.portrait = portrait;
        this.attackPerLevel = attackPerLevel;
        this.defensePerLevel = defensePerLevel;
        this.level = level;
        this.exp = 0;
        this.busy = false;
    }

    levelUp(): void {
        this.exp = 0;
        this.level += 1;
    }

    canLevelUp(): boolean {
        return this.exp >= this.getNextLevelExpRequirement();
    }

    getNextLevelExpRequirement(): number {
        return this.level * 3;
    }

    /**
     * Returns the percentage of exp to the next level
     */
    getExpPercentage(): number {
        return (this.exp / this.getNextLevelExpRequirement()) * 100;
    }

}
