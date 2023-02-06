import { View, StyleSheet, ToastAndroid, ActivityIndicator, TextInput } from 'react-native'
import React, { useState, useEffect, useContext, useRef, createRef } from 'react'
import { Button, CheckBox, Input } from '@rneui/themed';
import { getRecipientList } from '../api/getRecipientList';
import { postNewMsg } from './../api/postNewMsg';
import { DataContext } from '../provider/DataProvider';
import { TouchableWithoutFeedback, Keyboard, Text } from 'react-native';
import { ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
export default function NewMessageScreen({navigation}) {
  const [animating, setAnimating] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [content, setContent] = useState('');
  const [sendPriority, setSendPriority] = useState(false);
  const [searchText, setSearchText] = useState('');
  const {
    msgList: [msgList, setMsgList],
    userToken: [ userToken, setUserToken ],
    serverurl: [serverurl, setServerurl]
  } = useContext(DataContext);
  const ref = React.useRef();

  useEffect(() => {
    updateRecipients(searchText)
  }, [searchText])
  

  
  const updateRecipients = async (text) => {
    if(text == ''){
      return;
    }
    const res = await getRecipientList(serverurl, {
      filterField: 'name',
      filterValue: text 
    }, userToken);
    if(res.success){
      setRecipients(res.recipients);
    }
  }

  const addSelectedItem = (item) => {
    let flag = false;
    selectedItems.map(it => {
      if(it.id == item.id){
        flag = true;
      }
    });
    if(flag){
      ToastAndroid.showWithGravity(`${item.name} is already selected.`, ToastAndroid.SHORT, ToastAndroid.CENTER);
      return;
    }
    setSelectedItems([...selectedItems, item]);
  }

  const removeSelectedItem = (item) => {
    setSelectedItems(selectedItems.filter(it => 
      item.id != it.id
    ))
  }

  const displayRecipients = () => {
    return recipients.map(item => 
      (<Button onPress={() => addSelectedItem(item)} key={item.id} title={item.name} type='clear' titleStyle={{color:'gray'}} containerStyle={{marginRight: 10, borderRadius: 20, borderColor: 'gray', borderWidth: 1}}  />)
    )
  }

  const displaySelectedItems = () => {
    return selectedItems.map(item => 
      (<Button onPress={() => removeSelectedItem(item)} key={item.id} title={item.name} iconRight={true} icon={<Icon name="close" style={{fontSize: 15, marginLeft: 10}} color={'white'}  />}  containerStyle={{marginRight: 10, borderRadius: 20}}  />)
    )
  }

  const onPostMsg = async () => {
    if(selectedItems.length == 0) {
      ToastAndroid.showWithGravity('Please select recipients first.', ToastAndroid.SHORT, ToastAndroid.CENTER);
      return;
    }
    const event = {
      text: content,
      priority: sendPriority ? 1 : 0,
      recipients: selectedItems.map(item => item.id).join(','),
    }
    setAnimating(true);
    const res = await postNewMsg(serverurl, 'self', event, userToken);
    if(res.success){
      setMsgList([]);
      ToastAndroid.showWithGravity('Sent Successfully!', ToastAndroid.SHORT, ToastAndroid.CENTER);
      navigation.navigate('MessageList');
    }
    else {
      ToastAndroid.showWithGravity('Send New Message Failed with error: ' + res.error, ToastAndroid.SHORT, ToastAndroid.CENTER);

    }
    setAnimating(false)

  }
  return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.columnContainer}>
        <Text  style={{flex: 1, textAlign: 'center', fontSize: 25, color: 'black'}}>
          Send A Message
        </Text>
        <View style={{flex: 9, flexDirection: 'column', marginHorizontal: 10}}>
          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{flex: 2, fontSize: 18, color: 'black'}}>Search: </Text>
            <TextInput placeholderTextColor={'gray'} placeholder='Recipient Name' value={searchText} onChangeText={text =>  setSearchText(text)} style={{color: 'black',fontSize: 17, flex: 7, paddingVertical: 5, borderRadius: 3, borderWidth: 1, borderColor: 'lightgray'}} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', height: 50}}>
            <Text style={{flex: 2, fontSize: 18, color: 'black'}}>Select: </Text>
            
            <View style={{ flex: 7,flexDirection: 'row', flexWrap: 'nowrap', overflow: 'scroll'}}>
              <ScrollView horizontal={true} keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag'>
                {displayRecipients()}
              </ScrollView>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', height: 50}}>
            <Text style={{flex: 2, fontSize: 18, color: 'black'}}>To: </Text>
            
            <View style={{ flex: 7,flexDirection: 'row', flexWrap: 'nowrap', overflow: 'scroll'}}>
              {selectedItems.length ?
              (<ScrollView horizontal={true} keyboardShouldPersistTaps='handled' keyboardDismissMode='on-drag'>
                {displaySelectedItems()}
              </ScrollView>)
              : 
              (<Text style={{fontSize: 18, color: 'gray'}}>
                No one selected
              </Text>)
              }
            </View>
          </View>
          
          
          
          <Text style={{fontSize: 18, color: 'black'}}>
            Message*
          </Text>
          <View style={{flex: 3}}>
            <TextInput multiline={true} style={{color: 'black',fontSize: 17, height: '100%', borderRadius: 3, borderWidth: 1, borderColor: 'lightgray'}} textAlignVertical={'top'}  value={content}
              onChangeText={(value) => {setContent(value)}} />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CheckBox textStyle={{fontSize: 16}}  containerStyle={{backgroundColor: '#fafafa', marginRight: 0, marginLeft: 0,flex: 3}} checked={sendPriority} onPress={() => setSendPriority(!sendPriority)} title={'Send as priority message'} />
            <ActivityIndicator 
                animating={animating}
                size="large"
                color="dodgerblue"
            />
            <Button 
              icon={{
                  name: 'paper-plane',
                  type: 'font-awesome',
                  size: 15,
                  color: 'white',
              }}
              title="Send"
              titleStyle={{marginRight: 5}}
              onPress={onPostMsg}
              disabled={animating}
              containerStyle={{flex: 1}}
            />
          </View>
          
        </View>
    </View>
  </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
      flexDirection: 'column',
      flex: 1
  },
  rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  columnContainer: {
    flexDirection: 'column',
    flex: 1, 
    padding: 5,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5
  },
  rowReverseContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center'
  }
});
