import type { Vector } from '@shopify/react-native-skia';

const vec = (x: number, y?: number) => {
  'worklet';
  return { x, y: y ?? x };
};

export const vecSum = (v1: Vector, v2: Vector | number) => {
  'worklet';
  if (typeof v2 === 'number') {
    return vec(v1.x + v2, v1.y + v2);
  }
  return vec(v1.x + v2.x, v1.y + v2.y);
};

export const vecSub = (v1: Vector, v2: Vector | number) => {
  'worklet';
  if (typeof v2 === 'number') {
    return vec(v1.x - v2, v1.y - v2);
  }
  return vec(v1.x - v2.x, v1.y - v2.y);
};

export const vecDis = (v1: Vector, v2: Vector): number => {
  'worklet';
  return Math.hypot(v1.x - v2.x, v1.y - v2.y);
};

export function vecAngle(a: Vector, b: Vector, c: Vector): number {
  'worklet';
  // Form the vectors BA and BC
  const ba: Vector = { x: a.x - b.x, y: a.y - b.y };
  const bc: Vector = { x: c.x - b.x, y: c.y - b.y };

  // Calculate the dot product of BA and BC
  const dotProduct = ba.x * bc.x + ba.y * bc.y;

  // Calculate the magnitude of BA and BC
  const magBA = Math.hypot(ba.x, ba.y);
  const magBC = Math.hypot(bc.x, bc.y);
  // console.log('doing', a, b, c);
  // Calculate the angle using arccosine (and convert it to degrees)

  if (magBA === 0 || magBC === 0) return 0;
  return Math.acos(dotProduct / (magBA * magBC));
}

export function getVecTowardsAnotherVecAtDistance(
  startPoint: Vector,
  endPoint: Vector,
  distance: number
): Vector {
  'worklet';
  const angle = Math.atan2(
    endPoint.y - startPoint.y,
    endPoint.x - startPoint.x
  );
  return vec(
    startPoint.x + distance * Math.cos(angle),
    startPoint.y + distance * Math.sin(angle)
  );
}

export const logVec = (v: Vector, id = 'vec', precision = 2) => {
  'worklet';
  __DEV__ &&
    console.log(id, {
      x: Number(v.x.toFixed(precision)),
      y: Number(v.y.toFixed(precision)),
    });
};
