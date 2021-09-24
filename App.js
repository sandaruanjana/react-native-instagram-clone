import React, {useEffect, useState} from 'react';
import {mapping, light as lightTheme, dark} from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {
    ApplicationProvider,
    Layout,
    Text,
    IconRegistry,
} from '@ui-kitten/components';
import {ToastProvider} from 'react-native-styled-toast';
import {NavigationContainer} from '@react-navigation/native';
import BottomNavigation from './src/navigation/TabNavigator';
import LoginScreen from './src/screens/LoginScreen';

import {ThemeProvider} from 'styled-components';
import theme from './src/components/toast';
import auth from '@react-native-firebase/auth';
import {createStackNavigator} from '@react-navigation/stack';
import RegisterScreen from './src/screens/RegisterScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

function App() {

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) {
            setInitializing(false);
        }
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) {
        return null;
    }

    const Stack = createStackNavigator();

    if (!user) {
        return (
            <>
                <IconRegistry icons={EvaIconsPack}/>
                <ApplicationProvider mapping={mapping} theme={lightTheme}>
                    <ThemeProvider theme={theme}>
                        <ToastProvider position="BOTTOM" maxToasts={2}>
                            <NavigationContainer>
                                <Stack.Navigator  initialRouteName="LoginScreen">
                                    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{
                                        headerShown:false,
                                        animationEnabled:true,
                                    }} />
                                    <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{
                                        headerShown:false,
                                        animationEnabled:true,
                                    }} />
                                    <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{
                                        headerShown:true,
                                        title:'',
                                        animationEnabled:true,
                                    }} />
                                </Stack.Navigator>
                            </NavigationContainer>
                        </ToastProvider>
                    </ThemeProvider>
                </ApplicationProvider>
            </>
        );
    }

    return (
        <>
            <IconRegistry icons={EvaIconsPack}/>
            <ApplicationProvider mapping={mapping} theme={lightTheme}>
                <ThemeProvider theme={theme}>
                    <ToastProvider position="BOTTOM" maxToasts={2}>
                        <NavigationContainer>
                            <BottomNavigation/>
                        </NavigationContainer>
                    </ToastProvider>
                </ThemeProvider>
            </ApplicationProvider>
        </>
    );
}

export default App;
