import * as React from "react";
import Svg, { Path } from "react-native-svg";

type SvgProps = React.ComponentProps<typeof Svg> & { size?: number };

function Back_icon(props: SvgProps) {
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M15.375 5.25L8.625 12l6.75 6.75"
        stroke="#111"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default Back_icon 