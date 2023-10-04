# react-native-skia-helpers

extends the functionality of react-native-skia

## Installation

```sh
npm install react-native-skia-helpers
```

## Example

Currently, this library only exports `SkPathGenerator` function

```typescript
import * as React from 'react';

import { Dimensions, StyleSheet } from 'react-native';
import { Canvas, Group, Path, type SkPath } from '@shopify/react-native-skia';
import { SkPathGenerator } from 'react-native-skia-helpers';
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
```

## SkPathGenerator Documentation

The `SkPathGenerator` is a utility function that is a wrapper around `Skia.Path.Make()` and provide a simplifiy api to apply border radius to path corner much like any vector drawing software.

### Types

#### SkPathGeneratorType

The `SkPathGenerator` is a utility function that serves as a wrapper around `Skia.Path.Make()`, providing a simplified API to apply a border radius to path corners, much like any vector drawing software.

| Method | Type | Description |
|--------|------|-------------|
| `moveTo` | `(x: number, y: number) => SkPathGeneratorType` | Moves the starting point of the path to the specified coordinates. |
| `lineTo` | `(x: number, y: number) => SkPathGeneratorType` | Draws a line from the current point to the specified coordinates. |
| `rLineTo` | `(x: number, y: number) => SkPathGeneratorType` | Draws a line from the current point to a point that is offset from the current point by the specified coordinates. |
| `close` | `() => SkPath` | Closes the current path. |
| **`rRoundedCornerTo`** | `(x: number, y: number, cornerControle?: CornerControle) => RoundedCornerReturn` | Draws a line to the specified coordinates and applies a rounded corner. The corner details are specified by `cornerControle`. |
| **`roundedCornerTo`** | `(x: number, y: number, cornerControle?: CornerControle) => RoundedCornerReturn` | Similar to `rRoundedCornerTo`, but uses absolute coordinates. |
| `getSkPath` | `(cornerControle?: CornerControle) => SkPath` | Returns the underlying `SkPath` instance. |
| `rMoveTo` | `(x: number, y: number) => SkPathGeneratorType` | Moves the starting point of the path by the specified offset from the current point. |
| `cubicTo` | `(cpx1: number, cpy1: number, cpx2: number, cpy2: number, x: number, y: number) => SkPathGeneratorType` | Adds a cubic Bézier curve to the path. |
| `quadTo` | `(x1: number, y1: number, x2: number, y2: number) => SkPathGeneratorType` | Adds a quadratic Bézier curve to the path. |
| ... | ... | Additional methods, similar to those in SkPath, are available. Please refer to the type declaration for a comprehensive list of all methods. |

#### CornerControle

The `CornerControle` type specifies how corners should be rounded and can be one of the following:

- A `number`: Specifies a fixed radius for the rounded corner.
- `ControleObj`: An object that provides more detailed control over the rounding of the corner.
- `CurveContrleCb`: A callback function that returns a `ControleObj` and provides dynamic control over the rounding based on the current path.

#### ControleObj

The `ControleObj` type provides detailed control over the rounding of corners and can be one of the following forms:

- `{ r: number; curveHandlerFactor?: number; tangentLength?: undefined }`
- `{ tangentLength: number; curveHandlerFactor?: number; r?: undefined }`

#### RoundedCornerReturn

The `RoundedCornerReturn` type provides methods to continue the path after a rounded corner has been added.

| Method | Type | Description |
|--------|------|-------------|
| `rRoundedCornerTo` | `(x: number, y: number, cornerControle?: CornerControle) => RoundedCornerReturn` | Continues the path with another rounded corner, using relative coordinates. |
| `roundedCornerTo` | `(x: number, y: number, cornerControle?: CornerControle) => RoundedCornerReturn` | Continues the path with another rounded corner, using absolute coordinates. |
| `lineTo` | `(x: number, y: number) => SkPathGeneratorType` | Continues the path with a straight line to the specified coordinates. |
| `rLineTo` | `(x: number, y: number) => SkPathGeneratorType` | Continues the path with a straight line, using coordinates relative to the current point. |
| `close` | `() => SkPath` | Closes the path with a straight line. |


### Using `path` in the Path Component

In order to utilize the path within the `Path` component, it is necessary to convert it to `SkPath`. This can be achieved in two ways:

#### Method 1: Using \`.getSkPath()\`
Utilize the `.getSkPath()` method after invoking `SkPathGenerator()`.

```javascript
const path = SkPathGenerator()
...
.getSkPath();
```

#### Method 2: Using `close()`
Alternatively, you can use the `.close()` method after \`SkPathGenerator()\`.

```javascript
const path = SkPathGenerator()
...
.close();
```





## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)