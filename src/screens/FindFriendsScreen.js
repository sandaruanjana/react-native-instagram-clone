import React, {useEffect, useState} from 'react';
import {Avatar, Button, Icon, Layout, List, ListItem, Spinner} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function FindFriendsScreen(props) {

    let currentUser = firebase.auth().currentUser;

    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);

    const usersCollection = firestore().collection('users');

    const {navigation} = props;

    navigation.addListener('focus', () => {
        setUsers();
        setLoading(true);
        fetchData().then((e) => {
            setLoading(false);
        });
    });


    const fetchData = async () => {
        setUsers();

        try {

            const allUsers = await usersCollection.get();

            const promises = allUsers.docs.map(async e => {
                let usersData = await usersCollection.where('id', '==', currentUser.uid)
                    .where('following', 'array-contains', e.data().id)
                    .get();

                if (usersData.empty) {
                    return e.data();
                }

            });

            let allData = await Promise.all(promises);

            allData = allData.filter(function (element) {
                return element !== undefined;
            });

            allData = allData.filter(function (element) {
                return element.id !== currentUser.uid;
            });

            setUsers(allData);

        } catch (err) {
            console.error(err);
        }

    };


    useEffect(() => {
        fetchData().then((e) => {
            setLoading(false);
        });
    }, []);


    if (loading) {
        return (
            <Layout style={styles.container}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner size="giant"/>
                </View>
            </Layout>
        );
    }


    async function followUser(id) {

        let myData = await usersCollection.where('id', '==', currentUser.uid).get();
        await usersCollection.doc(myData.docs[0].id).update({
            following: firebase.firestore.FieldValue.arrayUnion(id),
        });
    }


    return (
        <List
            style={styles.container}
            data={users}
            renderItem={({item, index}) => {
                return (
                    <ListItem
                        title={item.full_name}
                        description={item.email}
                        accessoryLeft={() => {
                            return (
                                <Avatar
                                    {...props}
                                    style={[props.style, {tintColor: null}]}
                                    source={{uri: item.profile_image}}
                                />
                            );
                        }}
                        accessoryRight={() => {
                            return (
                                <Button onPress={async () => {
                                    await followUser(item.id);
                                    let filter = users.filter(function (element) {
                                        return element.id !== item.id;
                                    });
                                    setUsers(filter);
                                }} size="tiny">FOLLOW</Button>
                            );
                        }}
                    />
                );
            }}
        />
    );


}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
});

export default FindFriendsScreen;
