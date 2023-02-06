import MMKVStorage from 'react-native-mmkv-storage';

class MMKV {
    constructor() {
        this.instance = new MMKVStorage.Loader().withEncryption();
        this.MMKV = null;
    }

    initialize = () => {
        this.MMKV = this.instance.initialize();
    };

    setStringAsync = async (name, value) => {
        return this.MMKV.setStringAsync(name, value);
    };

    getStringAsync = async (name) => {
        return this.MMKV.getStringAsync(name);
    };

    setMapAsync = async (name, value) => {
        return this.MMKV.setMapAsync(name, value);
    };

    getMapAsync = async (name) => {
        return this.MMKV.getMapAsync(name);
    };
}

export default new MMKV();