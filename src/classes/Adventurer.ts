export class Adventurer {
    id: string;
    name: string;
    portrait: string;
    level: number;
    exp: number;
    attackPerLevel: number;
    busy: boolean;

    constructor(
        id: string,
        name: string,
        portrait: string,
        attackPerLevel: number,
        level: number = 1,
        exp: number = 0
    ) {
        this.id = id;
        this.name = name;
        this.portrait = portrait;
        this.attackPerLevel = attackPerLevel;
        this.level = level;
        this.exp = exp;
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
