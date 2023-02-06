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


export default App = () => {
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
