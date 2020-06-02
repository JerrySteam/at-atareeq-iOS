import React, { Component }  from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
//import { Container, Header, Content} from 'native-base';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
//import { Ionicons } from '@expo/vector-icons';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class SelectRoleScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      Impact: require('../../assets/fonts/impact.ttf'),
    });
    this.setState({ isReady: true });
  }

  static navigationOptions = {
    headerTransparent: true,
    headerTintColor: '#fff',
  };
  render(){
    const {navigate} = this.props.navigation;
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
      <ImageBackground 
        source={require('../../backgroundimage/index.png')} 
        style={styles.backgroundImage}
        blurRadius={1}>
        <View style={styles.appContainer}>
          {/*
          <Icon
            name="arrow-left" size={20} color="white" type='font-awesome'
            style= {{marginTop: wp('-12%'), marginLeft: wp('-83%')}}
            onPress={() => navigate('Index')} 
          />
          */}
          <Text style={styles.appTitle}>AT-TAREEQ</Text>
          <Text style={styles.appSubTitle}>Please Select Role</Text>
          <Button
            title="USER"
            titleStyle={styles.userButtonTitle}
            buttonStyle ={styles.userButton}
            onPress={() => navigate('UserSignup')}
          />
          <Button
            title="ADMIN"
            titleStyle={styles.adminButtonTitle}
            buttonStyle ={styles.adminButton}
            onPress={() => navigate('AdminSignup')}
          />
          <Button
            title="Go Back"
            type ="outline"
            titleStyle={styles.gobackButtonTitle}
            buttonStyle ={styles.gobackButton}
            onPress={() => navigate('Index')}
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
    marginTop:wp('-5%'),
  }, 
  appSubTitle:{
    fontSize: wp('5.56%'),
    color: '#fff',
    fontFamily: 'Helvetica Neue',
    marginTop: wp('25%')
  },
  userButtonTitle:{
    fontFamily:'Arial', 
    color:'#fff'
  },
  userButton: {
    borderRadius:wp('6.94%'), 
    width:wp('69.44%'),
    height: hp('8%'), 
    marginBottom:wp('6%'), 
    marginTop: wp('8%'),
    
  },
  adminButtonTitle:{
    fontFamily:'Arial', 
    color:'#fff',
  },
  adminButton:{
    backgroundColor: '#64a8e9',
    borderColor:'#fff', 
    borderRadius:wp('6.94%'), 
    width:wp('69.44%'),
    height: hp('8%'), 
    marginBottom:wp('6%'), 
    marginTop: wp('6%') 
  },
  gobackButtonTitle:{
    fontFamily:'Arial', 
    color:'#fff',
  },
  gobackButton:{
    borderColor:'#fff', 
    borderRadius:wp('6.94%'), 
    width:wp('35.44%'),
    height: hp('8%'), 
    marginBottom:wp('6%'), 
    marginTop: wp('6%') 
  }


});
