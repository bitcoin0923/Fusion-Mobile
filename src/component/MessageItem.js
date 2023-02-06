import { View,  StyleSheet } from 'react-native'
import { getDate, limitStringLength } from '../api/common'
import { Text } from '@rneui/themed';


export default function MessageItem({msg}) {
  const strLenth = [50, 50, 80, 100];
  return (
    <View style={{
      borderLeftColor: msg.priority ? 'red' : '#fafafa',
      borderLeftWidth: 10,
      borderBottomWidth: 1,
      borderRadius: 4,
      borderBottomColor: 'lightgray',
      height: 70,
      padding: 5,
    }}>
      <Text numberOfLines={1} style={{
        fontSize: 15,  
        fontWeight: msg.status == 4 ? "bold" : "",
      }}>
        {limitStringLength(msg.message.replace('\n', ' '), 25)}
      </Text>
      <Text>{' '}</Text>
      <View style={styles.bottomView}>
        <Text style={{position: 'absolute', left: 0}}>
          { getDate(new Date(msg.queue_time * 1000)) }
        </Text>
        {
          msg.status == 4 && (
          <Text style={{
            color: 'lawngreen',
            position: 'absolute',
            right: 0
          }}>
            {'New!'}
          </Text>
          )
        }
        {
          msg.status == 5 && (
          <Text style={{
            color: 'gray',
            position: 'absolute',
            right: 0
          }}>
            {'Read'}
          </Text>
          )
        }
        
        
        {
          msg.status == 6 && (
            <Text style={{
              color: 'purple',
              position: 'absolute',
              right: 0
            }}>
              Escalated!
            </Text>
          )
        }
        {
          msg.status == 7 && (
            <Text style={{
              color: 'gray',
              position: 'absolute',
              right: 0
            }}>
              Acknowledged
            </Text>
          )
        }
        {
          msg.escalation_step > 0 && (
            <Text style={{
              fontWeight: msg.status == 4 ? 'bold': '', 
              color: 'red',
              position: 'absolute',
              right: strLenth[msg.status - 4]
            }}>
              Escalation
            </Text>
          )
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
    display: 'flex',
    flexDirection: 'row'
  }
})