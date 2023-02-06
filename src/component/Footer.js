import { StyleSheet, View } from 'react-native';
import * as RootNavigation from './RootNavigation';
import { Button } from '@rneui/themed';
import { DataContext } from '../provider/DataProvider';
import { useContext } from 'react';
import { ToastAndroid } from 'react-native';

export default function Footer() {
  const {
    user: [ user, setUser ],
} = useContext(DataContext);
  return (
    <View style={styles.container}>
      <Button style={styles.button} type={'clear'}
        title="Inbox"
        icon={{
          name: 'inbox',
          type: 'font-awesome',
          size: 15,
          color: 'dodgerblue',
        }}
        iconContainerStyle={{ marginRight: 10 }}
        onPress={() => {
          if(!user.privileges.messaging)
          {
            ToastAndroid.showWithGravity('Messages : Permission Denied', ToastAndroid.SHORT, ToastAndroid.CENTER);
            return;
          }
          RootNavigation.navigate('MessageList')
        }}
      />
      <Button style={styles.button} type={'clear'}
        title="Alarms"
        icon={{
          name: 'clock-o',
          type: 'font-awesome',
          size: 15,
          color: 'dodgerblue',
        }}
        iconContainerStyle={{ marginRight: 10 }}
        onPress={() => {
          if(!user.privileges.manage_alarms)
          {
            ToastAndroid.showWithGravity('Alarms : Permission Denied', ToastAndroid.SHORT, ToastAndroid.CENTER);
            return;
          }
          RootNavigation.navigate('Alarms')
        }}
      />
      <Button style={styles.button} type={'clear'}
        title="Settings"
        icon={{
          name: 'gear',
          type: 'font-awesome',
          size: 15,
          color: 'dodgerblue',
        }}
        iconContainerStyle={{ marginRight: 10 }}
        onPress={() => {RootNavigation.navigate('Settings')}}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    textColor: '#333'
  },
  container: {
    display: 'flex',
    flexDirection: 'row', 
    justifyContent: 'space-around',
  }
});