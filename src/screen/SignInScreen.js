import { useState, useContext, useEffect } from 'react'
import React from 'react'
import { StyleSheet, View, ToastAndroid, ActivityIndicator, AppRegistry, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, Input, Button, Icon, CheckBox } from '@rneui/themed';

import { DataContext } from '../provider/DataProvider';
import { logIn } from './../api/login';
import { getUser } from '../api/getUser';
import { navigationRef } from './../component/RootNavigation';
import { getChanges } from './../api/getChanges';
import  PushNotification  from 'react-native-push-notification';
import MMKV from '../store/MMKV';

export default function SignInScreen({navigation}) {
    const [animating, setAnimating] = useState(false);
    const [isPasswordSecure, setIsPasswordSecure] = useState(true);
    const [usernameRequire, setUsernameRequire] = useState(false);
    const [passwordRequire, setPasswordRequire] = useState(false);
    // const [username, setUsername] = useState('Milos');
    // const [password, setPassword] = useState('Milos2023');
    // const [hostname, setHostname] = useState('fusion.infinity-tech.com.au:50443');
    // const [instance, setInstance] = useState('FusionEnterpriseTest');
    const {
        user: [ user, setUser ],
        userToken: [userToken, setUserToken],
        serverurl: [serverurl, setServerurl],
        username: [username, setUsername],
        password: [password, setPassword],
        hostname: [hostname, setHostname],
        instance: [instance, setInstance],
        checkRemember: [checkRemember, setCheckRemember],
    } = useContext(DataContext);

    
    useEffect(() => {
        setServerurl('https://' + hostname + '/' + instance);
        //193.119.32.32
    }, [hostname])
    useEffect(() => {
        setServerurl('https://' + hostname + '/' + instance);
        //193.119.32.32
    }, [instance])

    


    const onPressLogin = async () => {
        if(username == '' || password == '')
        {
            ToastAndroid.showWithGravity('Enter your username and password.', ToastAndroid.SHORT, ToastAndroid.CENTER);
            return;
        }
        setAnimating(true);
        ToastAndroid.showWithGravity('Logging in to: ' + serverurl, ToastAndroid.SHORT, ToastAndroid.CENTER)
        const res = await logIn(serverurl, username, password);
        if(res.success) {
            await MMKV.setStringAsync('token', res.token);
            await MMKV.setStringAsync('serverurl', serverurl);
            await MMKV.setStringAsync('Remember', checkRemember?'true':'false');
            if(checkRemember) {
                await MMKV.setStringAsync('Username', username);
                await MMKV.setStringAsync('Password', password);
                await MMKV.setStringAsync('Hostname', hostname);
                await MMKV.setStringAsync('Instance', instance);
            }
            
            const user = await getUser(serverurl, res.token);
            if (user.success) {
                
                setAnimating(false);
                setUser(user);
                MMKV.setMapAsync('user', user);
                
            }
            else {
                ToastAndroid.showWithGravity('Receive User Failed: ' + user.error, ToastAndroid.SHORT, ToastAndroid.CENTER);
            }
            setUserToken(res.token);
        }
        else {
            ToastAndroid.showWithGravity('Log in failed: ' + res.error.description, ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        setAnimating(false);
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.formView}>

                <View style={styles.contentView}>
                    <Text h4 h4Style={{fontSize: 22}} style={{textAlign: 'center', backgroundColor: '#e7eef8', padding: 10, borderColor: 'lightgray', borderWidth: 1}}>
                        Please enter your login information
                    </Text>
                    <View style={{marginTop: 10}}>
                        <Input inputContainerStyle={{borderRadius: 3, borderWidth: 1}}   
                            placeholder="Username*" 
                            placeholderTextColor={usernameRequire?'red':'gray'}
                            onChangeText={value => {
                                setUsername(value);
                                value == '' ? setUsernameRequire(true) : setUsernameRequire(false) 
                            }}
                            value={username}
                        />
                        <Input inputContainerStyle={{borderRadius: 3, borderWidth: 1}}  
                            placeholder="Password*" 
                            placeholderTextColor={passwordRequire?'red':'gray'}
                            onChangeText={value => {
                                setPassword(value)
                                value == '' ? setPasswordRequire(true) : setPasswordRequire(false) 
                            }}
                            secureTextEntry={isPasswordSecure}
                            value={password}
                            rightIcon={<Icon containerStyle={{marginRight: 5}} name='eye' type='font-awesome' size={20} onPress={() => setIsPasswordSecure(!isPasswordSecure)}  />}
                        />
                        <Input inputContainerStyle={{borderRadius: 3, borderWidth: 1}}  
                            placeholderTextColor={'gray'}
                            placeholder="Server*" 
                            onChangeText={value => {
                                setHostname(value)
                            }}
                            value={hostname}
                        />
                        <Input inputContainerStyle={{borderRadius: 3, borderWidth: 1}}   
                            placeholderTextColor={'gray'}
                            placeholder="Instance*" 
                            onChangeText={value => {
                                setInstance(value)
                            }}
                            value={instance}
                        />
                        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <CheckBox
                                title="Remember Me"
                                checked={checkRemember}
                                containerStyle={{backgroundColor: '#fafafa'}}
                                onPress={() => setCheckRemember(!checkRemember)}
                            />
                            <ActivityIndicator 
                                animating={animating}
                                size="large"
                                color="dodgerblue"
                            />
                            <Button 
                                containerStyle={{marginRight: 10}}
                                disabled={animating}
                                title={'LOG IN'}
                                onPress={onPressLogin}
                            />
                        </View>
                    </View>
                </View>
        </View>
        </TouchableWithoutFeedback>
        
    )
}

const styles = StyleSheet.create({
    contentView: {
        backgroundColor: '#fafafa',
        borderWidth: 1,
        display: 'flex',
        borderColor: 'lightgray',
        borderRadius: 5,
        margin: 5,
        padding: 0, 
        width: '100%'
    },
    formView: {
        backgroundColor: '#f1ebc9',
        flex: 1, 
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    }
  });