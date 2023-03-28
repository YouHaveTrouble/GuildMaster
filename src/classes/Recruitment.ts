import type {Adventurer} from "@/classes/Adventurer";


/**
 * Get a random adventurer from the pool
 * @param adventurerPool
 * @returns {Adventurer|null} null if the pool is empty
 */
export function getNewAdventurerForHire(adventurerPool: Array<Adventurer>): Adventurer|null {
    if (adventurerPool.length <= 0) return null;
    const randomId = adventurerPool.length * Math.random() << 0;
    return adventurerPool[randomId];
}