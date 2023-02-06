import { View, StyleSheet, ToastAndroid,Text } from 'react-native'
import React, { useState, useContext } from 'react'
import { Button, Dialog, Input, } from '@rneui/themed';
import { DataContext } from '../provider/DataProvider';
import { getDate } from './../api/common';
import { actionMsg } from './../api/actionMsg';
import { getMsgList } from './../api/getMsgList';
import { ActivityIndicator, TextInput } from 'react-native';

export default function ShowMessageScreen({route, navigation}) {
  const [animating, setAnimating] = useState(false);
  const {
    userToken: [userToken, setUserToken],
    user: [ user, setUser ],
    msgList: [msgList, setMsgList],
    serverurl: [serverurl, setServerurl],
  } = useContext(DataContext);

  const [dialogData, setDialogData] = useState({
    title: '',
    text: '',
    func: forceEscalateMsg
  })
  const [visibleConfirmDialog, setVisibleConfirmDialog] = useState(false);
  const toggleDialog = () => {
    setVisibleConfirmDialog(!visibleConfirmDialog);
  }

  const deleteMsg = async () => {
    ToastAndroid.showWithGravity('Deleting Message', ToastAndroid.SHORT, ToastAndroid.CENTER);
    const res = await actionMsg(serverurl, 'self', msg.id, userToken, '/delete');

    if(res.success)
    {
      setMsgList([]);
      navigation.navigate('MessageList');
    }
    else{
      ToastAndroid.showWithGravity('Delete Message Failed: ' + res.error, ToastAndroid.SHORT, ToastAndroid.CENTER);
    }
  }

  const acceptMsg = async () => {
    ToastAndroid.showWithGravity('Accepting Message', ToastAndroid.SHORT, ToastAndroid.CENTER);
    const res = await actionMsg(serverurl, 'self', msg.id, userToken, '/accept');

    if(res.success)
    {
      setMsgList([])
      navigation.navigate('MessageList');
    }
    else{
      ToastAndroid.showWithGravity('Accept Failed: ' + res.error, ToastAndroid.SHORT, ToastAndroid.CENTER);
    }
  }

  const forceEscalateMsg = async () => {
    ToastAndroid.showWithGravity('Force Escalating Message', ToastAndroid.SHORT, ToastAndroid.CENTER);
    const res = await actionMsg(serverurl, 'self', msg.id, userToken, '/escalate');

    if(res.success)
    {
      setMsgList([])
      navigation.navigate('MessageList');
    }
    else{
      ToastAndroid.showWithGravity('Force Escalating Failed: ' + res.error, ToastAndroid.SHORT, ToastAndroid.CENTER);
    }
  }
  const cancelAlarmMsg = async () => {
    ToastAndroid.showWithGravity('Canceling Alarm', ToastAndroid.SHORT, ToastAndroid.CENTER);
    const res = await actionMsg(serverurl, 'self', msg.id, userToken, '/cancel');

    if(res.success)
    {
      setMsgList([])
      navigation.navigate('MessageList');
    }
    else{
      ToastAndroid.showWithGravity('Canceling Alarm Failed: ' + res.error, ToastAndroid.SHORT, ToastAndroid.CENTER);
    }
  }

  const msg = route.params;
  return (
    <View style={{flex: 1, padding: 10}}>
      <View style={{flexDirection: 'row-reverse'}}>
        <Button
          type='clear'
          title="Close"
          color={'secondary'}
          icon={{
              name: 'close',
              type: 'font-awesome',
              size: 15,
              color: 'dodgerblue'
          }}
          iconContainerStyle={{ marginRight: 3 }}
          onPress={() => {setMsgList([]); navigation.navigate('MessageList')}}
        />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>{'From       '}</Text>
        <TextInput editable={false} style={{ color: 'black', paddingVertical: 5, fontSize: 18,borderColor: 'lightgray', borderRadius: 3, borderWidth: 1, flex: 7}} value={msg.from_user}  />
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>Received</Text>
        <TextInput editable={false} style={{ color: 'black',paddingVertical: 5, fontSize: 18,borderColor: 'lightgray', borderRadius: 3, borderWidth: 1, flex: 7}}  value={ getDate(new Date(msg.queue_time * 1000))} />
      </View>
      <Text style={styles.label}>Message</Text>
      <TextInput editable={false} style={{ color: 'gray',flex: 20, fontSize: 15, borderColor: 'lightgray', borderRadius: 3, borderWidth: 1}}   value={msg.message} multiline={true} textAlignVertical={'top'}/>
        {
          msg.priority && <Text style={styles.label}>
            This message was sent with <Text style={{color: '#f00'}}>High Priority!</Text>
          </Text>
        }
        
      <View style={styles.rowReverseContainer}>
        {
          msg.escalation_step > 0 && 
          <Button
          type='clear'
          title="Accept"
          icon={{
              name: 'check-square',
              type: 'font-awesome',
              size: 15,
              color: 'dodgerblue',
            }}
            onPress={() => {
              toggleDialog()
              setDialogData({
                title: 'Confirm Accept',
                text: 'Are you sure that you wish to accept this message?',
                func: acceptMsg
              }) 
            }}
            />
          }
        {
          (msg.escalation_step > 0 && user.allow_force_escalation) &&
          <Button
          type='clear'
          title="Escalate"
          icon={{
            name: 'corner-right-up',
            type: 'feather',
            size: 15,
            color: 'dodgerblue'
            }}
            iconContainerStyle={{marginRight: 1}}
            onPress={() => {
              toggleDialog()
              setDialogData({
                title: 'Confirm Escalate',
                text: 'Are you sure that you wish to escalate this message?',
                func: forceEscalateMsg
              }) 
            }}
            />
          }
          <Button
            title="Delete"
            type='clear'
            icon={{
              name: 'trash',
              type: 'font-awesome',
              size: 15,
              color: 'dodgerblue'
            }}
            onPress={() => {
              toggleDialog()
              setDialogData({
                title: 'Confirm Delete',
                text: 'Are you sure that you wish to delete this message?',
                func: deleteMsg
              }) 
            }}
            />
          {
            msg.from_user_id != 0 &&  
            <Button
              title="Reply"
              icon={{
                name: 'reply',
                type: 'octicons',
                size: 15,
                color: 'dodgerblue'
              }}
              type='clear'
              onPress={() => navigation.navigate('ReplyMessage', msg)}
            />
          }
        {
          ((msg.will_cancel || msg.will_reset ) && user.allow_cancel_alarm) &&
          <Button
          type='clear'
          title="Cancel"
            icon={{
              name: 'highlight-remove',
              type: 'material--icons',
              size: 15,
              color: 'dodgerblue'
            }}
            iconContainerStyle={{marginRight: 1}}
            containerStyle={{alignContent: 'center'}}
            onPress={() => {
              toggleDialog()
              setDialogData({
                title: 'Confirm Cancel',
                text: 'Are you sure that you wish to cancel the Alarm associated with this message?',
                func: cancelAlarmMsg
              }) 
            }}
          />
        }
      </View>
      <Dialog
        isVisible={visibleConfirmDialog}
        onBackdropPress={toggleDialog}
      >
        <Dialog.Title title={dialogData.title} titleStyle={{color: 'black'}}/>
        <Text style={{color: 'black'}}>
        {dialogData.text}
        </Text>

        <Dialog.Actions>
          <ActivityIndicator 
              animating={animating}
              size="large"
              color="dodgerblue"
          />
          <Dialog.Button
            title="CONFIRM"
            onPress={dialogData.func}
          />
          <Dialog.Button title="CANCEL" onPress={toggleDialog}  containerStyle={{ marginRight: 10}}/>
        </Dialog.Actions>
      </Dialog>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
      flexDirection: 'column'
  },
  rowContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10
  },
  columnContainer: {
    flexDirection: 'column',
    flex: 9
  },
  rowReverseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  label: {
    fontSize: 18,
    flex: 2,
    color: 'black'
  }
});
