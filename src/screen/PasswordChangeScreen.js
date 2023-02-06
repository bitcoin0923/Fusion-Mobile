import { useState, useContext, useEffect } from 'react'
import React from 'react'
import { StyleSheet, View, ToastAndroid, ActivityIndicator, Keyboard } from 'react-native';
import { Text, Input, Button, Icon, CheckBox } from '@rneui/themed';

import { DataContext } from '../provider/DataProvider';
import { changePassword } from './../api/changePassword';
import { TouchableWithoutFeedback } from 'react-native';

export default function PasswordChangeScreen({navigation}) {
    const [animating, setAnimating] = useState(false);
    const [confirmRequire, setConfirmRequire] = useState(false);
    const [isPasswordSecure, setIsPasswordSecure] = useState(true);
    const [isConfirmSecure, setIsConfirmSecure] = useState(true);
    const [passwordRequire, setPasswordRequire] = useState(false);
    const [confirm, setConfirm] = useState('');
    const [password, setPassword] = useState('');
    const {
        userToken: [userToken, setUserToken],
        serverurl: [serverurl, setServerurl],
    } = useContext(DataContext);

    const onPressChange = async () => {
        if(confirm == '' || password == '' || confirm != password)
        {
            ToastAndroid.showWithGravity('Enter your password and confirm password correctly.', ToastAndroid.SHORT, ToastAndroid.CENTER);
            setConfirmRequire(true);
            setPasswordRequire(true);
            return;
        }
        setAnimating(true);
        ToastAndroid.showWithGravity('Changing password', ToastAndroid.SHORT, ToastAndroid.CENTER)
        const res = await changePassword(serverurl, password, userToken);
        if(res.success) {
            navigation.navigate('Settings');
            ToastAndroid.showWithGravity('Password Changed successfully.', ToastAndroid.SHORT, ToastAndroid.CENTER)
            
        }
        else {
            ToastAndroid.showWithGravity('Change password failed: ' + res.error, ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
        setAnimating(false);
    }
    return (
        <View style={styles.formView}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            
            <View style={styles.contentView}>
                <Text h4 h4Style={{fontSize: 22}} style={{textAlign: 'center', backgroundColor: '#e7eef8', padding: 10, borderColor: 'lightgray', borderWidth: 1}}>
                    Change Password
                </Text>
                <View>
                    <Input inputContainerStyle={{borderRadius: 3, borderWidth: 1}}   containerStyle={{marginTop: 10}}
                        placeholder="Password*" 
                        placeholderTextColor={passwordRequire?'red':'gray'}
                        onChangeText={value => {
                            setPassword(value)
                            value == '' ? setPasswordRequire(true) : setPasswordRequire(false) 
                        }}
                        secureTextEntry={isPasswordSecure}
                        value={password}
                        rightIcon={<Icon name='eye' type='font-awesome' size={15} onPress={() => setIsPasswordSecure(!isPasswordSecure)}  />}
                    />
                    <Input inputContainerStyle={{borderRadius: 3, borderWidth: 1}}   
                        placeholder="Confirm Password*" 
                        placeholderTextColor={confirmRequire?'red':'gray'}
                        onChangeText={value => {
                            setConfirm(value)
                            value == '' ? setConfirmRequire(true) : setConfirmRequire(false) 
                        }}
                        secureTextEntry={isConfirmSecure}
                        value={confirm}
                        rightIcon={<Icon name='eye' type='font-awesome' size={15} onPress={() => setIsConfirmSecure(!isConfirmSecure)}  />}
                    />
                    
                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 10 }}>
                        <Button 
                            type='clear'
                            title={'Cancel'}
                            onPress={() => navigation.navigate('Settings')}
                        />
                        <ActivityIndicator 
                            animating={animating}
                            size="large"
                            color="dodgerblue"
                        />
                        <Button 
                            disabled={animating}
                            title={'Change'}
                            onPress={onPressChange}
                        />
                    </View>
                </View>
            </View>
            </TouchableWithoutFeedback>
        </View>
        
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