import * as React from "react";
import Svg, { Path } from "react-native-svg";

type SvgProps = React.ComponentProps<typeof Svg> & { size?: number };

function GoogleIcon(props: SvgProps) {
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox="0 0 17 17"
      fill="none"
      {...props}
    >
      <Path
        d="M15.037 7.194H14.5v-.027h-6v2.666h3.767A3.998 3.998 0 014.5 8.5a4 4 0 014-4c1.02 0 1.947.385 2.653 1.013l1.886-1.886a6.636 6.636 0 00-4.54-1.794 6.667 6.667 0 106.538 5.361z"
        fill="#FFC107"
      />
      <Path
        d="M2.602 5.397l2.19 1.606A3.998 3.998 0 018.5 4.5c1.02 0 1.947.385 2.653 1.013l1.886-1.886a6.636 6.636 0 00-4.54-1.794 6.663 6.663 0 00-5.897 3.564z"
        fill="#FF3D00"
      />
      <Path
        d="M8.5 15.167a6.635 6.635 0 004.47-1.731l-2.063-1.746a3.97 3.97 0 01-2.407.81 3.998 3.998 0 01-3.76-2.649l-2.175 1.675a6.661 6.661 0 005.935 3.64z"
        fill="#4CAF50"
      />
      <Path
        d="M15.037 7.194H14.5v-.027h-6v2.666h3.768a4.014 4.014 0 01-1.363 1.857h.001l2.064 1.746c-.146.132 2.197-1.603 2.197-4.936a6.71 6.71 0 00-.13-1.306z"
        fill="#1976D2"
      />
    </Svg>
  )
}

export default GoogleIcon 