import {AsyncStorage} from 'react-native';

storeAllUserInfo = async(keyvaluepairs) => {
  try {
    await AsyncStorage.multiSet(keyvaluepairs, err => {
      console.log(err)
    });
  } catch (err) {
    console.log(err)
  }
}

removeAllUserInfo = async() => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(keys, err => {
      console.log(err)
    });
  } catch (err) {
    console.log(err)
  }
}

storeData = async(key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
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

removeData= async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.log(err);
  }
}

logout = async(navigate) =>{
  console.log(await AsyncStorage.getItem('fullname'))
  await removeAllUserInfo()
  navigate("LoginNavigator")
}

/**
 * 
 * let fullname = null
retrieveData('fullname').then(response => {
  fullname = response
});


logout(){
    removeData().then(response =>{
      console.log(response)
      this.props.navigation.navigate("LoginNavigator")
    })
  }

createUserAsyncStorage = async(userdata) => {
    try {
      await AsyncStorage.setItem('fullname', userdata.fullname)
      const fname = await AsyncStorage.getItem('fullname')
      console.log("Yess: "+fname)
    } catch (error) {
      console.log(error)
    }
  }
 */

