import getRandomInt from "./getRandomInt";

/**
 * Pick value from array at random
 * @param {any[]} array 
 */
export default function pickAtRandom(array) {
  return array[getRandomInt(array.length)];
}