import type {Adventurer} from "@/classes/Adventurer";
import {PhaseType} from "@/classes/quests/QuestPhaseType";

export default class QuestPhase {

  types: Set<PhaseType>;
  points: number;
  maxPoints: number;

  constructor(
    types: PhaseType[],
    maxPoints: number,
    points: number = 0,
  ) {
    this.types = new Set<PhaseType>(types);
    this.points = Math.max(0, points);
    this.maxPoints = Math.max(1, maxPoints);
  }

  /**
   * Get how many points should be added each tick based on adventurers on a task.
   */
  getPointIncrement(adventurers: Array<Adventurer>): number {
    // TODO add point multiplier based on adventurer stats
    return 0.25;
  }

  public tick(adventurers: Array<Adventurer> = []) {
    if (this.completed()) return;
    const pointsToAdd = this.getPointIncrement(adventurers);
    this.points = Math.max(Math.min(this.points + pointsToAdd, this.maxPoints), 0);
  }

  public completed(): boolean {
    return this.points >= this.maxPoints;
  }

  public serialize(): string {
    return JSON.stringify({
      types: Array.from(this.types),
      points: this.points,
      maxPoints: this.maxPoints,
    });
  }

  public static deserialize(data: string): QuestPhase {
    const parsedData = JSON.parse(data);

    if (typeof parsedData?.points !== 'number') {
      throw new Error("Invalid data: 'points' must be a number.");
    }
    if (typeof parsedData?.maxPoints !== 'number') {
      throw new Error("Invalid data: 'maxPoints' must be a number.");
    }
    if (!Array.isArray(parsedData?.types)) {
      throw new Error("Invalid data: 'types' must be an array.");
    }

    const types = parsedData.types.map((type: string) => PhaseType[type as keyof typeof PhaseType]);
    return new QuestPhase(
      types,
      parsedData.maxPoints,
      parsedData.points
    );
  }

}
