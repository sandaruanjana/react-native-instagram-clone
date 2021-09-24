import React, {useEffect, useState} from 'react';
import {Text, Layout, Divider, Spinner} from '@ui-kitten/components';
import {Dimensions, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import ProfileGrid from '../components/ProfileGrid';
import auth, {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const {height, width} = Dimensions.get('window');


function ProfileScreen() {

    const [profile, setProfile] = useState();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState();

    const usersCollection = firestore().collection('users');
    const postCollection = firestore().collection('posts');

    function onResult(QuerySnapshot) {
        const queryData = QuerySnapshot.docs.map(doc => doc.data());
        setPosts(queryData);
        setLoading(false);
    }

    function onError(error) {
        console.error(error);
    }


    var user = firebase.auth().currentUser;


    useEffect(() => {

        const fetchData = async () => {

            try {

                const response = usersCollection.where('id', '==', user.uid)
                    .get();

                const data = (await response).docs[0].data();
                setProfile(data);

                await postCollection.where('posted_user_id','==',user.uid)
                    .orderBy('createdOn','desc').onSnapshot(onResult, onError);

                setLoading(false);

            } catch (err) {
                console.error(err);
            }

        };

        fetchData();

    }, []);


    if (loading) {
        return (
            <Layout style={Styles.layoutBody}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner size="giant"/>
                </View>
            </Layout>
        );
    }


    return (
        <Layout style={Styles.layoutBody}>
            <View style={Styles.container}>
                <TouchableOpacity>
                    <Image
                        source={{uri: profile.profile_image === '' ? 'https://picsum.photos/600' : profile.profile_image}}
                        style={Styles.prfilePicture}
                    />
                </TouchableOpacity>

                <View style={Styles.container2}>
                    <View style={Styles.container3}>
                        <TouchableOpacity>
                            <Text style={Styles.numberContainer}>10</Text>
                            <Text style={Styles.text}>Posts</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.container3}>
                        <TouchableOpacity>
                            <Text style={Styles.numberContainer}>160</Text>
                            <Text style={Styles.text}>Followers</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={Styles.container3}>
                        <TouchableOpacity>
                            <Text style={Styles.numberContainer}>100</Text>
                            <Text style={Styles.text}>Following</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View
                style={Styles.userBioSection}>
                <View style={{marginBottom: 5}}>
                    <Text style={{color: 'black', fontWeight: 'bold'}}>{profile.full_name}</Text>
                </View>
                <View style={{marginBottom: 5}}>
                    <Text style={{color: 'black'}}>
                        {profile.bio}
                    </Text>
                </View>
            </View>

            <TouchableOpacity onPress={() => {
                auth()
                    .signOut()
                    .then(() => console.log('User signed out!'));
            }}>
                <View style={{marginTop: 10, marginBottom: 20}}>
                    <View
                        style={{
                            height: 30,
                            borderRadius: 5,
                            marginStart: 10,
                            marginEnd: 10,
                            backgroundColor: '#FFFFFF',
                            justifyContent: 'center',
                            borderColor: '#262626',
                            borderWidth: 0.7,
                        }}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={{color: 'black', fontWeight: 'bold'}}>Edit Profile</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            <Divider/>

            <ProfileGrid postData={posts}/>

        </Layout>
    );
}


const Styles = StyleSheet.create({
    layoutBody: {
        flex: 1,
        backgroundColor: 'white',
    },
    userBioSection: {
        flexDirection: 'column',
        marginStart: 10,
        marginTop: 20,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    prfilePicture: {
        height: 80,
        width: 80,
        borderRadius: 100,
        marginLeft: 20,
    },
    numberContainer: {
        color: 'black',
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 15,
    },
    container2: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'center',
        marginEnd: 20,
    },
    text: {
        color: 'black',
        //fontWeight: 'bold',
        alignSelf: 'center',
    },
    container3: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
    },
});

export default ProfileScreen;
