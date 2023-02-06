import { View, Text, FlatList, StyleSheet, ToastAndroid, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { DataContext } from './../provider/DataProvider';
import { getMsgList } from './../api/getMsgList';
import MessageItem from '../component/MessageItem';
import { Button } from '@rneui/themed';
import { actionMsg } from './../api/actionMsg';
import MMKV from '../store/MMKV';

export default function MessageListScreen({navigation}) {
    const {
        msgList: [msgList, setMsgList],
        userToken: [ userToken, setUserToken ],
        serverurl: [serverurl, setServerurl],
        notifMsgid: [notifMsgid, setNotifMsgid],
        animating: [animating, setAnimating],
        settings: [settings, setSettings],
    } = useContext(DataContext);
    useEffect( () => {
        const refreshOnce = async () => {
            const res = await getMsgList(serverurl, 'self', {
                orderBy: "MQ.QueueTM DESC", 
                offset: 0,
                limit: settings.maxMessages
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
                            setMsgList([])
                            navigation.navigate('ShowMessage', element);
                        } 
                    }
                }
            }
            else{
                ToastAndroid.showWithGravity('Messages error: ' + res.error.description, ToastAndroid.SHORT, ToastAndroid.CENTER);
                await MMKV.setStringAsync('token', '');
                await MMKV.setMapAsync('user', {});
                setUserToken('');
            }
        }
        refreshOnce();
    }, []);



    const renderItem = ({ item }) => (
        <TouchableOpacity  onPress={async () => {
            if(item.status == 4){
                actionMsg(serverurl, 'self', item.id, userToken, '/read');
                setMsgList([])
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
                    onRefresh={() => {setMsgList([]);}}
                    refreshing={animating}
                />
            </View>
            
            <View style={styles.bottomContainer}>
                <Button type={'clear'}
                    disabled={animating}
                    title="Refresh Inbox"
                    icon={{
                        name: 'refresh',
                        type: 'font-awesome',
                        size: 15,
                        color: 'dodgerblue',
                    }}
                    iconContainerStyle={{ marginRight: 10 }}
                    onPress={() => { 
                        setMsgList([]);
                    }}

                />
                <Button type={'clear'}
                    title="Write a new Message"
                    icon={{
                        name: 'envelope-o',
                        type: 'font-awesome',
                        size: 15,
                        color: 'dodgerblue',
                    }}
                    iconContainerStyle={{ marginRight: 10 }}
                    onPress={() => { 
                        navigation.navigate('NewMessage');
                    }}
                />
            </View>
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
