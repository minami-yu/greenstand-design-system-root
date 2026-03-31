/**
 * elevation-light.ts
 * Do not edit directly, this file was auto-generated.
 */

export type ReactNativeElevationLayer = {
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
};

export type ReactNativeElevationStyle = {
  layers: ReactNativeElevationLayer[];
};

export const elevationLight = {
  sm: {
    layers: [
      {
        color: "rgba(0, 0, 0, 0.08)",
        offsetX: 0,
        offsetY: 1,
        blur: 8,
        spread: 0
      },
      {
        color: "rgba(0, 0, 0, 0.15)",
        offsetX: 0,
        offsetY: 2,
        blur: 1,
        spread: 0
      },
      {
        color: "rgba(0, 0, 0, 0.1)",
        offsetX: 0,
        offsetY: 1,
        blur: 4,
        spread: 0
      }
    ]
  },
  md: {
    layers: [
      {
        color: "rgba(0, 0, 0, 0.08)",
        offsetX: 0,
        offsetY: 1,
        blur: 8,
        spread: 0
      },
      {
        color: "rgba(0, 0, 0, 0.1)",
        offsetX: 0,
        offsetY: 2,
        blur: 4,
        spread: 0
      },
      {
        color: "rgba(0, 0, 0, 0.1)",
        offsetX: 0,
        offsetY: 2,
        blur: 6,
        spread: 0
      }
    ]
  },
  lg: {
    layers: [
      {
        color: "rgba(0, 0, 0, 0.08)",
        offsetX: 0,
        offsetY: 2,
        blur: 6,
        spread: 0
      },
      {
        color: "rgba(0, 0, 0, 0.1)",
        offsetX: 0,
        offsetY: 8,
        blur: 16,
        spread: 0
      },
      {
        color: "rgba(0, 0, 0, 0.1)",
        offsetX: 0,
        offsetY: 4,
        blur: 12,
        spread: 0
      }
    ]
  }
} as const satisfies Record<string, ReactNativeElevationStyle>;

export default elevationLight;
