import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from '@ui-kitten/components';

import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import {FeedNavigator, AddPostNavigator, FindFriendsNavigator} from './StackNavigator';

import registerScreen from '../screens/RegisterScreen';

const Tab = createBottomTabNavigator();

export default function BottomNavigation(props) {
    return (
        <Tab.Navigator
            initialRouteName="FeedScreen"
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarHideOnKeyboard: true,
            }}>
            <Tab.Screen
                name="Feed"
                component={FeedNavigator}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Icon
                            name="home-outline"
                            width={32}
                            height={32}
                            fill={focused ? '#111' : '#939393'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={FindFriendsNavigator}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Icon
                            name="search-outline"
                            width={32}
                            height={32}
                            fill={focused ? '#111' : '#939393'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="AddPost"
                component={AddPostNavigator}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Icon
                            name="plus-square-outline"
                            width={32}
                            height={32}
                            fill={focused ? '#111' : '#939393'}
                        />
                    ),
                }}
                tabBarOptions={{showLabel: false}}
            />
            <Tab.Screen
                name="Activity"
                component={AddPostNavigator}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Icon
                            name="heart-outline"
                            width={32}
                            height={32}
                            fill={focused ? '#111' : '#939393'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({focused}) => (
                        <Icon
                            name="person-outline"
                            width={32}
                            height={32}
                            fill={focused ? '#111' : '#939393'}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
