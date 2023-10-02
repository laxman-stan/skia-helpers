/* eslint-disable @typescript-eslint/no-shadow */
import { Skia, dist } from '@shopify/react-native-skia';
import {
  isFn,
  isNum,
  vecAngle,
  getVecTowardsAnotherVecAtDistance,
  vecSum,
  // logVec,
} from '../../utils';
import type { Vector } from '@shopify/react-native-skia';
import {
  calculateCFactor,
  deriveRFromTangent,
  deriveTangentFromR,
} from './utils';
import type {
  CornerControle,
  CurveContrleCb,
  SkPathGeneratorType,
  RoundedCornerReturn,
  SkPathArgs,
} from './types';

export function SkPathGenerator(): SkPathGeneratorType {
  'worklet';
  const skPathIntance = Skia.Path.Make();
  let lastMoveTo = { x: 0, y: 0 };

  const cubicTo = (...args: SkPathArgs['cubicTo']) => {
    skPathIntance.cubicTo(...args);
    return pathInstance;
  };

  const rCubicTo = (...args: SkPathArgs['rCubicTo']) => {
    skPathIntance.rCubicTo(...args);
    return pathInstance;
  };

  const quadTo = (...args: SkPathArgs['quadTo']) => {
    skPathIntance.quadTo(...args);
    return pathInstance;
  };

  const rQuadTo = (...args: SkPathArgs['rQuadTo']) => {
    skPathIntance.rQuadTo(...args);
    return pathInstance;
  };

  const addArc = (...args: SkPathArgs['addArc']) => {
    skPathIntance.addArc(...args);
    return pathInstance;
  };

  const addOval = (...args: SkPathArgs['addOval']) => {
    skPathIntance.addOval(...args);
    return pathInstance;
  };

  const addPoly = (...args: SkPathArgs['addPoly']) => {
    skPathIntance.addPoly(...args);
    return pathInstance;
  };

  const offset = (...args: SkPathArgs['offset']) => {
    skPathIntance.offset(...args);
    return pathInstance;
  };

  const rArcTo = (...args: SkPathArgs['rArcTo']) => {
    skPathIntance.rArcTo(...args);
    return pathInstance;
  };

  const rConicTo = (...args: SkPathArgs['rConicTo']) => {
    skPathIntance.rConicTo(...args);
    return pathInstance;
  };

  const conicTo = (...args: SkPathArgs['conicTo']) => {
    skPathIntance.conicTo(...args);
    return pathInstance;
  };

  const addRect = (...args: SkPathArgs['addRect']) => {
    skPathIntance.addRect(...args);
    return pathInstance;
  };

  const addRRect = (...args: SkPathArgs['addRRect']) => {
    skPathIntance.addRRect(...args);
    return pathInstance;
  };

  const addPath = (...args: SkPathArgs['addPath']) => {
    skPathIntance.addPath(...args);
    return pathInstance;
  };

  const addCircle = (...args: SkPathArgs['addCircle']) => {
    skPathIntance.addCircle(...args);
    return pathInstance;
  };

  const rMoveTo = (x: number, y: number) => {
    const lastPt = skPathIntance.getLastPt();
    lastMoveTo = vecSum(lastPt, { x, y });
    skPathIntance.rMoveTo(x, y);
    return pathInstance;
  };

  const moveTo = (x: number, y: number) => {
    skPathIntance.moveTo(x, y);
    lastMoveTo = { x, y };
    return pathInstance;
  };

  const close = () => {
    skPathIntance.close();
    return skPathIntance;
  };

  const lineTo = (...args: SkPathArgs['lineTo']) => {
    skPathIntance.lineTo(...args);
    return pathInstance;
  };

  const rLineTo = (x: number, y: number) => {
    skPathIntance.rLineTo(x, y);
    return pathInstance;
  };

  function addCurvedPoint(
    lastPt: Vector,
    cornerPt: Vector,
    nextPt: Vector,
    cornerControle: CornerControle,
    isNextCornerRounded: boolean
  ) {
    let r, curveHandlerFactor, tangentLength, cornerFn;
    if (isNum(cornerControle)) {
      r = cornerControle;
    } else if (isFn(cornerControle)) {
      cornerFn = cornerControle as CurveContrleCb;
      // if (is(cornerControle))
    } else {
      // ({ r, curveHandlerFactor, tangentLength } = cornerControle);
    }

    const preDis = dist(lastPt, cornerPt);
    let angle = vecAngle(lastPt, cornerPt, nextPt);
    angle === Math.PI ? 0 : angle;
    const defaultCFactor = calculateCFactor(angle);

    const nextDis = dist(cornerPt, nextPt);
    const maxTangentLength = Math.min(preDis, nextDis);

    const tanHa = Math.tan(angle / 2);
    const maxR = deriveRFromTangent(maxTangentLength, tanHa);

    let rToApply, cFactorToApply, tangentLengthToApply;
    if (cornerFn) {
      ({ r, curveHandlerFactor, tangentLength } = cornerFn({
        angle,
        maxPossibleR: maxR,
        defaultCurveHandlerFactor: defaultCFactor,
        maxTangentLength: maxTangentLength,
      }));
    }

    if (isNum(tangentLength)) {
      tangentLengthToApply = Math.min(tangentLength!, maxTangentLength);
      rToApply = deriveRFromTangent(tangentLengthToApply, tanHa);
    } else {
      rToApply = Math.min(r ?? 0, maxR);
      tangentLengthToApply = deriveTangentFromR(rToApply, tanHa);
    }
    cFactorToApply = curveHandlerFactor ?? defaultCFactor;

    const controlPtDis = tangentLengthToApply - cFactorToApply * rToApply;

    const directLinePt = getVecTowardsAnotherVecAtDistance(
      cornerPt,
      lastPt,
      tangentLengthToApply
    );

    const cornerPointHandle1 = getVecTowardsAnotherVecAtDistance(
      cornerPt,
      lastPt,
      controlPtDis
    );
    const cornerPointHandle2 = getVecTowardsAnotherVecAtDistance(
      cornerPt,
      nextPt,
      controlPtDis
    );
    const cubicPt = getVecTowardsAnotherVecAtDistance(
      cornerPt,
      nextPt,
      tangentLengthToApply
    );
    skPathIntance.lineTo(directLinePt.x, directLinePt.y);
    // logVec(directLinePt, 'directLinePt');
    // logVec(cornerPointHandle1, 'cornerPointHandle1');
    // logVec(cornerPointHandle2, 'cornerPointHandle1');
    // logVec(cubicPt, 'cubicPt');
    skPathIntance.cubicTo(
      cornerPointHandle1.x,
      cornerPointHandle1.y,
      cornerPointHandle2.x,
      cornerPointHandle2.y,
      cubicPt.x,
      cubicPt.y
    );

    if (!isNextCornerRounded) {
      lineTo(nextPt.x, nextPt.y);
    }
  }

  const _roundedCornerTo = (
    x: number,
    y: number,
    cornerControle: CornerControle,
    isAbsoute = false
  ): RoundedCornerReturn => {
    const lastPt = skPathIntance.getLastPt();
    const cornerPt = isAbsoute ? { x, y } : vecSum(lastPt, { x, y });

    const addNextPt = (nextPt: Vector, isNextCornerRounded = false) =>
      addCurvedPoint(
        lastPt,
        cornerPt,
        nextPt,
        cornerControle,
        isNextCornerRounded
      );

    return {
      lineTo: (x: number, y: number) => {
        addNextPt({ x, y });
        return pathInstance;
      },
      rLineTo: (x: number, y: number) => {
        addNextPt(vecSum(cornerPt, { x, y }));
        return pathInstance;
      },
      rRoundedCornerTo: (
        x: number,
        y: number,
        cornerControle: CornerControle = 0
      ) => {
        const absNextPt = vecSum(cornerPt, { x, y });
        addNextPt(absNextPt, true);
        return _roundedCornerTo(absNextPt.x, absNextPt.y, cornerControle, true);
      },
      roundedCornerTo: (
        x: number,
        y: number,
        cornerControle: CornerControle = 0
      ) => {
        const absNextPt = { x, y };
        addNextPt(absNextPt, true);
        return _roundedCornerTo(x, y, cornerControle, true);
      },
      close: () => {
        const asbNextPoint = lastMoveTo;
        addNextPt(asbNextPoint, true);
        skPathIntance.close();
        return skPathIntance;
      },
      roundedClose: () => {
        const asbNextPoint = lastMoveTo;
        addNextPt(asbNextPoint, true);
        skPathIntance.close();
        return skPathIntance;
      },
    };
  };

  const roundedCornerTo = (
    x: number,
    y: number,
    cornerControle: CornerControle = 0
  ) => _roundedCornerTo(x, y, cornerControle, true);

  const rRoundedCornerTo = (
    x: number,
    y: number,
    cornerControle: CornerControle = 0
  ) => _roundedCornerTo(x, y, cornerControle, false);

  const pathInstance = {
    rRoundedCornerTo,
    roundedCornerTo,
    close,
    moveTo,
    lineTo,
    rLineTo,
    rMoveTo,
    cubicTo,
    rCubicTo,
    quadTo,
    rQuadTo,
    addArc,
    addOval,
    addPoly,
    offset,
    rArcTo,
    rConicTo,
    conicTo,
    addRect,
    addRRect,
    addPath,
    addCircle,
    getSkPath: () => skPathIntance,
  };

  return pathInstance;
}
