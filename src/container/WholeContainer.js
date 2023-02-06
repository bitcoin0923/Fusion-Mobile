import React, { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { DefaultTheme, NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MessageListScreen from './../screen/MessageListScreen';
import NewMessageScreen from './../screen/NewMessageScreen';
import ShowMessageScreen from './../screen/ShowMessageScreen';
import ReplyMessageScreen from '../screen/ReplyMessageScreen';
import AlarmsScreen from '../screen/AlarmsScreen';
import SettingsScreen from '../screen/SettingsScreen';
import SignInScreen from '../screen/SignInScreen';
import Footer from '../component/Footer';
import Header from '../component/Header';
import { DataContext } from './../provider/DataProvider';
import { navigationRef } from './../component/RootNavigation';
import PasswordChangeScreen from './../screen/PasswordChangeScreen';

const Stack = createNativeStackNavigator()

export default function WholeContainer() {
    const MyTheme = {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: 'rgb(250, 250, 250)',
        },
      };
    const {
        userToken: [ userToken, setUserToken ],
        serverurl: [ serverurl, setServerurl]
    } = useContext(DataContext);

    
    
    

    

    return (
        <View  style={{flex: 1}}>
            <View style={{ margin: 0}}>
                <Header />
            </View>
            <View style={{
                flex: 12, 
                borderWidth: 8,
                borderColor: '#f1ebc9',
                backgroundColor: '#f1ebc9'
            }}>
                <NavigationContainer ref={navigationRef} theme={MyTheme}>
                    <Stack.Navigator screenOptions={{
                        headerShown: false
                    }}>  
                        <Stack.Screen name="SignIn" component={SignInScreen} />
                        <Stack.Screen name="MessageList" component={MessageListScreen} />
                        <Stack.Screen name="NewMessage" component={NewMessageScreen} />
                        <Stack.Screen name="ShowMessage" component={ShowMessageScreen} />
                        <Stack.Screen name="Alarms" component={AlarmsScreen} />
                        <Stack.Screen name="ReplyMessage" component={ReplyMessageScreen} />
                        <Stack.Screen name="Settings" component={SettingsScreen} />
                        <Stack.Screen name="ChangePassword" component={PasswordChangeScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
            {
                userToken != '' ? 
                <View  style={{ margin: 0, flex: 1, backgroundColor: '#fafafa'}}>
                    <Footer />
                </View> :
                <View  style={{ margin: 0, flex: 1, backgroundColor: '#f1ebc9'}}>
                </View>
            }
        </View>
        
    )
}
