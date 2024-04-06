import { View, Text } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAppStore } from "@/stores/client";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/themes";

interface Props {
  name: string;
  size?: number;
}

const Icon: React.FC<Props> = props => {
  const theme = useTheme<Theme>();
  const { mode } = useAppStore();
  const { name, size = 24 } = props;
  const color =
    mode === "dark"
      ? theme.colors.secondaryIconColor
      : theme.colors.primaryIconColor;
  // @ts-ignore
  return <Ionicons name={name} size={size} color={color} />;
};

export default Icon;
