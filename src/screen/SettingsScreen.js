import { useState, useContext, useEffect } from 'react'
import { StyleSheet, View, ToastAndroid, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Text, Input, Button, Icon, CheckBox, Switch, Dialog } from '@rneui/themed';

import { DataContext } from '../provider/DataProvider';
import { logout } from './../api/logout';
import MMKV from '../store/MMKV';
import { navigationRef } from './../component/RootNavigation';
import PushNotification from 'react-native-push-notification';

export default function SettingsScreen({navigation}) {
  const [animating, setAnimating] = useState(false);

    const {
        userToken: [userToken, setUserToken],
        user: [ user, setUser ],
        serverurl: [serverurl, setServerurl],
        settings: [settings, setSettings]
    } = useContext(DataContext);

    useEffect(() => {
      onApplyChange()
    }, [settings])

    const [visibleConfirmDialog, setVisibleConfirmDialog] = useState(false);

    const toggleDialog = () => {
      setVisibleConfirmDialog(!visibleConfirmDialog);
    }
    const onLogout = async () => {
      setAnimating(true);
      const res = logout(serverurl, userToken);
      PushNotification.cancelAllLocalNotifications();
      setUserToken('');
      setUser({});
      MMKV.setStringAsync('token', '');
      MMKV.setMapAsync('user', {});
      navigationRef.current?.resetRoot({
          index: 0,
          routes: [{name: 'SignIn'}]
      })
      setAnimating(false);
    }
    const onApplyChange = () => {
      MMKV.setMapAsync('settings', settings)
    }

    const onCheckLimit = (value) => {
      const parsedValue = Number.parseInt(value)
      if (Number.isNaN(parsedValue)) {
        console.log('nan')
        setSettings({...settings, maxMessages:"1"});
      } else if (parsedValue > 99) {
        console.log('large')
        setSettings({...settings, maxMessages:"99"});
      } else {
        console.log('normal')
        setSettings({...settings, maxMessages:value})
      }
    }
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.formView}>
            
            <View style={styles.contentView}>
              <Text h4 h4Style={{fontSize: 22}} style={{textAlign: 'center', backgroundColor: '#e7eef8', padding: 10, borderColor: 'lightgray', borderWidth: 1}}>
                  Settings
              </Text>
              <View style={{margin: 10}}>
                <View style={styles.inputContainer}>
                  
                  <View style={{flex: 4}}>
                    <Text style={{fontSize: 15,marginBottom:25}}>Max messages to keep.</Text>  
                  </View>
                  <View style={{flex: 1}}>
                    <Input inputStyle={{ textAlign:'right', marginVertical:0, paddingVertical:0}} inputContainerStyle={{maxHeight:30, borderRadius: 3, borderWidth: 1, padding: 0}}   value={settings.maxMessages?settings.maxMessages:50} onChangeText={(value) => {
                      onCheckLimit(value)
                    }} 
                      inputMode='numeric' keyboardType='numeric' 
                    />
                  </View>
                </View>
                <View style={{...styles.inputContainer, marginTop: -20}}>
                  <Text style={{flex: 7}}>Detect phone numbers in messages for callback</Text>  
                  <Switch 
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={'dodgerblue'}
                    style={{flex: 1}}
                    value={settings.detectPhoneNumber}
                    onValueChange={(value) => {
                      setSettings({...settings, detectPhoneNumber:value})
                    }}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={{flex: 7}}>Play sound on new message</Text>  
                  <Switch 
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={'dodgerblue'}
                    style={{flex: 1}}
                    value={settings.playSoundOnNewMsg}
                    onValueChange={(value) => {
                      setSettings({...settings, playSoundOnNewMsg:value})
                    }}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={{flex: 7}}>Vibrate on new message</Text>  
                  <Switch 
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={'dodgerblue'}
                    style={{flex: 1}}
                    value={settings.vibrateOnNewMsg}
                    onValueChange={(value) => {
                      setSettings({...settings, vibrateOnNewMsg:value})
                    }}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={{flex: 7}}>Override phone silent mode for priority messages</Text>  
                  <Switch 
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={'dodgerblue'}
                    style={{flex: 1}}
                    value={settings.overrideSilentOnPriority}
                    onValueChange={(value) => {
                      setSettings({...settings, overrideSilentOnPriority:value})
                    }}
                  />
                </View>
                <View style={{...styles.inputContainer, marginTop: 20}}>
                  <Button type={'clear'}
                    containerStyle={{borderColor: 'lightgray', borderWidth: 1, width: 160}}
                    title="Change Password"
                    onPress={() => navigation.navigate('ChangePassword')}
                  />
                  <ActivityIndicator 
                      animating={animating}
                      size="large"
                      color="dodgerblue"
                  />
                  <Button 
                    disabled={animating}
                    containerStyle={{width: 160}}
                    title="LOG OUT"
                    onPress={toggleDialog}
                  />
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={{fontSize: 17}}>{`Current User: ${user.name}`}</Text>  
                </View>
                <Text style={{marginTop: 20}}>
                  App version: 1.0.0
                </Text>
              </View>
            </View>
             <Dialog
                isVisible={visibleConfirmDialog}
                onBackdropPress={toggleDialog}
              >
                <Dialog.Title title={'Confirm Logout'} titleStyle={{color: 'black'}}/>
                <Text style={{color: 'black'}}>
                Are you sure that you wish to logout?
                </Text>

                <Dialog.Actions>
                  <ActivityIndicator 
                      animating={animating}
                      size="large"
                      color="dodgerblue"
                  />
                  <Dialog.Button
                    title="CONFIRM"
                    onPress={onLogout}
                  />
                  <Dialog.Button title="CANCEL" onPress={toggleDialog}  containerStyle={{ marginRight: 10}}/>
                </Dialog.Actions>
              </Dialog>
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
        width: '100%'
    },
    formView: {
        backgroundColor: '#f1ebc9',
        flex: 1, 
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around'
    }
  });