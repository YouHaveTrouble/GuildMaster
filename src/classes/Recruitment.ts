import type {Adventurer} from "@/classes/Adventurer";


/**
 * Get a random adventurer from the pool
 * @param adventurerPool
 * @param exceptions
 * @returns {Adventurer|null} null if the pool is empty
 */
export function getNewAdventurerForHire(adventurerPool: Array<Adventurer>, exceptions: Array<Adventurer> = []): Adventurer|null {
    if (adventurerPool.length <= 0) return null;
    const pool = Array.from(adventurerPool);
    const exceptionSet = new Set(exceptions);
    pool.filter((adventurer) => !exceptionSet.has(adventurer));
    const randomId = adventurerPool.length * Math.random() << 0;
    return adventurerPool[randomId];
}
