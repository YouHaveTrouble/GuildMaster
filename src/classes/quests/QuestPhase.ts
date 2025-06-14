import type {Adventurer} from "@/classes/Adventurer";
import {PhaseType} from "@/classes/quests/QuestPhaseType";

export default abstract class QuestPhase {

  type: PhaseType;
  points: number;
  maxPoints: number;

  constructor(
    type: PhaseType,
    maxPoints: number = 1,
    points: number = 0,
  ) {
    this.type = type;
    this.points = points;
    this.maxPoints = maxPoints;
  }

  /**
   * Get how many points should be added each tick based on adventurers on a task.
   */
  abstract getPointIncrement(adventurers: Array<Adventurer>): number;

  public tick(adventurers: Array<Adventurer> = []) {
    if (this.completed()) return;
    const pointsToAdd = this.getPointIncrement(adventurers);
    this.points = Math.max(Math.min(this.points + pointsToAdd, this.maxPoints), 0);
  }

  public completed(): boolean {
    return this.points >= this.maxPoints;
  }

}