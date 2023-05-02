/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DataProvider } from './src/provider/DataProvider';
import WholeContainer from './src/container/WholeContainer';
import { createTheme, Text, ThemeProvider } from '@rneui/themed';
import { TextInput } from 'react-native';
import { useEffect } from 'react'; // added by KJR 
//import BackgroundTimer from 'react-native-background-timer';  
export default App = () => {
   
  // async function getPowerState () {
  //   const state = await DeviceInfo.getPowerState();
  //   if(state == 'unplugged') {
  //     BackgroundTimer.start(10000);
  //   }
  //   else{
  //     BackgroundTimer.stop();
  //   }
  // };
  // useEffect(()=>{
  //  getPowerState();
  // },[])

  const theme = createTheme({
    components: {
      Text: {
        fontSize: 21
      },
      TextInput: {
        fontSize: 19
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <DataProvider>
          <WholeContainer />  
        </DataProvider>
      </SafeAreaProvider>
    </ThemeProvider>
    
  )
}
