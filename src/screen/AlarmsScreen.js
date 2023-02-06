import { View, Text, FlatList, StyleSheet, ToastAndroid, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useContext, useState } from 'react'
import { DataContext } from './../provider/DataProvider';
import { getAlarmList } from '../api/getAlarmList.js';
import AlarmItem from '../component/AlarmItem';
import { Button, Dialog } from '@rneui/themed';
import { cancelAlarm } from './../api/cancelAlarm';
import MMKV from '../store/MMKV';
export default function AlarmsScreen({navigation}) {
    const [animating, setAnimating] = useState(false);
    const {
        alarmList: [alarmList, setAlarmList],
        userToken: [ userToken, setUserToken ],
        serverurl: [serverurl, setServerurl],
        settings: [settings, setSettings],
        user: [ user, setUser ],
    } = useContext(DataContext);
    const [visibleDeleteConfirmDialog, setVisibleDeleteConfirmDialog] = useState(false);
    const [cancelData, setCancelData] = useState({
        id: '',
        alarmName: ''
    })
    useEffect( () => {
      const refreshOnce = async () => {
          await refresh();
        }
        if(user.privileges.manage_alarms){
            refreshOnce();
        }
        else{
            ToastAndroid.showWithGravity('Permission denied', ToastAndroid.SHORT, ToastAndroid.CENTER);
            navigation.navigate("MessageList");
        }
    }, []);

    const renderItem = ({ item }) => (
        <AlarmItem onCancel={onCancel} alarm={item} />
    );
    const toggleDialog = () => {
        setVisibleDeleteConfirmDialog(!visibleDeleteConfirmDialog);
    }
        
    const onCancel = (id, alarmName ) => {
        setCancelData({
            id,
            alarmName
        });
        toggleDialog();
    }

    const onCancelConfirm = async () => {
        setAnimating(true);
        const res = await cancelAlarm(serverurl, cancelData.id, userToken);
        setAnimating(false);
        if(res.success)
        {
            setAlarmList([]);
        }
        else{
            ToastAndroid.showWithGravity('Messages error: ' + JSON.stringify(res.error), ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        toggleDialog()
    }

    const refresh = async () => {
        setAnimating(true);
        const res = await getAlarmList(serverurl, {
            offset: 0,
            limit: settings.maxMessages
        }, userToken);
        if(res.success)
        {
            setAlarmList(res.alarms);
        }
        else{
            ToastAndroid.showWithGravity('Alarms error: ' + res.error.description, ToastAndroid.SHORT, ToastAndroid.CENTER);
            await MMKV.setStringAsync('token', '');
            await MMKV.setMapAsync('user', {});
            setUserToken('');
        }
        setAnimating(false);
    }
    

    return (
        <View style={styles.container}>
            <View style={{flex: 11, padding: 0}}>
                <FlatList
                    data={alarmList}
                    renderItem={renderItem} 
                    keyExtractor={alarm => alarm.id}  
                    onRefresh={() => refresh()}
                    refreshing={animating}
                />
            </View>
            
            <View style={styles.bottomContainer}>
                <Button type={'clear'}
                    disabled={animating}
                    title="Refresh Alarms"
                    icon={{
                        name: 'refresh',
                        type: 'font-awesome',
                        size: 15,
                        color: 'dodgerblue',
                    }}
                    iconContainerStyle={{ marginRight: 10 }}
                    onPress={async () => { await refresh();}}
                />
            </View>
            <Dialog
                isVisible={visibleDeleteConfirmDialog}
                onBackdropPress={toggleDialog}
            >
                <Dialog.Title titleStyle={{color: 'black'}} title={`Cancel Alarm ${cancelData.alarmName}`}/>
                <Text style={{color: 'black'}}>
                Are you sure that you wish to cancel this Alarm?
                </Text>

                <Dialog.Actions>
                    <ActivityIndicator 
                        animating={animating}
                        size="large"
                        color="dodgerblue"
                    />
                    <Dialog.Button
                        title="CONFIRM"
                        onPress={onCancelConfirm}
                        color={'primary'}
                    />
                    <Dialog.Button title="CANCEL" onPress={toggleDialog} containerStyle={{ marginRight: 10}}/>
                </Dialog.Actions>
            </Dialog>
        
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
