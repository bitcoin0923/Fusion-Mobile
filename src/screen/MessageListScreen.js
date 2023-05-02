import { View, Text, FlatList, StyleSheet, ToastAndroid, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { DataContext } from './../provider/DataProvider';
import { getMsgList } from './../api/getMsgList';
import MessageItem from '../component/MessageItem';
import { Button, FAB } from '@rneui/themed';
import { actionMsg } from './../api/actionMsg';
import MMKV from '../store/MMKV';
import { Linking } from 'react-native';

export default function MessageListScreen({navigation}) {
    const {
        msgList: [msgList, setMsgList],
        userToken: [ userToken, setUserToken ],
        serverurl: [serverurl, setServerurl],
        notifMsgid: [notifMsgid, setNotifMsgid],
        animating: [animating, setAnimating],
        shouldRefresh: [shouldRefresh, setShouldRefresh]
    } = useContext(DataContext);
    useEffect( () => {
        const refreshOnce = async () => {
            console.log("refresh at messagelist")
            const res = await getMsgList(serverurl, 'self', {
                orderBy: "MQ.QueueTM DESC", 
            },userToken);
            if(res.success)
            {
                setMsgList(res.events);
                console.log('notifi id', notifMsgid)
                if(notifMsgid != 0) {
                    for (let index = 0; index < res.events.length; index++) {
                        const element = res.events[index];
                        if(element.id == notifMsgid){
                            actionMsg(serverurl, 'self', notifMsgid, userToken, '/read');
                            setShouldRefresh(true)
                            navigation.navigate('ShowMessage', element);
                            setNotifMsgid(0)
                        } 
                    }
                }
            }
            else{
                if(res.error.description == 'NetworkError'){
                    ToastAndroid.showWithGravity('Network Error', ToastAndroid.SHORT, ToastAndroid.CENTER);
                }
                else{
                    ToastAndroid.showWithGravity('Messages error: ' + res.error.description, ToastAndroid.SHORT, ToastAndroid.CENTER);
                    await MMKV.setStringAsync('token', '');
                    await MMKV.setMapAsync('user', {});
                    setUserToken('');
                }
            }
        }
        refreshOnce();
    }, []);

    

    const renderItem = ({ item }) => (
        <TouchableOpacity  onPress={async () => {
            if(item.status == 4){
                actionMsg(serverurl, 'self', item.id, userToken, '/read');
                setShouldRefresh(true)
            }
            navigation.navigate('ShowMessage', item);
        }}>
            <MessageItem msg={item} />
        </TouchableOpacity>
        
    );

    


    return (
        <View style={styles.container}>
            <View style={{flex: 11, padding: 0}}>
                <FlatList
                    data={msgList}
                    renderItem={renderItem} 
                    keyExtractor={msg => msg.id}  
                    onRefresh={() => {setShouldRefresh(true)}}
                    refreshing={animating}
                />
            </View>
            <FAB
                onPress={() => {
                    navigation.navigate('NewMessage');
                }}
                placement="right"
                icon={{ name: 'edit', color: 'white' }}
                color="dodgerblue"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 0,
    },
    bottomContainer: {
        borderTopWidth: 1,
        borderTopColor: '#888',
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center'
    }
})
