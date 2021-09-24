import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import React from 'react';
import {Input, Layout} from '@ui-kitten/components';
import auth, {firebase} from '@react-native-firebase/auth';
import {useToast} from 'react-native-styled-toast';
import firestore from '@react-native-firebase/firestore';


export default function WelcomeScreen({route, navigation}) {

    const {email, password} = route.params;

    console.log(email);
    console.log(password);

    const {toast} = useToast();

    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');

    const usersCollection = firestore().collection('users');

    return (
        <Layout style={Styles.container}>
            <View>
                <View style={Styles.userNameContainer}>
                    <Input
                        placeholder="First Name"
                        value={firstName}
                        onChangeText={nextValue => setFirstName(nextValue)}
                    />
                </View>
                <View style={Styles.passwordContainer}>
                    <Input
                        placeholder="Last Name"
                        value={lastName}
                        onChangeText={nextValue => setLastName(nextValue)}
                    />
                </View>
                <TouchableOpacity
                    style={Styles.loginContainer}
                    onPress={() => {
                        if (firstName === '' || firstName === null || lastName === '' || lastName === null) {
                            toast({
                                intent: 'WARN',
                                message: 'email or password field empty check again!',
                            });
                        } else {

                            auth()
                                .createUserWithEmailAndPassword(email, password)
                                .then((u) => {
                                    console.log('User account created & signed in!');

                                    usersCollection
                                        .add({
                                            id: u.user.uid,
                                            email: u.user.email,
                                            first_name: firstName,
                                            last_name: lastName,
                                            followers:[],
                                            following:[],
                                            createdOn:firebase.firestore.Timestamp.now(),
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
                    <Text style={Styles.loginText}>Next</Text>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    marginTop: 40,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}/>
        </Layout>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
