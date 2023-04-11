import { NavigatorScreenParams } from "@react-navigation/native"
import { HomeDrawerRoutes, MainTabRoutes, RootStackRoutes } from "./constants/navigation"

export type RootStackParamList = {
    [RootStackRoutes.LOGIN]: undefined
    [RootStackRoutes.REGISTER]: undefined
    [RootStackRoutes.MAKE_TWEET]: undefined
    [RootStackRoutes.MAIN_DRAWER]: NavigatorScreenParams<MainDrawerParamList>

    [RootStackRoutes.USERS]: undefined
    [RootStackRoutes.FOLLOWERS]: undefined
    [RootStackRoutes.FOLLOWINGS]: undefined
    [RootStackRoutes.MY_TWEETS]: undefined
}

export type MainDrawerParamList = {
    [HomeDrawerRoutes.MAIN_TAB]: NavigatorScreenParams<MainTabParamList>
}

export type MainTabParamList = {
    [MainTabRoutes.MY_TIMELINE]: undefined
    [MainTabRoutes.SEARCH_USER]: undefined
}

