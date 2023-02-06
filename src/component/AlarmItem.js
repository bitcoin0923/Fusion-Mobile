import { View,  StyleSheet } from 'react-native'
import { getDate, limitStringLength } from '../api/common'
import { durationToHHMMSS } from './../api/common';
import { cancelAlarm } from './../api/cancelAlarm';
import { DataContext } from './../provider/DataProvider';
import { useContext } from 'react';
import { Button, Text } from '@rneui/themed';

export default function AlarmItem({alarm, onCancel}) {
  const {
    userToken: [ userToken, setUserToken ],
    user: [ user, setUser ],
    serverurl: [serverurl, setServerurl],
  } = useContext(DataContext);
 
  return (
    <View style={{
      borderLeftColor: alarm.priority ? 'red' : '#fafafa',
      borderLeftWidth: 10,
      borderBottomWidth: 1,
      borderRadius: 4,
      borderBottomColor: 'lightgray',
      padding: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <View style={{flex: 5}}>
        <View style={styles.bottomView}>
          <Text style={{fontSize:20}}>
            {alarm.name}
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>
            {alarm.recipient_name + '  '}
          </Text>
          <Text>
            {alarm.source_gateway_name}
          </Text>
        </View>

        <View style={styles.bottomView}>
          <Text>
            { getDate(new Date(alarm.active_time * 1000)) } {' '}
          </Text>
          <Text>
            duration: {durationToHHMMSS(Math.floor(alarm.active_duration))}
          </Text>
        </View>
        <View style={styles.bottomView}>
          <Text>
            read: {alarm.total_messages_read}/{alarm.total_messages} {' '}
          </Text>
          <Text>
            sent: {alarm.total_messages_sent}/{alarm.total_messages}
          </Text>
        </View>
      </View>  
      
      
      
      <View style={{flex: 2}}>
        {
          user.allow_cancel_alarm && 
          <Button 
            type='clear'
            title={'Cancel'}
            onPress={() => onCancel(alarm.id, alarm.name)}
          />
        }
        
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    numberOfLines: 1
  },
  bottomView: {
    flexDirection: 'row'
  }
})