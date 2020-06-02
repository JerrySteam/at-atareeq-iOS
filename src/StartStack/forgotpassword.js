import React, { Component }  from 'react';
import { StyleSheet, Text, View, ImageBackground, KeyboardAvoidingView } from 'react-native';
//import { Container, Header, Content} from 'native-base';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
//import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Divider, SocialIcon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

export default class ForgotPasswordScreen extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      email: '',
      isLoading: false,
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      Impact: require('../../assets/fonts/impact.ttf'),
    });
    this.setState({ isReady: true });
  }

  static navigationOptions = {
    title: 'Forgot password',
    headerTitleStyle: {
      fontSize: wp('6%'),
      color: '#fff'
    },
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
          source={require('../../backgroundimage/login.png')} 
          style={styles.backgroundImage}
          blurRadius={2}>
          <KeyboardAvoidingView style={styles.appContainer} behavior="padding" enabled>
            <Input
              placeholder='Please enter your email'
              placeholderTextColor = 'gray'
              leftIcon={{type: 'font-awesome', name:'envelope', size:wp('5%'), color:'gray' }}
              inputStyle={{color: '#fff', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'),}}
              containerStyle={{width: wp('83%'), marginTop:wp('14%')}}
              onChangeText={input => this.setState({ email: input })}
              value={this.state.email}
            />
            <Button
              title="SUBMIT"
              type={(this.state.email === '') ? 'outline' : 'solid'}
              titleStyle={styles.loginButtonTitle}
              buttonStyle ={styles.loginButton}
              loading={this.state.isLoading}
              disabled={this.state.isLoading}
              loadingProps={{ color: '#fff' }}
              onPress={() => this.resetPassword()}
            />
          </KeyboardAvoidingView>
        </ImageBackground>
    );
  }

  isValidEmail(email) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(email)) {
      return true
    } else {
      return false
    }
  }

  resetPassword = async () => {
    this.setState({ isLoading: true })
    const email = this.state.email.trim()

    if (email === "" || !this.isValidEmail(email)) {
      alert("Please enter a valid email address")
      this.setState({ isLoading: false })
    } else {
      const apiurl = global.url + 'resetpassword.php'
      const formData = new FormData()
      formData.append('email', email)
      formData.append('resetpassword', 'reset')

      try {
        const response = await fetch(apiurl, {
          //handle post data
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData
        });

        //const res = await response.text();
        //console.log(res)
        //this.setState({ isLoading: false })
        const res = await response.json();
        if (res.success) {
          alert(res.message)
          this.setState({ isLoading: false, email: '' })
          this.props.navigation.navigate('ResetPassword',{
            email: email,
          })
        } else {
          //console.log(res.message)
          alert(res.message);
          this.setState({ isLoading: false });
        }
      }
      catch (err) {
        return console.log(err);
      }
    }
  }

  
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage:{
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loginButtonTitle:{
    fontFamily:'Arial', 
    color:'#fff',
  },
  loginButton: {
    borderRadius:wp('6.94%'), 
    width:wp('65%'),
    height: hp('8%'),
    borderColor: 'gray',
    //backgroundColor: 'gray',
    //opacity: 0.4,
    marginVertical: wp('5%')  
  },
});
