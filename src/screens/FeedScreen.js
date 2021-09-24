import React, {useEffect, useState} from 'react';
import {Text, Avatar, Layout, Spinner} from '@ui-kitten/components';
import {StyleSheet, View, Image, FlatList, Dimensions, TouchableOpacity} from 'react-native';
import likeImage from '../assets/images/like.png';
import commentImage from '../assets/images/comment.png';
import sendImage from '../assets/images/send.png';
import moreImage from '../assets/images/more.png';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';

const {height, width} = Dimensions.get('window');

function FeedScreen(props) {

    const [posts, setPosts] = useState();
    const [loading, setLoading] = useState(true);

    const postCollection = firestore().collection('posts');
    let user = firebase.auth().currentUser;

    const {navigation} = props;
    navigation.addListener('focus', () => {
    });


    function onResult(QuerySnapshot) {
        const queryData = QuerySnapshot.docs.map(doc => doc.data());
        setPosts(queryData);
        setLoading(false);
    }

    function onError(error) {
        console.error(error);
    }

    const fetchData = async () => {

        try {
            await postCollection
                .orderBy('createdOn','desc').onSnapshot(onResult, onError);
        } catch (err) {
            console.error(err);
        }

    };

    useEffect(() => {


        fetchData();

    }, []);


    async function like(id) {

        let postData = await postCollection.where('id', '==', id).get();
        await postCollection.doc(postData.docs[0].id).update({
            likes: firebase.firestore.FieldValue.arrayUnion(user.uid),
        });
    }


    if (loading) {
        return (
            <Layout style={styles.container}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner size="giant"/>
                </View>
            </Layout>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={posts => posts.id}
                renderItem={({item}) => (
                    <View styles={styles.feedItem}>

                        <View style={styles.feedItemHeader}>
                            <Avatar style={styles.avatar} size="large" source={{uri: item.posted_user_profile_image}}/>
                            <View style={styles.postHeader}>
                                <Text style={styles.name}>{item.posted_user_full_name}</Text>
                                <Text style={styles.place}>Sri Lanka</Text>
                            </View>
                            <Image source={moreImage}/>
                        </View>

                        <Image style={styles.feedImage} source={{uri: `${item.image}`}}/>

                        <View style={styles.feedItemFooter}>
                            <View style={styles.actions}>

                                <TouchableOpacity style={styles.action} onPress={async () => like(item.id)}>
                                    <Image source={likeImage}/>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.action} onPress={() => {
                                }}>
                                    <Image source={commentImage}/>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.action} onPress={() => {
                                }}>
                                    <Image source={sendImage}/>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.likes}>100 Likes</Text>
                            <Text style={styles.description}>{item.caption}</Text>
                            {/*<Text style={styles.hashtags}>#Hello</Text>*/}
                        </View>
                    </View>
                )}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    feedItem: {
        marginTop: 20,
    },
    avatar: {
        margin: 0.5,
    },
    postHeader: {
        marginRight: width / 2.2,
    },
    feedItemHeader: {
        paddingTop: 20,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 14,
        color: '#000',
    },
    place: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    feedImage: {
        width: '100%',
        height: 400,
        marginVertical: 15,
    },
    feedItemFooter: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    actions: {
        flexDirection: 'row',
    },
    action: {
        marginRight: 8,
    },
    likes: {
        marginTop: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    description: {
        lineHeight: 18,
        color: '#000',
    },
});

export default FeedScreen;
