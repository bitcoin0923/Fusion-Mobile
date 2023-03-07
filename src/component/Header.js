import { useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNetInfo} from "@react-native-community/netinfo";
import { DataContext } from './../provider/DataProvider';

export default function Header() {
    const netInfo = useNetInfo();
    const {
        userToken: [ userToken, setUserToken ],
    } = useContext(DataContext);
    return (
        <LinearGradient
            colors={['#6a90c1', '#a7cff3']}
            start={{ x: 1, y: 0.5 }}
            end={{ x: 0, y: 0.5 }}
        >
            <View style={styles.container}>
                <View>
                    <Text style={userToken != '' ? styles.title: styles.titleAlone}>
                        Fusion Mobile
                    </Text>
                    {
                        userToken != '' &&
                        (
                            (netInfo.isInternetReachable && netInfo.isConnected) ? 
                            <View style={styles.containerMinor}>
                                <Image source={{uri: 'asset:/wifi_on.png'}} style={styles.imgWifi} />
                                <Text style={{color: 'green', fontSize: 10}}>Connected</Text>                    
                            </View> : 
                            <View style={styles.containerMinor}>
                                <Image source={{uri: 'asset:/wifi_off.png'}} style={styles.imgWifi} />
                                <Text style={{color: 'red', fontSize: 10}}>Not Connected!</Text>                    
                            </View>
                        )
                        
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
    containerMinor: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 13,
        marginTop: 5
    },
    title: {
        textAlign: 'left',
        color: 'white',
        marginLeft: 10,
        fontSize: 24,
        marginTop: 10,
        marginBottom: -5
    },
    titleAlone: {
        textAlign: 'left',
        color: 'white',
        marginLeft: 10,
        fontSize: 24,
    },
    img: {
        height: 60,
        width: 84
    },
    imgWifi: {
        height: 12,
        width: 12,
        marginRight: 5
    }
});