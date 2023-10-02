export function calculateCFactor(theta: number) {
  'worklet';
  return (4 / 3) * Math.tan((Math.PI - theta) / 4);
}

export const deriveTangentFromR = (r: number, tanHa: number) => {
  'worklet';
  if (tanHa === 0) return 0;
  return r / tanHa;
};

export const deriveRFromTangent = (tangentLength: number, tanHa: number) => {
  'worklet';
  return tangentLength * tanHa;
};
