import React from "react";
import Box from "./atoms/Box";
import Text from "./atoms/Text";
import { HEADER_HEIGHT, getStatusBarHeight } from "@/utils/constants";
import { useAppStore } from "@/stores/client";

interface Props {
  title: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  noStatusBar?: boolean;
}

const Header: React.FC<Props> = props => {
  const { mode } = useAppStore();
  const { title, headerLeft, headerRight, noStatusBar } = props;
  const bgColor =
    mode === "light" ? "primaryBackground" : "secondaryBackground";
  const textColor = mode === "light" ? "primaryText" : "secondaryText";
  return (
    <>
      {!noStatusBar && (
        <Box
          width={"100%"}
          backgroundColor={bgColor}
          height={getStatusBarHeight()}
        />
      )}
      <Box
        // width={"100%"}
        height={HEADER_HEIGHT}
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        shadowColor={"shadow"}
        backgroundColor={bgColor}
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.2}
        shadowRadius={2}
        paddingHorizontal={"m"}
      >
        {!!headerLeft ? headerLeft : <Box width={24} height={24} />}
        <Box flex={1} alignItems={"center"}>
          <Text variant={"header"} color={textColor}>
            {title}
          </Text>
        </Box>
        {!!headerRight ? headerRight : <Box width={24} height={24} />}
      </Box>
    </>
  );
};

export default Header;
