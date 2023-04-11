import {
    DarkTheme as ReactNavigationDarkTheme,
    DefaultTheme as ReactNavigationLightTheme,
} from "@react-navigation/native";
import {
    MD3Theme,
    useTheme,
    MD3DarkTheme,
    MD3LightTheme,
    adaptNavigationTheme,
} from "react-native-paper";
import { MD3Typescale } from "react-native-paper/lib/typescript/src/types";

/*
Thin 100
ExtraLight 200
Light 300
Regular 400
Medium 500
SemiBold 600
Bold 700
ExtraBold 800
Black 900
 */

export const FF_REGULAR = "Montserrat-Regular";
export const FF_MEDIUM = "Montserrat-Medium";
export const FF_SEMI_BOLD = "Montserrat-SemiBold";
export const FF_BOLD = "Montserrat-Bold";

const PRIMARY_COLOR = "#1DA1F2";

const appFonts: MD3Typescale = {
    displaySmall: {
        fontFamily: FF_REGULAR,
        fontSize: 36,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 44,
    },
    displayMedium: {
        fontFamily: FF_REGULAR,
        fontSize: 45,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 52,
    },
    displayLarge: {
        fontFamily: FF_REGULAR,
        fontSize: 57,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 64,
    },
    headlineSmall: {
        fontFamily: FF_REGULAR,
        fontSize: 25,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 32,
    },
    headlineMedium: {
        fontFamily: FF_REGULAR,
        fontSize: 28,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 36,
    },
    headlineLarge: {
        fontFamily: FF_REGULAR,
        fontSize: 32,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 40,
    },
    titleSmall: {
        fontFamily: FF_MEDIUM,
        fontSize: 14,
        fontWeight: "500",
        letterSpacing: 0.1,
        lineHeight: 20,
    },
    titleMedium: {
        fontFamily: FF_MEDIUM,
        fontSize: 18,
        fontWeight: "500",
        letterSpacing: 0.15,
        lineHeight: 24,
    },
    titleLarge: {
        fontFamily: FF_REGULAR,
        fontSize: 22,
        fontWeight: "400",
        letterSpacing: 0,
        lineHeight: 28,
    },
    labelSmall: {
        fontFamily: FF_MEDIUM,
        fontSize: 11,
        fontWeight: "500",
        letterSpacing: 0.5,
        lineHeight: 16,
    },
    labelMedium: {
        fontFamily: FF_MEDIUM,
        fontSize: 12,
        fontWeight: "500",
        letterSpacing: 0.5,
        lineHeight: 16,
    },
    labelLarge: {
        fontFamily: FF_MEDIUM,
        fontSize: 14,
        fontWeight: "500",
        letterSpacing: 0.1,
        lineHeight: 20,
    },
    bodySmall: {
        fontFamily: FF_REGULAR,
        fontSize: 12,
        fontWeight: "400",
        letterSpacing: 0.4,
        lineHeight: 16,
    },
    bodyMedium: {
        fontFamily: FF_REGULAR,
        fontSize: 14,
        fontWeight: "400",
        letterSpacing: 0.25,
        lineHeight: 20,
    },
    bodyLarge: {
        fontFamily: FF_REGULAR,
        fontSize: 16,
        fontWeight: "400",
        letterSpacing: 0.15,
        lineHeight: 24,
    },
    default: {
        fontFamily: FF_REGULAR,
        fontWeight: "400",
        letterSpacing: 0,
    },
};

export const appLightTheme: MD3Theme & {
    colors: {
        white: string;
    };
} = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: "#1F5DA0",
        white: "#FFFFFF",
        secondary: "#14171A",
        background: "#FFFFFF",
        surfaceVariant: "#FFFFFF",
        surface: "#FFFFFF"
    },
    fonts: appFonts,
};

export type AppTheme = typeof appLightTheme;

export const appDarkTheme: AppTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: PRIMARY_COLOR,
        white: "#000000",
        secondary: "#14171A",
    },
    fonts: appFonts,
};

export const useAppTheme = () => useTheme<AppTheme>();



const { LightTheme: NavigationLightTheme, DarkTheme: NavigationDarkTheme } = adaptNavigationTheme({
    reactNavigationLight: ReactNavigationLightTheme,
    reactNavigationDark: ReactNavigationDarkTheme,
});

export const CombinedDefaultTheme = {
    ...NavigationLightTheme,
    ...appLightTheme,
    colors: {
        ...NavigationLightTheme.colors,
        ...appLightTheme.colors,
        primary: PRIMARY_COLOR,
        card: "#FFFFFF",
        text: appDarkTheme.colors.secondary
    },
};

export const CombinedDarkTheme = {
    ...NavigationDarkTheme,
    ...appDarkTheme,
    colors: {
        ...NavigationDarkTheme.colors,
        ...appDarkTheme.colors,
    },
};