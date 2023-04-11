import React from 'react'
import { IconButton } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MainTabRoutes } from '@src/constants/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { DrawerScreenProps } from '@react-navigation/drawer';
import SearchUserScreen from '@src/screens/SearchUserScreen';
import MyTimelineScreen from '@src/screens/MyTimelineScreen';
import { CombinedDefaultTheme, useAppTheme } from '@src/theme';
import { CompositeScreenProps } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MainDrawerParamList, MainTabParamList, RootStackParamList } from '@src/navigation';

const MainTab = createBottomTabNavigator<MainTabParamList>();

type Props = CompositeScreenProps<
    DrawerScreenProps<MainDrawerParamList>,
    StackScreenProps<RootStackParamList>
>;

function MainTabNavigator(props: Props) {
    const theme = useAppTheme();

    return (
        <MainTab.Navigator screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
                borderTopWidth: 0
            },
            headerTitleAlign: "center",
            headerLeft() {
                return <IconButton
                    size={25}
                    icon="menu"
                    onPress={props.navigation.openDrawer}
                    iconColor={CombinedDefaultTheme.colors.secondary}

                />
            },
        }}>
            <MainTab.Screen options={{
                headerTitle() {
                    return <Ionicons name={"logo-twitter"} color={theme.colors.primary} size={30} />
                },
                tabBarIcon(props) {
                    return <Ionicons name={props.focused ? "home" : "home-outline"} color={CombinedDefaultTheme.colors.secondary} size={props.size} />
                },
            }} name={MainTabRoutes.MY_TIMELINE} component={MyTimelineScreen} />

            <MainTab.Screen options={{
                title: "Search User",
                tabBarIcon(props) {
                    return <Ionicons name={props.focused ? "search-sharp" : "search-outline"} color={CombinedDefaultTheme.colors.secondary} size={props.size} />
                },
            }} name={MainTabRoutes.SEARCH_USER} component={SearchUserScreen} />
        </MainTab.Navigator>
    )
}

export default MainTabNavigator