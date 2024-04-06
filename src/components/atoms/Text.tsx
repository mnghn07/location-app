import React from "react";
import { createText, useTheme } from "@shopify/restyle";
import { Theme } from "@/themes";
import { useAppStore } from "@/stores/client";

const ThemedText = createText<Theme>();

const Text: React.FC<React.ComponentProps<typeof ThemedText>> = props => {
  const { mode } = useAppStore();
  return (
    <ThemedText
      color={mode === "dark" ? "secondaryText" : "primaryText"}
      {...props}
    />
  );
};
export default Text;
