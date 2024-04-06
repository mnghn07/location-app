import { createTheme } from "@shopify/restyle";
import { palette } from "./palette";

const theme = createTheme({
  colors: {
    // light
    primaryBackground: palette.offWhite,
    primaryText: palette.dark,
    primaryIconColor: palette.dark,
    primarySwitch: palette.lightGray,
    primaryUnswitch: palette.darkGray,
    // dark
    secondaryBackground: palette.dark,
    secondaryText: palette.yellow,
    secondaryIconColor: palette.yellow,
    secondarySwitch: palette.darkGray,
    secondaryUnswitch: palette.lightGray,

    subtitleText: palette.lightGray,

    editColor: palette.yellow,
    shareColor: palette.dark,
    deleteColor: palette.red,

    cardBackground: palette.white,
    cardText: palette.black,
    buttonBackground: palette.black,
    buttonText: palette.white,
    shadow: palette.darkGray,
    border: palette.gray,
    danger: palette.red,
    confirm: palette.dark
  },
  spacing: {
    none: 0,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 40
  },
  borderRadii: {
    s: 4,
    m: 10,
    l: 25,
    xl: 75
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
    largeTablet: 1024
  },
  textVariants: {
    defaults: {
      fontFamily: "MontserratRegular",
      fontSize: 14,
      color: "primaryText"
    },
    header: {
      fontFamily: "MontserratSemiBold",
      fontSize: 16
    },
    body: {
      fontSize: 16,
      lineHeight: 24
    },
    highlight: {
      fontFamily: "MontserratMedium",
      fontSize: 14
    },
    input: {
      fontFamily: "MontserratSemiBold",
      fontSize: 24
    }
  },
  buttonVariants: {
    primary: {
      backgroundColor: "buttonBackground",
      color: "buttonText",
      padding: "m",
      borderRadius: "m"
    },
    secondary: {
      backgroundColor: "secondaryBackground",
      color: "secondaryText",
      padding: "m",
      borderRadius: "m"
    }
  },
  cardVariants: {
    primary: {
      backgroundColor: "cardBackground",
      color: "cardText"
    }
  }
});

type Theme = typeof theme;
export default theme;

export { Theme };
