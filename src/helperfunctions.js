import { AsyncStorage } from 'react-native';

let latitude = 0;
let longitude = 0;
storeAllUserInfo = async (keyvaluepairs) => {
  try {
    await AsyncStorage.multiSet(keyvaluepairs, err => {
      console.log(err)
    });
  } catch (err) {
    console.log(err)
  }
}

removeAllUserInfo = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys, err => {
      console.log(err)
    });
  } catch (err) {
    console.log(err)
  }
}
 
storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
    /* value = JSON.stringify(value)
    if (value) return await AsyncStorage.setItem(key, value)
    else console.log('not set, stringify failed:', key, value) */
  } catch (err) {
    console.log(err)
  }
}

retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value;
  } catch (err) {
    console.log(err)
  }
};

removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.log(err);
  }
}

logout = async (navigate) => {
  const accesstoken = await AsyncStorage.getItem('accesstoken');
  if (accesstoken !== 'NORMAL_1234') {
    await removeAllUserInfo();
  } else {
    const username = await AsyncStorage.getItem('RMEU');
    await removeAllUserInfo();
    await storeData('RMEU', username);
    //await AsyncStorage.setItem('RMEU', username);
  }
  navigate("LoginNavigator");
}

setlatlong = (latitude, longitude) => {
  this.latitude = latitude;
  this.longitude = longitude;
}

getlatlong = () => {
  return {
    "latitude": this.latitude,
    "longitude": this.longitude,
  }
}

