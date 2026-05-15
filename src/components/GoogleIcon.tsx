import React from 'react';
import Svg, { Path, ClipPath, Defs, G } from 'react-native-svg';

export default function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Defs>
        <ClipPath id="clip">
          <Path d="M0 0h48v48H0z" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip)">
        {/* Blue */}
        <Path
          d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
          fill="#FFC107"
        />
        {/* Red */}
        <Path
          d="M6.3 14.7l7 5.1C15.1 16 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 16.3 2 9.7 7.4 6.3 14.7z"
          fill="#FF3D00"
        />
        {/* Green */}
        <Path
          d="M24 46c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.5C29.6 37 26.9 38 24 38c-6.1 0-10.7-3.9-11.8-9.1l-7 5.4C8.6 41.8 15.7 46 24 46z"
          fill="#4CAF50"
        />
        {/* Blue */}
        <Path
          d="M44.5 20H24v8.5h11.8c-.9 2.8-2.8 5.1-5.3 6.6l6.6 5.5C41.5 37.3 45 31.2 45 24c0-1.3-.2-2.7-.5-4z"
          fill="#1976D2"
        />
      </G>
    </Svg>
  );
}
