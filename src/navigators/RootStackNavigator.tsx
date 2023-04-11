import React from 'react'
import { FF_BOLD } from '@src/theme';
import { useAppSelector } from '@hooks/store';
import UsersScreen from '@src/screens/UsersScreen'
import LoginScreen from '@src/screens/LoginScreen';
import { RootStackParamList } from '@src/navigation';
import MyTweetsScreen from '@src/screens/MyTweetsScreen'
import MainDrawerNavigator from './HomeDrawerNavigator';
import FollowersScreen from '@src/screens/FollowersScreen'
import RegisterScreen from '@src/screens/RegisterScreen';
import FollowingsScreen from '@src/screens/FollowingsScreen'
import { RootStackRoutes } from '@src/constants/navigation';
import MakeTweetScreen from '@src/screens/MakeTweetScreen';
import { selectIsAuthenticated } from '@store/slices/auth';
import { createStackNavigator } from '@react-navigation/stack'

const RootStack = createStackNavigator<RootStackParamList>();


function RootStackNavigator() {
    const isAuthenticated = useAppSelector(selectIsAuthenticated)

    return (
        <RootStack.Navigator initialRouteName={RootStackRoutes.LOGIN} screenOptions={{
            headerTitleStyle: {
                fontFamily: FF_BOLD
            }
        }}>
            {!isAuthenticated ? <RootStack.Group
                screenOptions={{
                    headerShown: false
                }}>
                <RootStack.Screen name={RootStackRoutes.LOGIN} component={LoginScreen} />
                <RootStack.Screen name={RootStackRoutes.REGISTER} component={RegisterScreen} />
            </RootStack.Group> :
                <RootStack.Group>

                    <RootStack.Screen
                        options={{
                            headerShown: false
                        }}
                        component={MainDrawerNavigator}
                        name={RootStackRoutes.MAIN_DRAWER}
                    />

                    <RootStack.Screen options={{
                        title: "Tweets"
                    }}
                        name={RootStackRoutes.MY_TWEETS}
                        component={MyTweetsScreen}
                    />
                    <RootStack.Screen options={{
                        title: "Followers"
                    }}
                        name={RootStackRoutes.FOLLOWERS}
                        component={FollowersScreen}
                    />
                    <RootStack.Screen options={{
                        title: "Followings"
                    }}
                        name={RootStackRoutes.FOLLOWINGS}
                        component={FollowingsScreen}
                    />
                    <RootStack.Screen options={{
                        title: "Users"
                    }}
                        name={RootStackRoutes.USERS}
                        component={UsersScreen}
                    />
                    <RootStack.Screen options={{
                        headerShown: false
                    }}
                        component={MakeTweetScreen}
                        name={RootStackRoutes.MAKE_TWEET}
                    />
                </RootStack.Group>
            }

        </RootStack.Navigator>
    )
}

export default RootStackNavigator