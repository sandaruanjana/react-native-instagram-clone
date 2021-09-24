import React from 'react';
import {View, Image, Text} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';

export default function ProfileGrid(props) {
    let postData = props.postData;
    return (
        <FlatList
            data={postData}
            style={{marginTop: 2, marginStart: 2}}
            numColumns={3}
            indicatorStyle={'black'}
            showsVerticalScrollIndicator={true}
            renderItem={({item,index}) => (
                <View style={{flex: 1}}>
                    <TouchableOpacity
                        onPress={() => console.log('Pressed ProfileScreen Grid Image')}>
                        <Image
                            source={{uri: item.image}}
                            style={{
                                height: 150,
                                flex: 1,
                                marginEnd: 2,
                                marginBottom: 2,
                                alignItems: 'center',
                            }}
                        />
                    </TouchableOpacity>
                </View>
            )}/>
    );
}
