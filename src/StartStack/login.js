import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, AsyncStorage, Switch, Alert } from 'react-native';
//import { Container, Header, Content} from 'native-base';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
//import { Ionicons } from '@expo/vector-icons';
import { Button, Input, SocialIcon, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Divider from 'react-native-divider';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      username: '',
      password: '',
      isLoading: false,
      rememberMe: false,
      loggedIn: false,
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      Impact: require('../../assets/fonts/impact.ttf'),
    });
    const username = await this.getRememberedUser();
    const loggedin = await this.getKeepLoggedin();
    this.setState({
      isReady: true,
      username: username || "",
      rememberMe: username ? true : false
    });
    if (loggedin) {
      this.props.navigation.navigate('MainDrawerNav');
    }
  }
  static navigationOptions = {
    header: null
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
        <Icon
          name="arrow-left" size={20} color="white"
          style={{ marginTop: wp('12.5%'), marginLeft: wp('5%') }}
          onPress={() => navigate('Index')}
        />
        <View style={styles.appContainer}>
          <Text style={styles.appSubTitle}>Log into your account</Text>
          <Input
            placeholder='Email/Phone No'
            placeholderTextColor = 'gray'
            leftIcon={{ type: 'font-awesome', name: 'user', size: wp('7%'), color: 'gray' }}
            inputStyle={{ color: '#fff', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
            containerStyle={{ width: wp('83%'), marginTop: wp('16%') }}
            onChangeText={input => this.setState({ username: input })}
            value={this.state.username}
          />
          <Input
            placeholder='Password'
            placeholderTextColor = 'gray'
            secureTextEntry={true}
            leftIcon={{ type: 'font-awesome', name: 'lock', size: wp('7%'), color: 'gray' }}
            inputStyle={{ color: '#fff', paddingHorizontal: wp('2%'), fontSize: wp('4.5%') }}
            containerStyle={{ width: wp('83%'), marginVertical: wp('6%'), }}
            onChangeText={input => this.setState({ password: input })}
            value={this.state.password}
          />
          <View style={{ flexDirection: "row" }}>
            <CheckBox
              title='Remember me'
              checked={this.state.rememberMe}
              onPress={() => this.toggleRememberMe(!this.state.rememberMe)}
              containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
              checkedColor="#fff"
              uncheckedColor="#fff"
              textStyle={{ color: '#fff' }}
            />
            <CheckBox
              title='Keep me logged in'
              checked={this.state.loggedIn}
              onPress={() => this.toggleKeepLoggedin(!this.state.loggedIn)}
              containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
              checkedColor="#fff"
              uncheckedColor="#fff"
              textStyle={{ color: '#fff' }}
            />
          </View>
          <Button
            title="LOGIN"
            type={(this.state.username === '' || this.state.password === '') ? 'outline' : 'solid'}
            loading={this.state.isLoading}
            disabled={this.state.isLoading}
            loadingProps={{ color: '#000' }}
            titleStyle={styles.loginButtonTitle}
            buttonStyle={styles.loginButton}
            onPress={() => this.login()}
          />
          <Button
            title="Forgot Password?"
            type="clear"
            titleStyle={styles.forgotPassword}
            onPress={() => navigate('ForgotPassword')}
          />
          <Divider orientation="center" borderColor="gray">
            <Text style={styles.socialSignIn}>Social Sign In</Text>
          </Divider>

          <View style={{ flexDirection: "row", marginTop: wp('4%') }}>
            <SocialIcon
              type='facebook'
              onPress={() => this.handleFacebookLogin()}
            />
            <SocialIcon
              type='google'
              onPress={() => this.signInWithGoogleAsync()}
            />
            {/**  
            <SocialIcon
              type='twitter'
            />
            <SocialIcon
              type='linkedin'
            />
             */}

          </View>
        </View>
      </ImageBackground>
    );
  }

  login = async () => {
    this.setState({ isLoading: true })

    let username = this.state.username
    let password = this.state.password
    if (username.trim() === "" || password.trim() === "") {
      alert("All fields are required")
      this.setState({ isLoading: false })
    } else {
      const apiurl = global.url + 'login.php'
      try {
        const response = await fetch(apiurl, {
          //handle post data
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: 'login',
            username: username,
            password: password,
          })
        });
        const res = await response.json();

        if (res.success) {
          const user = res.message[0];
          await storeData('accesstoken', 'NORMAL_1234');
          await storeData('userid', user.userid.toString());
          await storeData('fullname', user.fullname);
          await storeData('displayname', user.displayname);
          await storeData('phone', user.phone);
          await storeData('email', user.email);
          await storeData('location', user.location);
          await storeData('photourl', user.photourl);
          await storeData('roleid', user.roleid.toString());
          this.setState({ isLoading: false })
          this.props.navigation.navigate('MainDrawerNav');
        }
        else {
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

  toggleRememberMe = value => {
    this.setState({ rememberMe: value })
    if (value === true) {
      this.rememberUser();
    } else {
      this.forgetUser();
    }
  }

  rememberUser = async () => {
    try {
      //await AsyncStorage.setItem('RMEU', this.state.username);
      await storeData('RMEU', this.state.username);
      console.log(await AsyncStorage.getItem('RMEU'));
    } catch (error) {
      // Error saving data
    }
  };

  getRememberedUser = async () => {
    try {
      const username = await AsyncStorage.getItem('RMEU');
      if (username !== null) {
        // We have username!!
        return username;
      }
    } catch (error) {
      console.log(error)
      // Error retrieving data
    }
  };

  forgetUser = async () => {
    try {
      await AsyncStorage.removeItem('RMEU');
    } catch (error) {
      // Error removing
    }
  };

  toggleKeepLoggedin = value => {
    this.setState({ loggedIn: value })
    if (value === true) {
      this.keepLoggedin();
    } else {
      this.forgetLoggedin();
    }
  }

  keepLoggedin = async () => {
    try {
      //await AsyncStorage.setItem('RLGN', this.state.username);
      await storeData('RLGN', this.state.username);
      console.log(await AsyncStorage.getItem('RLGN'));
    } catch (error) {
      // Error saving data
    }
  };

  getKeepLoggedin = async () => {
    try {
      const loggedin = await AsyncStorage.getItem('RLGN');
      if (loggedin !== null) {
        // We have username!!
        return loggedin;
      }
    } catch (error) {
      console.log(error)
      // Error retrieving data
    }
  };

  forgetLoggedin = async () => {
    try {
      await AsyncStorage.removeItem('RLGN');
    } catch (error) {
      // Error removing
    }
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: '270580670630-2mbc4h600q94cieu5ffrmigieph9rsej.apps.googleusercontent.com',
        androidStandaloneAppClientId: '270580670630-4obsijgkfn3inm9n7htp91vgffqcfpej.apps.googleusercontent.com',
        iosClientId: '270580670630-afghs82ataduqvadjohbpguier0ngrup.apps.googleusercontent.com',
        iosStandaloneAppClientId:'270580670630-3kgt55rm71d2bf0qmfkruf66dt5k8cg1.apps.googleusercontent.com',
        scopes: ['profile', 'email'], 
      });

      if (result.type === 'success') {
        this.setState({ isReady: false });
        const user = result.user;
        await storeData('accesstoken', result.accessToken);
        await storeData('userid', user.id);
        await storeData('fullname', user.name);
        await storeData('displayname', user.givenName);
        await storeData('phone', '');
        await storeData('email', user.email);
        await storeData('location', '');
        await storeData('photourl', user.photoUrl);
        await storeData('roleid', '1');
        this.setState({ isReady: true })
        this.props.navigation.navigate('MainDrawerNav');
      } else {
        console.log('cancelled');
      }
    } catch (e) {
      console.log('error ', e)
    }
  }

  handleFacebookLogin = async () => {
    try {
      await Facebook.initializeAsync('2686580851427611');
      const { type, token } = await Facebook.logInWithReadPermissionsAsync(
        '2686580851427611', // Replace with your own app id in standalone app
        {permissions: ['public_profile', 'email']}
      );

      switch (type) {
        case 'success': {
          // Get the user's name using Facebook's Graph API
          const response = await fetch(`https://graph.facebook.com/me?fields=id,name,first_name,last_name,email,picture,short_name&access_token=${token}`);
          const profile = await response.json();
          console.log(profile);
          await storeData('accesstoken', token);
          await storeData('userid', profile.id);
          await storeData('fullname', profile.name);
          await storeData('displayname', profile.short_name);
          await storeData('phone', '');
          await storeData('email', profile.email);
          await storeData('location', '');
          await storeData('photourl', profile.picture.data.url);
          await storeData('roleid', '1');
          this.props.navigation.navigate('MainDrawerNav');

          // Alert.alert(
          //   'Logged in!',
          //   `Hi ${profile.name}!`,
          // );
          break;
        }
        case 'cancel': {
          Alert.alert(
            'Cancelled!',
            'Login was cancelled!',
          );
          break;
        }
        default: {
          Alert.alert(
            'Oops!',
            'Login failed!',
          );
        }
      }
    } catch (e) {
      //alert(e)
      console.log(e)
    }
  };
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
  appTitle: {
    fontSize: wp('11.11%'),
    color: '#fff',
    fontFamily: 'Impact', //sans-serif-condensed
    marginTop: wp('-35%'),
  },
  appSubTitle: {
    fontSize: wp('6%'),
    color: '#fff',
    fontFamily: 'Helvetica Neue',
    marginTop: wp('-25%')
  },
  loginButtonTitle: {
    fontFamily: 'Arial',
    color: '#fff',
  },
  loginButton: {
    borderRadius: wp('6.94%'),
    width: wp('65%'),
    height: hp('8%'),
    marginVertical: wp('4%'),
    borderColor: 'gray',
    //backgroundColor: 'gray',
    //opacity: 0.4, 
  },
  forgotPassword: {
    fontSize: wp('4%'),
    color: '#fff',
    fontFamily: 'Arial',
    marginBottom: wp('6%'),
  },
  socialSignIn: {
    fontSize: wp('3%'),
    color: '#fff',
    fontFamily: 'Arial',
  },
});
