import Svg, { Path } from 'react-native-svg';

const VIEWBOX = 160;

export type GreenstandLoginMarkProps = {
  size?: number;
};

/**
 * Greenstand login hero mark (160×160 artboard) as inline SVG.
 */
export function GreenstandLoginMark({ size = VIEWBOX }: GreenstandLoginMarkProps) {
  return (
    <Svg
      accessibilityLabel="Greenstand"
      height={size}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      width={size}
    >
      <Path
        d="M96.35 31.3996C83 42.2996 79.35 59.1496 85.55 67.5996C92.95 77.6496 108.4 82.3996 123.05 67.6996C133.75 56.9996 132.85 35.6996 140.1 28.3996C148.85 19.5496 110.25 20.0496 96.35 31.3996Z"
        fill="#86C232"
      />
      <Path
        d="M68.3001 50.2002C78.9001 59.7002 81.2501 73.7502 75.8001 80.4502C69.3501 88.4502 56.4001 91.7502 44.8501 79.1002C36.4501 69.9002 38.0001 52.3002 32.3001 46.0502C25.4001 38.4502 57.2501 40.3002 68.3001 50.1502V50.2002Z"
        fill="#86C232"
      />
      <Path
        d="M80.5499 136.5C114.156 136.5 141.4 131.732 141.4 125.85C141.4 119.968 114.156 115.2 80.5499 115.2C46.9434 115.2 19.7 119.968 19.7 125.85C19.7 131.732 46.9434 136.5 80.5499 136.5Z"
        fill="#61892F"
      />
      <Path
        d="M96.35 31.4001C83 42.3001 79.35 59.1501 85.55 67.6001C92.95 77.6501 108.4 82.4001 123.05 67.7001C133.75 57.0001 132.85 35.7001 140.1 28.4001C147.15 21.3001 123.7 20.2501 106.95 25.9001"
        fill="none"
        stroke="#231F20"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={1}
      />
      <Path
        d="M68.3 50.1998C78.9 59.6998 81.25 73.7498 75.8 80.4498C69.35 88.4498 56.4 91.7498 44.85 79.0998C36.45 69.8998 38 52.2998 32.3 46.0498C27.4 40.6498 42.1 39.9998 55 43.6498"
        fill="none"
        stroke="#231F20"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={1}
      />
      <Path
        d="M36.5 133.15C26.1 131.25 19.75 128.65 19.75 125.8C19.75 119.9 47 115.15 80.6 115.15C114.2 115.15 141.45 119.9 141.45 125.8C141.45 131.7 114.2 136.45 80.6 136.45C68.65 136.45 57.5 135.85 48.1 134.8"
        fill="none"
        stroke="#231F20"
        strokeLinecap="round"
        strokeMiterlimit={10}
        strokeWidth={1}
      />
      <Path
        d="M79.6001 89.5996V123.7"
        fill="none"
        stroke="#231F20"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.8}
      />
      <Path
        d="M112.05 48.3496C107.5 50.2996 100.2 54.1996 93.4999 61.5996C83.6499 72.4496 80.4999 84.3996 79.6499 89.5996"
        fill="none"
        stroke="#231F20"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.8}
      />
      <Path
        d="M55 57.1992C58.35 59.1992 62.25 61.9992 66.1 65.9992C74.8 75.0492 78.2 85.0492 79.6 90.6492"
        fill="none"
        stroke="#231F20"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.8}
      />
    </Svg>
  );
}
