import React, { createContext, useEffect, useState } from 'react';
import MMKV from '../store/MMKV';
import * as RootNavigation from './../component/RootNavigation';
import PushNotification, { Importance } from 'react-native-push-notification';
import { getMsgList } from '../api/getMsgList';
import { ToastAndroid } from 'react-native';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(true);
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
    const [shouldRefresh, setShouldRefresh] = useState(false)
    useEffect(() => {
        const getSettingsOnce = async () => {
            MMKV.initialize();
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
            else{
                setAlreadyLoggedIn(false);
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
                            RootNavigation.navigationRef.current?.resetRoot({
                                index: 0,
                                routes: [{name: 'MessageList'}]
                            })
                        }
                    }else if(notification.actionType == 'active_alarm'){
                        if(userToken != ''){
                            RootNavigation.navigationRef.current?.resetRoot({
                                index: 0,
                                routes: [{name: 'Alarms'}]
                            })
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

            
            if(!alreadyLoggedIn){
                startNotificationSchedule();
            }
            
        }
        if(userToken != ''){
            initPushNotification();
            console.log("userToken:", userToken);
            
            if(!user.privileges.messaging){
                if(!user.privileges.manage_alarms){
                    RootNavigation.navigationRef.current?.resetRoot({
                        index: 0,
                        routes: [{name: "Settings"}]
                    })
                }else{
                    RootNavigation.navigationRef.current?.resetRoot({
                        index: 0,
                        routes: [{name: 'Alarms'}]
                    })
                }
            }
            else{
                RootNavigation.navigationRef.current?.resetRoot({
                    index: 0,
                    routes: [{name: "MessageList"}]
                })
            }
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
        }
    }, [userToken]);

    useEffect(() => {
        const refreshOnce = async () => {
            if( userToken == ''){
                return;
            }
            if(!shouldRefresh){
                return;
            }
            if(!user.privileges.messaging){
                RootNavigation.navigationRef.current?.resetRoot({
                    index: 0,
                    routes: [{name: 'Alarms'}]
                })
                return;
            }
            setAnimating(true)
            console.log("refresh at dataprovider")
            const res = await getMsgList(serverurl, 'self', {
                orderBy: "MQ.QueueTM DESC", 
            },userToken);
            if(res.success)
            {
                setMsgList(res.events);
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
            setShouldRefresh(false);
            setAnimating(false);
        }
        refreshOnce();
    }, [shouldRefresh])
    

    const startNotificationSchedule = () => {
        
        // PushNotification.deleteChannel("fusion-sound-normal-0113");
        // PushNotification.deleteChannel("fusion-sound-priority-0113");
        // PushNotification.deleteChannel("fusion-mute-0113");
        // PushNotification.deleteChannel("fusion-vibrate-0113");
        
        PushNotification.createChannel(
        {
            channelId: "fusion-sound-normal-0113", // (required)
            channelName: "Normal Sound Channel", // (required)
            channelDescription: "A normal sound channel", // (optional) default: undefined.
            soundName: "normal.wav", // (optional) See `soundName` parameter of `localNotification` function
        },
        (created) => console.log(`create normal Channel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
        PushNotification.createChannel(
        {
            channelId: "fusion-sound-priority-0113", // (required)
            channelName: "Priority Sound Channel", // (required)
            channelDescription: "A priority sound channel", // (optional) default: undefined.
            soundName: "priority.wav", // (optional) See `soundName` parameter of `localNotification` function
            },
            (created) => console.log(`create high Channel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
        PushNotification.createChannel(
        {
            channelId: "fusion-vibrate-0113", // (required)
            channelName: "Vibrate Channel", // (required)
            channelDescription: "A vibrate channel", // (optional) default: undefined.
            playSound: false,
            vibrate: true, // (optional) default: true. Creates the default vibration pattern if true
            },
            (created) => console.log(`create vibrate Channel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
        PushNotification.createChannel(
        {
            channelId: "fusion-mute-0113", // (required)
            channelName: "No Sound Channel", // (required)
            channelDescription: "A no sound channel", // (optional) default: undefined.
            playSound: false,
            vibrate: false, // (optional) default: true. Creates the default vibration pattern if true
            },
            (created) => console.log(`create mute Channel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );

        PushNotification.localNotificationSchedule({
            id: 2704246,
            largeIcon: "ic_notification",
            channelId: 'fusion-sound-normal-0113',
            message: 'new message',
            title: 'xyz',
            date: new Date(Date.now() + 5 * 1000), // in 5 secs
            repeatType: 'time',
            repeatTime: 10 * 1000,
            playSound: user.sound_enabled,
            soundName: "normal.wav",
            vibrate: user.sound_enabled,
            importance: Importance.HIGH,
            allowWhileIdle: true,
            serverurl,
            userToken,
        });
            
    }

    

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
        checkRemember: [checkRemember, setCheckRemember],
        notifMsgid: [notifMsgid, setNotifMsgid],
        animating: [animating, setAnimating],
        shouldRefresh: [shouldRefresh, setShouldRefresh]

    }
    return (
        <DataContext.Provider value={store}>
            {children}
        </DataContext.Provider>
    );
};