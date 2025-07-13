import * as React from "react"
import Svg, { Path } from "react-native-svg"

type SvgProps = React.ComponentProps<typeof Svg> & { size?: number };

function Password_icon(props: SvgProps) {
  return (
    <Svg
      width={props.size}
      height={props.size}
      viewBox="0 0 25 25"
      fill="none"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0h25v25H0V0z"
        fill="#D8D8D8"
        fillOpacity={0.01}
      />
      <Path
        clipRule="evenodd"
        d="M13 5v0c-2.45 0-4.375 1.9-4.375 4.318v2.591h8.75V9.32C17.375 6.9 15.45 5 13 5v0zM6 12.91a1 1 0 011-1h12a1 1 0 011 1V20a1 1 0 01-1 1H7a1 1 0 01-1-1v-7.09z"
        stroke="#090F47"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default Password_icon 