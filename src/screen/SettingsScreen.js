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
    } = useContext(DataContext);


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

    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.formView}>
            
            <View style={styles.contentView}>
              <Text h4 h4Style={{fontSize: 22}} style={{textAlign: 'center', backgroundColor: '#e7eef8', padding: 10, borderColor: 'lightgray', borderWidth: 1}}>
                  Settings
              </Text>
              <View style={{margin: 10}}>
                
                <View style={{marginTop: 10}}>
                  <Text style={{fontSize: 17}}>{`Current User: ${user.name}`}</Text>  
                </View>
                <View style={{...styles.inputContainer, marginTop: 20}}>
                  <Button type={'clear'}
                    containerStyle={{borderColor: 'lightgray', borderWidth: 1, width: 160}}
                    title="Change Password"
                    onPress={() => navigation.navigate('ChangePassword')}
                  />
                </View>
                <View style={{...styles.inputContainer, marginTop: 20}}>
                  <Button 
                    disabled={animating}
                    containerStyle={{width: 160}}
                    title="LOG OUT"
                    onPress={toggleDialog}
                  />
                  <ActivityIndicator 
                      animating={animating}
                      size="large"
                      color="dodgerblue"
                  />
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
      justifyContent: 'flex-start',
      marginLeft: 10
    }
  });