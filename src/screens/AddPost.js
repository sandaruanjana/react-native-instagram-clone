import React, {useEffect, useState} from 'react';
import {View, Image, Dimensions, StyleSheet, ScrollView} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {Button, Input, Layout, Spinner, Text} from '@ui-kitten/components';
import ImagePicker from 'react-native-image-crop-picker';
import {useNavigation} from '@react-navigation/native';
import auth, {firebase} from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Feather';
import {useToast} from 'react-native-styled-toast';
import uuid from 'react-native-uuid';
import storage from '@react-native-firebase/storage';


const {height} = Dimensions.get('window');


function AddPost(props) {

    const {toast} = useToast();

    const postCollection = firestore().collection('posts');

    const [caption, setCaption] = useState();
    const [image, setImage] = useState();
    const [loading, setLoading] = useState(false);

    const {navigation} = props;
    navigation.addListener('focus', () => {
        setImage();
        setCaption();
    });

    const nav = useNavigation();

    useEffect(() => {
        nav.setOptions({
            headerRight: () => <View style={{marginRight: 10}}>
                {loading ? <Spinner/> : <Icon onPress={() => addNewPost()}
                                                        name="check"
                                                        size={30}
                                                        color={'#000000FF'}
                />}
            </View>,
        });
    });

    const uploadImage = async (uri, name, firebasePath) => {
        const imageRef = storage().ref(`${firebasePath}/${name}`);
        await imageRef.putFile(uri, {contentType: 'image/jpg'}).catch((error) => {
            throw error;
        });
        const url = await imageRef.getDownloadURL().catch((error) => {
            throw error;
        });
        return url;
    };

    async function addNewPost() {

        if (caption === undefined || image === undefined) {
            toast({
                intent: 'WARN',
                message: 'Caption or Image can\'t be empty',
            });
        } else {

            setLoading(true);

            let user = firebase.auth().currentUser;

            const uploadedUrl = await uploadImage(image.path, uuid.v4() + '.jpg', 'images');

            let profile = await firestore()
                .collection('users')
                .where('id', '==', user.uid)
                .get();

            postCollection
                .add({
                    id: uuid.v4(),
                    image: uploadedUrl,
                    caption: caption,
                    posted_user_id: user.uid,
                    posted_user_full_name: profile.docs[0].data()['full_name'],
                    posted_user_profile_image: profile.docs[0].data()['profile_image'],
                    likes: [],
                    comments: [],
                    createdOn: firebase.firestore.Timestamp.now(),
                })
                .then(() => {
                    setLoading(false);
                    props.navigation.navigate('FeedScreen');
                    console.log('Uploaded!');
                });
        }


    }

    function openImage() {
        ImagePicker.openPicker({
            height: 400,
            cropping: true,
        }).then(image => {
            setImage(image);
        });
    }


    return (

        <Layout style={styles.container}>
            <ScrollView>
                <View style={{marginTop: height / 75}}>
                    <View>
                        {image ? (
                            <Image
                                source={{uri: image.path}}
                                style={{width: '100%', height: 300, resizeMode: 'contain'}}
                            />
                        ) : (
                            <Button
                                onPress={() => {
                                    openImage();
                                }}
                                style={{
                                    alignItems: 'center',
                                    padding: 10,
                                    margin: 30,
                                }}>
                                Add an image
                            </Button>
                        )}
                    </View>
                    <View style={{marginTop: 30, alignItems: 'center'}}>
                        <Input
                            multiline
                            numberOfLines={3}
                            placeholder="Write a Caption"
                            style={{margin: 20}}
                            value={caption}
                            onChangeText={cap => setCaption(cap)}
                        />
                    </View>
                </View>
            </ScrollView>
        </Layout>

    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
});

export default AddPost;
