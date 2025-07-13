import * as React from "react";
import Svg, { Path } from "react-native-svg";

type SvgProps = React.ComponentProps<typeof Svg> & { size?: number };

function UserID(props: SvgProps) {
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox="0 0 27 27"
      fill="none"
      {...props}
    >
      <Path
        d="M20 22c0-3.72-2.91-6.737-6.5-6.737S7 18.28 7 22M1 1h25v25H1V1zm12.5 13.421c2.244 0 4.063-1.885 4.063-4.21C17.563 7.884 15.742 6 13.5 6c-2.244 0-4.063 1.885-4.063 4.21 0 2.326 1.82 4.211 4.063 4.211z"
        stroke="#111"
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export default UserID 