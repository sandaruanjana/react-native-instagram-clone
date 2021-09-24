import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image, Alert,
} from 'react-native';
import React from 'react';
import {Input, Layout, Spinner} from '@ui-kitten/components';
import loginLogo from '../assets/images/logo_login.png';
import {useToast} from 'react-native-styled-toast';

import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


export default function RegisterScreen(props) {

    const {toast} = useToast();

    const [emailValue, setEmailValue] = React.useState('');
    const [passwordValue, setPasswordValue] = React.useState('');
    const [fullNameValue, setFullNameValue] = React.useState('');

    const usersCollection = firestore().collection('users');


    return (
        <Layout style={Styles.container}>
            <View>
                <View style={Styles.logoContainer}>
                    {<Image
                        source={loginLogo}
                        style={{height: 70, resizeMode: 'contain'}}
                    />}
                </View>
                <View style={Styles.userNameContainer}>
                    <Input
                        placeholder="Email"
                        value={emailValue}
                        onChangeText={nextValue => setEmailValue(nextValue)}
                    />
                </View>
                <View style={Styles.passwordContainer}>
                    <Input
                        placeholder="Full Name"
                        value={fullNameValue}
                        onChangeText={nextValue => setFullNameValue(nextValue)}
                    />
                </View>
                <View style={Styles.passwordContainer}>
                    <Input
                        placeholder="Password"
                        value={passwordValue}
                        onChangeText={nextValue => setPasswordValue(nextValue)}
                    />
                </View>
                <TouchableOpacity
                    style={Styles.loginContainer}
                    onPress={() => {

                        if (emailValue === '' || emailValue === null || passwordValue === '' || passwordValue === null || fullNameValue === '' || fullNameValue === null) {
                            toast({
                                intent: 'WARN',
                                message: 'email or password field empty check again!',
                            });
                        } else {
                            auth()
                                .createUserWithEmailAndPassword(emailValue, passwordValue)
                                .then((u) => {
                                    console.log('User account created & signed in!');

                                    usersCollection
                                        .add({
                                            id: u.user.uid,
                                            email: u.user.email,
                                            full_name: fullNameValue,
                                            bio:'',
                                            profile_image:'https://picsum.photos/1920/1080',
                                            followers: [],
                                            following: [],
                                            createdOn: firebase.firestore.Timestamp.now(),
                                        })
                                        .then(() => {
                                            console.log('User added!');
                                        });

                                })
                                .catch(error => {
                                    if (error.code === 'auth/email-already-in-use') {
                                        toast({
                                            intent: 'INFO',
                                            message: 'That email address is already in use!',
                                        });
                                    } else if (error.code === 'auth/invalid-email') {
                                        toast({
                                            intent: 'INFO',
                                            message: 'That email address is invalid!',
                                        });
                                    } else {
                                        toast({
                                            intent: 'INFO',
                                            message: error.code,
                                        });
                                    }
                                });
                        }


                    }}>
                    <Text style={Styles.loginText}>Create a Account</Text>
                </TouchableOpacity>
            </View>

            <View
                style={{
                    marginTop: 40,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <TouchableOpacity onPress={() => {
                    props.navigation.navigate('LoginScreen');
                }}>
                    <Text style={Styles.forgotPasswordText}>Have an account? Log in</Text>
                </TouchableOpacity>
            </View>

        </Layout>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    logoContainer: {
        alignItems: 'center',
    },
    userNameContainer: {
        borderColor: '#ececec',
        backgroundColor: '#fafafa',
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        justifyContent: 'center',
        //alignItems: 'center',
        marginStart: 20,
        marginEnd: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    passwordContainer: {
        borderColor: '#ececec',
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        justifyContent: 'center',
        //alignItems: 'center',
        marginStart: 20,
        marginEnd: 20,
        backgroundColor: '#fafafa',
        marginBottom: 20,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginEnd: 20,
    },
    forgotPasswordText: {
        color: '#0088f8',
    },
    loginContainer: {
        alignItems: 'center',
        height: 40,
        marginTop: 30,
        backgroundColor: '#0088f8',
        justifyContent: 'center',
        marginStart: 20,
        marginEnd: 20,
        borderRadius: 5,
    },
    loginText: {
        color: '#fff',
    },
});
