import { useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNetInfo} from "@react-native-community/netinfo";
import { DataContext } from './../provider/DataProvider';

export default function Header() {
    const netInfo = useNetInfo();

    return (
        <LinearGradient
            colors={['#6a90c1', '#a7cff3']}
            start={{ x: 1, y: 0.5 }}
            end={{ x: 0, y: 0.5 }}
        >
            <View style={styles.container}>
                <View>
                    <Text style={styles.title}>
                        Fusion Mobile
                    </Text>
                    {
                        !(netInfo.isInternetReachable && netInfo.isConnected) && 
                        <View style={styles.container}>
                            <Text style={{color: 'red'}}>You are not connected to network</Text>                    
                        </View>    
                    }
                </View>
                <Image source={{uri: 'asset:/logo.png'}} style={styles.img} />
            </View>    
            
            
        </LinearGradient>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        textAlign: 'left',
        color: 'white',
        marginLeft: 10,
        fontSize: 25
    },
    img: {
        height: 60,
        width: 84
    }
});