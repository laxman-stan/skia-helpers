import type { SkPath } from '@shopify/react-native-skia';
import type { ArgsOf } from '../../utils';

export type ControleObj =
  | { r: number; curveHandlerFactor?: number; tangentLength?: undefined }
  | { tangentLength: number; curveHandlerFactor?: number; r?: undefined };

export type CurveContrleCb = (cbObj: {
  angle: number;
  maxPossibleR: number;
  defaultCurveHandlerFactor: number;
  maxPossibleTangentLength: number;
}) => ControleObj;

export type CornerControle = number | ControleObj | CurveContrleCb;

export type RoundedCornerReturn = {
  rRoundedCornerTo: (
    x: number,
    y: number,
    cornerControle?: CornerControle
  ) => RoundedCornerReturn;
  roundedCornerTo: (
    x: number,
    y: number,
    cornerControle?: CornerControle
  ) => RoundedCornerReturn;
  lineTo: (x: number, y: number) => SkPathGeneratorType;
  rLineTo: (x: number, y: number) => SkPathGeneratorType;
  // roundedClose: () => SkPath;
  close: () => SkPath;
};

export interface SkPathGeneratorType {
  moveTo: (x: number, y: number) => SkPathGeneratorType;
  lineTo: (x: number, y: number) => SkPathGeneratorType;
  rLineTo: (x: number, y: number) => SkPathGeneratorType;
  close: () => SkPath;
  rRoundedCornerTo: (
    x: number,
    y: number,
    cornerControle?: CornerControle
  ) => RoundedCornerReturn;
  roundedCornerTo: (
    x: number,
    y: number,
    cornerControle?: CornerControle
  ) => RoundedCornerReturn;
  getSkPath: (cornerControle?: CornerControle) => SkPath;
  rMoveTo: (x: number, y: number) => SkPathGeneratorType;
  cubicTo: (...args: SkPathArgs['cubicTo']) => SkPathGeneratorType;
  rCubicTo: (...args: SkPathArgs['rCubicTo']) => SkPathGeneratorType;
  quadTo: (...args: SkPathArgs['quadTo']) => SkPathGeneratorType;
  rQuadTo: (...args: SkPathArgs['rQuadTo']) => SkPathGeneratorType;
  addArc: (...args: SkPathArgs['addArc']) => SkPathGeneratorType;
  addOval: (...args: SkPathArgs['addOval']) => SkPathGeneratorType;
  addPoly: (...args: SkPathArgs['addPoly']) => SkPathGeneratorType;
  offset: (...args: SkPathArgs['offset']) => SkPathGeneratorType;
  rArcTo: (...args: SkPathArgs['rArcTo']) => SkPathGeneratorType;
  rConicTo: (...args: SkPathArgs['rConicTo']) => SkPathGeneratorType;
  conicTo: (...args: SkPathArgs['conicTo']) => SkPathGeneratorType;
  addRect: (...args: SkPathArgs['addRect']) => SkPathGeneratorType;
  addRRect: (...args: SkPathArgs['addRRect']) => SkPathGeneratorType;
  addPath: (...args: SkPathArgs['addPath']) => SkPathGeneratorType;
  addCircle: (...args: SkPathArgs['addCircle']) => SkPathGeneratorType;
}

export type SkPathArgs = ArgsOf<SkPath>;
