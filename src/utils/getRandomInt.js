/**
 * Returns a random integer in range from min to max
 * @param {number} min - lowest number
 * @param {number} max - highest number
 */
export default function getRandomInt(max, min = 0) {
  const intMax = Math.floor(max);
  const intMin = Math.ceil(min);
  return intMin + Math.floor((intMax - intMin) * Math.random());
}