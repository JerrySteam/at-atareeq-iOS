import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, KeyboardAvoidingView, ScrollView } from 'react-native';
//import { Container, Header, Content} from 'native-base';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
//import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Divider, SocialIcon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default class ResetPasswordScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      isReady: false,
      email: navigation.getParam('email', 'NO-Email'),
      token: '',
      password: '',
      cpassword: '',
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
  render() {
    const { navigate } = this.props.navigation;
    if (!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <ImageBackground
        source={require('../../backgroundimage/login.png')}
        style={styles.backgroundImage}
        blurRadius={2}>
        <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={20}>
          <ScrollView contentContainerStyle={{ alignItems: "center", paddingVertical: wp('12%') }}>
            <Input
              placeholder='Code sent to your email'
              placeholderTextColor='gray'
              leftIcon={{ type: 'font-awesome', name: 'envelope', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#fff', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('83%'), marginTop: wp('14%') }}
              onChangeText={input => this.setState({ token: input })}
              value={this.state.token}
            />
            <Input
              placeholder='New Password'
              placeholderTextColor='gray'
              secureTextEntry={true}
              leftIcon={{ type: 'font-awesome', name: 'envelope', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#fff', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('83%'), marginTop: wp('14%') }}
              onChangeText={input => this.setState({ password: input })}
              value={this.state.password}
              errorStyle={{ color: '#fff' }}
              errorMessage='Minimum of 6 characters'
              rightIcon ={
                (this.state.password !== "") ?
                  (this.state.password.length >= 6) ? { type: 'font-awesome', name: 'check-circle', size: wp('5%'), color: '#42DB50'}: { type: 'font-awesome', name: 'times-circle', size: wp('5%'), color: '#F84127'}
                : null}
            />
            <Input
              placeholder='Confirm New Password'
              placeholderTextColor='gray'
              secureTextEntry={true}
              leftIcon={{ type: 'font-awesome', name: 'envelope', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#fff', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('83%'), marginTop: wp('14%') }}
              onChangeText={input => this.setState({ cpassword: input })}
              value={this.state.cpassword}
              rightIcon ={
                (this.state.password !== "" && this.state.cpassword !== "") ?
                  (this.state.password===this.state.cpassword) ? { type: 'font-awesome', name: 'check-circle', size: wp('5%'), color: '#42DB50'}: { type: 'font-awesome', name: 'times-circle', size: wp('5%'), color: '#F84127'}
                : null}
            />
            <Button
              title="SUBMIT"
              type='outline'
              titleStyle={styles.loginButtonTitle}
              buttonStyle={styles.loginButton}
              loading={this.state.isLoading}
              disabled={this.state.isLoading}
              loadingProps={{ color: '#fff' }}
              onPress={() => this.resetPassword()}
            />
          </ScrollView>
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
    const token = this.state.token.trim()
    const password = this.state.password.trim()
    const cpassword = this.state.cpassword.trim()

    if (email === "" || !this.isValidEmail(email)) {
      this.props.navigation.navigate('ForgotPassword')
      this.setState({ isLoading: false })
    } else if (token === "" || password === "" || cpassword === "") {
      alert("All fields are required")
      this.setState({ isLoading: false })
    } else if (password.length < 6) {
      alert("Password must be minimum 6 characters")
      this.setState({ isLoading: false })
    } else if (password !== cpassword) {
      alert("Password do not match")
      this.setState({ isLoading: false })
    } else {
      const apiurl = global.url + 'resetpassword.php'
      const formData = new FormData()
      formData.append('email', email)
      formData.append('token', token)
      formData.append('password', password)
      formData.append('cpassword', cpassword)
      formData.append('newpassword', 'reset')

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
          this.setState({ isLoading: false, email: '', token: '', password: '', cpassword: '' })
          this.props.navigation.navigate('Login')
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
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loginButtonTitle: {
    fontFamily: 'Arial',
    color: '#fff',
  },
  loginButton: {
    borderRadius: wp('6.94%'),
    width: wp('65%'),
    height: hp('8%'),
    borderColor: 'gray',
    backgroundColor: 'gray',
    opacity: 0.4,
    marginVertical: wp('5%')
  },
});
