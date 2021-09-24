import React, {useEffect, useState} from 'react';
import {Button, Icon, Layout, List, ListItem, Spinner} from '@ui-kitten/components';
import {StyleSheet, View} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

function FindFriendsScreen() {

    let currentUser = firebase.auth().currentUser;

    const [users, setUsers] = useState();
    const [loading, setLoading] = useState(true);

    const usersCollection = firestore().collection('users');

    // const fetchData = async () => {
    //
    //     try {
    //
    //         var allUsers = await usersCollection.get();
    //
    //         allUsers.docs.map(async e => {
    //
    //             let usersData = await usersCollection.where('id', '==', currentUser.uid).where('following', 'array-contains', e.data()['id'])
    //                 .get();
    //
    //             if (usersData.empty === true) {
    //                 console.log(e.data());
    //                 setUsers(e.data());
    //             }
    //
    //         });
    //
    //
    //     } catch (err) {
    //         console.error(err);
    //     }
    //
    // };


    const fetchData = async () => {
        setUsers();

        try {

            const allUsers = await usersCollection.get();

            const promises = allUsers.docs.map(async e => {
                let usersData = await usersCollection.where('id', '==', currentUser.uid).where('following', 'array-contains', e.data().id)
                    .get();

                if (usersData.empty === true) {
                    return e.data();
                }

            });


            const numFruits = await Promise.all(promises);
            setUsers(numFruits);
            console.log(numFruits);


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


    const renderItemAccessory = (props) => (
        <Button size="tiny">FOLLOW</Button>
    );

    const renderItemIcon = (props) => (
        <Icon {...props} name="person"/>
    );

    const data = new Array(8).fill({
        title: 'Item',
        description: 'Description for Item',
    });

    // const renderItem = ({item, index}) => (
    //     <ListItem
    //         title={index}
    //         description={'asdasd'}
    //         accessoryLeft={renderItemIcon}
    //         accessoryRight={renderItemAccessory}
    //     />
    // );

    console.log(users);

    if(users !== undefined){
        return (
            <List
                style={styles.container}
                data={users}
                // renderItem={renderItem}
                renderItem={({item,index}) => (
                    <ListItem
                        title={index}
                        description={ 'qq'}
                        accessoryLeft={renderItemIcon}
                        accessoryRight={renderItemAccessory}
                    />
                )}
            />
        );
    }


}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
});

export default FindFriendsScreen;
