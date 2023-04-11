import React from 'react'
import { View } from 'react-native';
import MainTabNavigator from './MainTabNavigator'
import Feather from "react-native-vector-icons/Feather"
import AntDesign from "react-native-vector-icons/AntDesign"
import { StackScreenProps } from '@react-navigation/stack';
import { AppTheme, FF_BOLD, useAppTheme } from '@src/theme';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import { MainDrawerParamList, RootStackParamList } from '@src/navigation'
import { HomeDrawerRoutes, RootStackRoutes } from '@src/constants/navigation'
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, createDrawerNavigator } from '@react-navigation/drawer'

const MainDrawer = createDrawerNavigator<MainDrawerParamList>()

type Props = StackScreenProps<RootStackParamList>;
// type Drawer

const MainDrawerNavigator = ({ navigation }: Props) => {
    const appTheme = useAppTheme();

    return (
        <MainDrawer.Navigator
            initialRouteName={HomeDrawerRoutes.MAIN_TAB}
            screenOptions={{
                headerShown: false
            }}
            drawerContent={props => (
                <CustomDrawerContent
                    {...props}
                    appTheme={appTheme}
                    stackNavigation={navigation}
                    drawerNavigation={props.navigation}
                />
            )}
        >
            <MainDrawer.Screen name={HomeDrawerRoutes.MAIN_TAB} component={MainTabNavigator} />

        </MainDrawer.Navigator>
    )
}

export default MainDrawerNavigator

function CustomDrawerContent({
    appTheme,
    ...props
}: Omit<DrawerContentComponentProps, "navigation"> & {
    appTheme: AppTheme;
    stackNavigation: Props["navigation"];
    drawerNavigation: DrawerContentComponentProps["navigation"];
}) {
    return (
        <View style={{ height: "100%" }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ paddingTop: 0 }}>
                <DrawerItem
                    label={"Following"}
                    style={{
                        width: "100%",
                        borderRadius: 0,
                    }}
                    labelStyle={{
                        fontSize: 20,
                        fontFamily: FF_BOLD,
                        color: appTheme.colors.secondary
                    }}
                    icon={(props) => <SimpleLineIcons {...props} color={appTheme.colors.secondary} name={"user-following"} />}
                    onPress={() => {
                        props.drawerNavigation.closeDrawer();
                        props.stackNavigation.navigate(RootStackRoutes.FOLLOWINGS);
                    }}
                />

                <DrawerItem
                    label={"Followers"}
                    style={{
                        width: "100%",
                        borderRadius: 0,
                    }}
                    labelStyle={{
                        fontSize: 20,
                        fontFamily: FF_BOLD,
                        color: appTheme.colors.secondary
                    }}
                    icon={(props) => <MaterialIcons {...props} color={appTheme.colors.secondary} name={"groups"} />}
                    onPress={() => {
                        props.drawerNavigation.closeDrawer();
                        props.stackNavigation.navigate(RootStackRoutes.FOLLOWERS);
                    }}
                />

                <DrawerItem
                    label={"Tweets"}
                    style={{
                        width: "100%",
                        borderRadius: 0,
                    }}
                    labelStyle={{
                        fontSize: 20,
                        fontFamily: FF_BOLD,
                        color: appTheme.colors.secondary
                    }}
                    icon={(props) => <AntDesign {...props} color={appTheme.colors.secondary} name={"retweet"} />}
                    onPress={() => {
                        props.drawerNavigation.closeDrawer();
                        props.stackNavigation.navigate(RootStackRoutes.MY_TWEETS);
                    }}
                />

                <DrawerItem
                    label={"Users"}
                    style={{
                        width: "100%",
                        borderRadius: 0,
                    }}
                    labelStyle={{
                        fontSize: 20,
                        fontFamily: FF_BOLD,
                        color: appTheme.colors.secondary
                    }}
                    icon={(props) => <Feather {...props} color={appTheme.colors.secondary} name={"users"} />}
                    onPress={() => {
                        props.drawerNavigation.closeDrawer();
                        props.stackNavigation.navigate(RootStackRoutes.USERS);
                    }}
                />
            </DrawerContentScrollView>
        </View>
    );
}