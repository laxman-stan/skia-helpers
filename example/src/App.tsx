import * as React from 'react';

import { Dimensions, StyleSheet } from 'react-native';
import { Canvas, Group, Path, type SkPath } from '@shopify/react-native-skia';
import { SkPathGenerator } from '../../src/skiaApiWrappers/path';
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const { width: SW, height: SH } = Dimensions.get('window');

const size = 150;
const r1 = size / 4;
const r2 = size / 2;

export default function Example() {
  const path1 = SkPathGenerator()
    .moveTo(0, 0)
    .rRoundedCornerTo(size, 0, 0)
    .rRoundedCornerTo(-size, size, 0)
    .rRoundedCornerTo(0, size, r2)
    .rRoundedCornerTo(size, 0, ({ defaultCurveHandlerFactor }) => ({
      r: r2,
      curveHandlerFactor: defaultCurveHandlerFactor * 0.6,
    }))
    .rLineTo(0, -size)
    .getSkPath();

  const path2 = SkPathGenerator()
    .moveTo(0, 0)
    .rRoundedCornerTo(size, 0, r1)
    .rRoundedCornerTo(-size, size, r2)
    .rRoundedCornerTo(0, size, r2)
    .rRoundedCornerTo(size, 0, ({ defaultCurveHandlerFactor }) => ({
      r: r2,
      curveHandlerFactor: defaultCurveHandlerFactor * 1.3,
    }))
    .rLineTo(0, -size)
    .getSkPath();

  const progress = useSharedValue(0);
  const pathToDisplay = useDerivedValue<SkPath>(
    () => path2.interpolate(path1, progress.value)!,
    [progress]
  );

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.linear }),
      -1,
      true
    );
  }, [progress]);

  return (
    <Canvas style={styles.canvas}>
      <Group transform={[{ translateX: 100 }, { translateY: 100 }]}>
        <Path
          path={pathToDisplay}
          style="stroke"
          color="white"
          strokeWidth={2}
        />
      </Group>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: SW,
    height: SH,
    backgroundColor: 'black',
  },
});
