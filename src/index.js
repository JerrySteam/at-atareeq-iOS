import React, { Component }  from 'react';
import { StyleSheet, Text, View, ImageBackground, AsyncStorage } from 'react-native';
//import { Container, Header, Content} from 'native-base';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
//import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-elements';
//import Icon from 'react-native-vector-icons/FontAwesome';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class IndexScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    await Font.loadAsync({
      Impact: require('../assets/fonts/impact.ttf'),
    });
    this.setState({ isReady: true });

    const loggedin = await AsyncStorage.getItem('RLGN');
    if (loggedin !== null) {
      this.props.navigation.navigate('MainDrawerNav');
    }  
  }
  
  render(){
    const {navigate} = this.props.navigation;
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
      <ImageBackground 
        source={require('../backgroundimage/index.png')} 
        style={styles.backgroundImage}
        blurRadius={1}>
        <View style={styles.appContainer}>
          <Text style={styles.appTitle}>AT-TAREEQ</Text>
          <Text style={styles.appSubTitle}>Find Lectures Close To You</Text>
          <Button
            title="LOGIN"
            titleStyle={styles.loginButtonTitle}
            buttonStyle ={styles.loginButton}
            onPress={() => navigate('LoginNavigator')}
          />
          <Text style={styles.appSubTitle}>or</Text>
          <Button
            type="outline"
            title="CREATE AN ACCOUNT"
            titleStyle={styles.createAccountButtonTitle}
            buttonStyle ={styles.createAccountButton}
            onPress={() => navigate('AccountNavigator')}
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    opacity: 0.8
  },
  backgroundImage:{
    flex: 1,
    width: '100%',
    height: '100%',
  },
  appTitle:{
    fontSize: wp('11.11%'),
    color: '#fff',
    fontFamily: 'Impact', //sans-serif-condensed
    marginBottom:wp('6%'),
  }, 
  appSubTitle:{
    fontSize: wp('5.56%'),
    color: '#fff',
    fontFamily: 'Helvetica',
    //fontFamily: 'Helvetica',
  },

  loginButtonTitle:{
    fontFamily:'Arial', 
    color:'#fff'
  },

  loginButton: {
    borderRadius:wp('6.94%'), 
    width:wp('69.44%'),
    height: hp('8%'), 
    marginBottom:wp('6%'), 
    marginTop: wp('35.67%'),
    
  },
  createAccountButtonTitle:{
    fontFamily:'Arial', 
    color:'#fff'
  },
  createAccountButton:{
    borderColor:'#fff', 
    borderRadius:wp('6.94%'), 
    width:wp('69.44%'), 
    height: hp('8%'),
    marginBottom:wp('2%'), 
    marginTop: wp('6%'),
    
  }


});
