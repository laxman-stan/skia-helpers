# react-native-skia-helpers

extends the functionality of react-native-skia

## Installation

```sh
npm install react-native-skia-helpers
```

## Example

Currently, we are only exporting `SkPathGenerator` function

```typescript
import * as React from 'react';

import { Dimensions, StyleSheet } from 'react-native';
import {
  Canvas,
  Group,
  Path,
  type SkPath,
  useComputedValue,
  useClockValue,
} from '@shopify/react-native-skia';
import { SkPathGenerator } from 'react-native-skia-helpers';

const { width: SW, height: SH } = Dimensions.get('window');

const size = 150;
const r1 = size / 4;
const r2 = size / 2;

export default function App() {
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
    .getSkPath(); // this is required to use the path inside Path component

  const clock = useClockValue();
  const pathToDisplay = useComputedValue<SkPath>(() => {
    const progress = Math.sin(clock.current / 1000) / 2 + 0.5;
    return path2.interpolate(path1, progress)!;
  }, [clock]);

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
    backgroundColor: 'green',
  },
});

```
### Note
A more detailed documentation is being written.


## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
