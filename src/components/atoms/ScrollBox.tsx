import React from "react";
import { ScrollView, ScrollViewProps } from "react-native";
import { useRestyle, spacing, SpacingProps } from "@shopify/restyle";
import { Theme } from "@/themes";

// Define your custom restyle props
type RestyleScrollViewProps = SpacingProps<Theme> & ScrollViewProps;

const ScrollBox: React.FC<RestyleScrollViewProps> = ({ children, ...rest }) => {
  // Use the restyle hook to apply the spacing props
  const props = useRestyle([spacing], rest);

  return <ScrollView {...props}>{children}</ScrollView>;
};

export default ScrollBox;
