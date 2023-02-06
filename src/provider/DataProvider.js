import React, { createContext, useEffect, useState } from 'react';
import MMKV from '../store/MMKV';
import * as RootNavigation from './../component/RootNavigation';
import PushNotification, { Importance } from 'react-native-push-notification';
import { getMsgList } from '../api/getMsgList';
import { ToastAndroid } from 'react-native';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [animating, setAnimating] = useState(false);
    const [notifMsgid, setNotifMsgid] = useState(0);
    const [ userToken, setUserToken ] = useState('');
    const [ msgList, setMsgList ] = useState([]);
    const [ alarmList, setAlarmList ] = useState([]);
    const [serverurl, setServerurl] = useState('');
    const [ user, setUser ] = useState({});
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hostname, setHostname] = useState('');
    const [checkRemember, setCheckRemember] = useState(true);
    const [instance, setInstance] = useState('');
    const [settings, setSettings] = useState({
        maxMessages: '10',
        detectPhoneNumber: false,
        playSoundOnNewMsg: true,
        vibrateOnNewMsg: true,
        overrideSilentOnPriority: false
    });
    useEffect(() => {
        const getSettingsOnce = async () => {
            MMKV.initialize();
            const res = await MMKV.getMapAsync('settings');
            if(res){
                setSettings(res)
            }
            const resUser = await MMKV.getMapAsync('user')
            if(resUser){
                setUser(resUser);
            }
            const resServerurl = await MMKV.getStringAsync('serverurl');
            if(resServerurl){
                setServerurl(resServerurl);
            }
            const resToken = await MMKV.getStringAsync('token')
            if(resToken){
                setUserToken(resToken);
            }
            const resRemember = await MMKV.getStringAsync('Remember')
            if(resRemember){
                setCheckRemember(resRemember=='true'?true:false);
            }
            if(resRemember == 'true'){
                const resUsername = await MMKV.getStringAsync('Username')
                if(resUsername && resRemember == 'true'){
                    setUsername(resUsername);
                }
                const resPassword = await MMKV.getStringAsync('Password')
                if(resPassword && resRemember == 'true'){
                    setPassword(resPassword);
                }
                const resHostname = await MMKV.getStringAsync('Hostname')
                if(resHostname && resRemember == 'true'){
                    setHostname(resHostname);
                }
                const resInstance = await MMKV.getStringAsync('Instance')
                if(resInstance && resRemember == 'true'){
                    setInstance(resInstance);
                }
            }
            
        }
        
        getSettingsOnce();

        
        
    }, [])

    useEffect(() => {
        const initPushNotification = () => {
            PushNotification.configure({
                // onNotification is called when a notification is to be emitted
                onNotification: (notification) => {
                    console.log("NOTIFICATION:", notification);
                    if(notification.actionType == 'user_event'){
                        setNotifMsgid(notification.objectId);
                        if(userToken != ''){
                            if(!user.privileges.messaging){
                                ToastAndroid.showWithGravity('Messages: Permission Denied', ToastAndroid.SHORT, ToastAndroid.CENTER);
                                RootNavigation.navigationRef.current?.resetRoot({
                                    index: 0,
                                    routes: [{name: 'Alarms'}]
                                })
                                return;
                            }
                            else{
                                RootNavigation.navigationRef.current?.resetRoot({
                                    index: 0,
                                    routes: [{name: 'MessageList'}]
                                })
                            }
                        }
                    }else{
                        if(userToken != ''){
                            if(!user.privileges.manage_alarms){
                                ToastAndroid.showWithGravity('Alarms: Permission Denied', ToastAndroid.SHORT, ToastAndroid.CENTER);
                                RootNavigation.navigationRef.current?.resetRoot({
                                    index: 0,
                                    routes: [{name: 'MessageList'}]
                                })
                                return;
                            }
                            else{
                                RootNavigation.navigationRef.current?.resetRoot({
                                    index: 0,
                                    routes: [{name: 'Alarms'}]
                                })
                            }
                        }
                    }
                },
    
                // Permissions to register for iOS
                permissions: {
                alert: true,
                badge: true,
                sound: true,
                },
                popInitialNotification: true,
                requestPermissions: Platform.OS === 'ios'
            });
            
            PushNotification.deleteChannel("fusion-normal-channel-0113");
            PushNotification.deleteChannel("fusion-high-channel-0113");
    
            PushNotification.createChannel(
            {
                channelId: "fusion-normal-channel-0113", // (required)
                channelName: "normal channel", // (required)
                channelDescription: "A normal channel to categorise your notifications", // (optional) default: undefined.
                playSound: user.sound_enabled, // (optional) default: true
                soundName: "normal.wav", // (optional) See `soundName` parameter of `localNotification` function
                importance: Importance.DEFAULT, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
            },
            (created) => console.log(`create normal Channel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
            );
            
            PushNotification.createChannel(
                {
                channelId: "fusion-high-channel-0113", // (required)
                channelName: "high channel", // (required)
                channelDescription: "A high channel to categorise your notifications", // (optional) default: undefined.
                playSound: user.sound_enabled, // (optional) default: true
                soundName: "priority.wav", // (optional) See `soundName` parameter of `localNotification` function
                importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.import { getMsgList } from './../api/getMsgList';

                },
                (created) => console.log(`create hight Channel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
                );
                
        }
        if(userToken != ''){
            initPushNotification();
            console.log("userToken:", userToken);
            if(!user.privileges.messaging){
                ToastAndroid.showWithGravity('Messages: Permission Denied', ToastAndroid.SHORT, ToastAndroid.CENTER);
                RootNavigation.navigationRef.current?.resetRoot({
                    index: 0,
                    routes: [{name: 'Alarms'}]
                })
            }
            else{
                RootNavigation.navigationRef.current?.resetRoot({
                    index: 0,
                    routes: [{name: "MessageList"}]
                })
            }
            
            PushNotification.cancelAllLocalNotifications();
            PushNotification.localNotificationSchedule({
                largeIcon: "ic_notification",
                channelId: 'fusion-normal-channel-0113',
                message: 'new message',
                title: 'fusion',
                serverurl,
                userToken,
                vibrate: settings.vibrateOnNewMsg,
                playSound: settings.playSoundOnNewMsg && user.sound_enabled,
                soundName: 'normal.wav',
                soundNameHigh: 'priority.wav',
                soundNameNormal: 'normal.wav',
                date: new Date(Date.now() + 5 * 1000), // in 60 secs
                repeatType: 'time',
                repeatTime: 30 * 1000,
                showFlag: 'false', 
                hasPermission: user.privileges.messaging && user.privileges.manage_alarms && user.webpush_alarm_enable ? 'true' : 'false'
            });
        }
        else {
            if(!checkRemember)
            {
                setUsername('');
                setHostname('');
                setPassword('');
                setInstance('');
            }
            RootNavigation.navigationRef.current?.resetRoot({
                index: 0,
                routes: [{name: 'SignIn'}]
            })
            PushNotification.cancelAllLocalNotifications();
        }
    }, [userToken]);

    useEffect(() => {
        const refreshOnce = async () => {
            if(msgList.length || userToken == ''){
                return;
            }
            if(!user.privileges.messaging){
                ToastAndroid.showWithGravity('Messages: Permission Denied', ToastAndroid.SHORT, ToastAndroid.CENTER);
                RootNavigation.navigationRef.current?.resetRoot({
                    index: 0,
                    routes: [{name: 'Alarms'}]
                })
                return;
            }
            setAnimating(true)
            const res = await getMsgList(serverurl, 'self', {
                orderBy: "MQ.QueueTM DESC", 
                offset: 0,
                limit: settings.maxMessages
            },userToken);
            
            if(res.success)
            {
                if(res.events.length){
                    setMsgList(res.events);
                }
            }
            else{
                ToastAndroid.showWithGravity('Messages error: ' + res.error.description, ToastAndroid.SHORT, ToastAndroid.CENTER);
                await MMKV.setStringAsync('token', '');
                await MMKV.setMapAsync('user', {});
                setUserToken('');
            }
            setAnimating(false);
        }
        refreshOnce();
    }, [msgList])
    
    
    const store = {
        userToken: [ userToken, setUserToken ],
        msgList: [ msgList, setMsgList ],
        user: [ user, setUser ],
        serverurl: [serverurl, setServerurl],
        alarmList: [alarmList, setAlarmList],
        username: [username, setUsername],
        password: [password, setPassword],
        hostname: [hostname, setHostname],
        instance: [instance, setInstance],
        settings: [settings, setSettings],
        checkRemember: [checkRemember, setCheckRemember],
        notifMsgid: [notifMsgid, setNotifMsgid],
        animating: [animating, setAnimating]
    }
    return (
        <DataContext.Provider value={store}>
            {children}
        </DataContext.Provider>
    );
};