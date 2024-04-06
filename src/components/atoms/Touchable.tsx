import {
  Pressable as NativePressable,
  PressableProps as NativePressableProps,
  Platform
} from "react-native";
import React from "react";
import { Theme } from "@/themes";
import {
  backgroundColor,
  BackgroundColorProps,
  backgroundColorShorthand,
  BackgroundColorShorthandProps,
  border,
  BorderProps,
  composeRestyleFunctions,
  createBox,
  opacity,
  OpacityProps,
  ResponsiveValue,
  useRestyle,
  useResponsiveProp,
  useTheme
} from "@shopify/restyle";

export const Pressable = createBox<Theme, NativePressableProps>(
  NativePressable
);
export type PressableProps = React.ComponentProps<typeof Pressable>;

type RestyleProps = BackgroundColorProps<Theme> &
  BackgroundColorShorthandProps<Theme> &
  BorderProps<Theme> &
  OpacityProps<Theme>;

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  backgroundColor,
  backgroundColorShorthand,
  border,
  opacity
]);

interface Props extends PressableProps {
  pressed?: RestyleProps;
  rippleColor?: ResponsiveValue<keyof Theme["colors"], Theme>;
  rippleBorderless?: boolean;
  activeOpacity?: number;
}

const Touchable: React.FC<Props> = ({
  pressed,
  rippleColor,
  rippleBorderless,
  style,
  ...rest
}) => {
  const { style: pressedStyle } = pressed
    ? useRestyle(restyleFunctions, pressed)
    : {
        style: undefined
      };
  const theme = useTheme<Theme>();
  const rippleColorProp = rippleColor && useResponsiveProp(rippleColor);
  const rippleColorValue = rippleColorProp && theme.colors[rippleColorProp];

  return (
    <Pressable
      {...rest}
      android_ripple={{ color: rippleColorValue, borderless: rippleBorderless }}
      // @ts-ignore
      style={({ pressed: isPressed }) =>
        isPressed ? [pressedStyle, style] : style
      }
    />
  );
};

export const TouchableOpacity: React.FC<Props> = props => {
  return (
    <Touchable
      // rippleColor={Platform.select({ ios: "white50", android: "transparent" })}
      {...props}
      pressed={{
        opacity:
          props.activeOpacity ||
          Platform.select({ ios: 0.7, android: 0.6, default: 0.7 })
      }}
    />
  );
};

export default Touchable;
