import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import React from 'react';
import {Input, Layout} from '@ui-kitten/components';
import loginLogo from '../assets/images/logo_login.png';
import auth, {firebase} from '@react-native-firebase/auth';
import {useToast} from 'react-native-styled-toast';
import {GoogleSignin, GoogleSigninButton} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';


GoogleSignin.configure({
    webClientId: '661154728833-opuq46u7jfvg961lj7e3ajpntgl8gb3o.apps.googleusercontent.com',
});


export default function LoginScreen(props) {

    const {toast} = useToast();

    const [emailValue, setEmailValue] = React.useState('');
    const [passwordValue, setPasswordValue] = React.useState('');

    const usersCollection = firestore().collection('users');


    async function onGoogleButtonPress() {
        // Get the users ID token
        const {idToken} = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
    }

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
                        placeholder="Password"
                        value={passwordValue}
                        onChangeText={nextValue => setPasswordValue(nextValue)}
                    />
                </View>
                <View style={Styles.forgotPasswordContainer}>
                    <TouchableOpacity>
                        <Text style={Styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={Styles.loginContainer}
                    onPress={() => {
                        if (emailValue === '' || emailValue === null || passwordValue === '' || passwordValue === null) {

                            toast({
                                intent: 'WARN',
                                message: 'email or password field empty check again!',
                            });
                        } else {

                            auth()
                                .signInWithEmailAndPassword(emailValue, passwordValue)
                                .then(() => {
                                    console.log('User account created & signed in!');
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
                    <Text style={Styles.loginText}>Log In</Text>
                </TouchableOpacity>
            </View>


            <View
                style={{
                    marginTop: 40,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <GoogleSigninButton
                    style={{width: 192, height: 48}}
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={async () => {
                        let u = await onGoogleButtonPress();

                        firestore()
                            .collection('users')
                            .where('id', '==', u.user.uid)
                            .get()
                            .then(querySnapshot => {

                                if (querySnapshot.docs.length === 0) {

                                    usersCollection
                                        .add({
                                            id: u.user.uid,
                                            email: u.user.email,
                                            full_name: u.user.displayName,
                                            bio:'',
                                            profile_image:u.user.photoURL,
                                            followers: [],
                                            following: [],
                                            createdOn: firebase.firestore.Timestamp.now(),
                                        })
                                        .then(() => {
                                            console.log('User added!');
                                        });
                                } else {
                                }

                            }).catch(e => {
                            console.log(e);
                        });

                    }
                    }/>
            </View>


            <View
                style={{
                    marginTop: 40,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <TouchableOpacity onPress={()=>{
                    props.navigation.navigate('RegisterScreen');
                }}>
                    <Text style={Styles.forgotPasswordText}>Don't have an account? Sign up</Text>
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
