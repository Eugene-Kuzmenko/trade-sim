/**
 * Calculates angle of the vector between origin point and destination point
 * @param {Point} a - origin point
 * @param {Point} b - destination point
 * @returns {number}
 */
 export default function getVectorAngle(a, b) {
   
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  let angle = Math.atan2(dy, dx);
  return angle;
}

//sign(x*y)*atan((abs(x)-abs(y))/(abs(x)+abs(y)))