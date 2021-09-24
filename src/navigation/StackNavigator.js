import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import FeedScreen from '../screens/FeedScreen';
import logoBlack from '../assets/images/logo_black.png';
import Icon from 'react-native-vector-icons/Feather';
import WelcomeScreen from '../screens/WelcomeScreen';
import AddPost from '../screens/AddPost';
import FindFriendsScreen from '../screens/FindFriendsScreen';


const Stack = createStackNavigator();

export function FeedNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="FeedScreen"
                component={FeedScreen}
                options={{
                    headerTitle: (props) => (
                        <Image
                            style={{width: 140, height: 50}}
                            source={logoBlack}
                            resizeMode="contain"
                        />
                    ),
                    headerTitleStyle: {flex: 1, textAlign: 'center'},
                    headerRight: () => <View style={styles.iconContainer}>
                        <Icon
                            name="heart"
                            size={30}
                            color={'#939393'}
                        />
                        <Icon
                            name="send"
                            size={30}
                            color={'#939393'}
                        />
                    </View>,
                }}
            />
        </Stack.Navigator>
    );
}


export function AddPostNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="AddPostScreen" component={AddPost} options={{
                headerShown: true,
                title: 'New Post',
                animationEnabled: true,
            }}/>
        </Stack.Navigator>
    );
}

export function FindFriendsNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="FindFriendsScreen" component={FindFriendsScreen} options={{
                headerShown: true,
                title: 'Find Friends',
                animationEnabled: true,
            }}/>
        </Stack.Navigator>
    );
}




const styles = StyleSheet.create({
    icon: {
        paddingLeft: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: 120,
    },
});
