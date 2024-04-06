import { View, SafeAreaView } from "react-native";
import React from "react";
import { Box, ScrollBox } from "@/components";
import { useTheme } from "@shopify/restyle";
import { Theme } from "@/themes";
import { useAppStore } from "@/stores/client";

interface ContainerProps {
  isSafe?: boolean;
  scrollEnabled?: boolean;
  children?: React.ReactNode;
}

const Container: React.FC<ContainerProps> = props => {
  const { isSafe, scrollEnabled, children, ...rest } = props;
  const ContainerComponent = isSafe ? SafeAreaView : View;
  const theme = useTheme<Theme>();
  const { mode } = useAppStore();
  return (
    <ContainerComponent
      style={[
        { flex: 1 },
        {
          backgroundColor:
            mode === "dark"
              ? theme.colors.secondaryBackground
              : theme.colors.primaryBackground
        }
      ]}
    >
      {children}
    </ContainerComponent>
  );
};

export default Container;
