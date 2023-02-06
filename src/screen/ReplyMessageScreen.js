import { View,  StyleSheet, ToastAndroid, Text, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { getRecipient } from './../api/getRecipient';
import { Button, CheckBox, Input } from '@rneui/themed';
import { postNewMsg } from '../api/postNewMsg';
import { DataContext } from '../provider/DataProvider';
import { getDate } from './../api/common';
import { TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';

export default function ReplyMessageScreen({ route, navigation }) {
  const [animating, setAnimating] = useState(false);
  const [content, setContent] = useState('');
  const [sendPriority, setSendPriority] = useState(false);
  const {
        msgList: [msgList, setMsgList],
        userToken: [userToken, setUserToken],
        serverurl: [serverurl, setServerurl]
    } = useContext(DataContext);
  
  const onPostMsg = async () => {
    const event = {
        text: content,
        priority: sendPriority ? 1 : 0,
        recipients: msg.from_user_id,
        reply_message_id: msg.id,
        tone: 'A'
    }
    setAnimating(true);
    const res = await postNewMsg(serverurl, 'self', event, userToken);
    if(res.success){
        setMsgList([]);
        ToastAndroid.showWithGravity('Reply Successfully!', ToastAndroid.SHORT, ToastAndroid.CENTER);
        navigation.navigate('MessageList');
    }
    else{
        ToastAndroid.showWithGravity('Reply failed.', ToastAndroid.SHORT, ToastAndroid.CENTER);
    }
    setAnimating(false);
  }

  const msg = route.params;
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.columnContainer}>
        <View style={{flexDirection: 'row-reverse',  }}>
            <Button
            type='clear'
            title="Close"
            icon={{
                name: 'close',
                type: 'font-awesome',
                size: 15,
                color: 'dodgerblue'
            }}
            iconContainerStyle={{ marginRight: 3 }}
            onPress={() => navigation.goBack()}
            />
        </View>
        <View style={styles.rowContainer}>
            <Text style={styles.label} >{'From       '}</Text>
            <TextInput editable={false} style={{color: 'gray', fontSize: 18, borderRadius: 3, borderWidth: 1,flex:7, borderColor: 'lightgray', paddingVertical: 5}}  value={msg.from_user} />
        </View>
        <View style={styles.rowContainer}>
            <Text style={styles.label} containerStyle={{flex:1}}>Received</Text>
            <TextInput editable={false}  style={{color: 'gray', fontSize: 18,borderRadius: 3, borderWidth: 1, flex:7, borderColor: 'lightgray', paddingVertical: 5}}  value={getDate(new Date(msg.queue_time * 1000))} />
        </View>
        <View  style={{flex: 10}}>
            <TextInput style={{color: 'black', fontSize: 17, height: '100%', borderRadius: 3, borderWidth: 1, borderColor: 'lightgray'}}   value={content} textAlignVertical={'top'} placeholderTextColor={'gray'}
                onChangeText={(value) => {setContent(value)}} placeholder='Type Your Reply Here...' multiline={true} />
        </View>
        
        <View style={styles.rowContainerSend}>
            <CheckBox 
                textStyle={{fontSize: 15}} 
                checked={sendPriority} 
                containerStyle={{backgroundColor: '#fafafa', marginHorizontal: 0, flex: 3}} 
                onPress={() => setSendPriority(!sendPriority)} 
                title={'Send as priority message'} 
            />
            <ActivityIndicator 
                animating={animating}
                size="large"
                color="dodgerblue"
            />
            <Button 
                title="Send"
                icon={{
                    name: 'paper-plane',
                    type: 'font-awesome',
                    size: 15,
                    color: 'white',
                }}
                titleStyle={{marginRight: 5}}
                onPress={onPostMsg}
                disabled={animating}
                containerStyle={{ flex: 1}}
            />
        </View>

        <Text style={styles.label}>Message</Text>
        <View style={{flex: 10}}>
            <TextInput style={{color: 'gray', fontSize: 15, height: '100%', borderRadius: 3, borderWidth: 1, borderColor: 'lightgray'}}  multiline={true}   value={msg.message} editable={false}  textAlignVertical='top'/>
        </View>
        {msg.priority && <Text style={styles.label}>
        This message was sent with <Text style={{color: '#f00'}}>High Priority!</Text>
        </Text>}
    </View>
    </TouchableWithoutFeedback>
  )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        flex: 1
    },
    rowContainerSend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    columnContainer: {
      flexDirection: 'column',
      flex: 1,
      padding: 10
    },
    label: {
        fontSize: 18,
        flex: 2,
        color: 'black'
    }
});
  