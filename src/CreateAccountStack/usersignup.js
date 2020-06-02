import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, KeyboardAvoidingView, ScrollView, Alert} from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Button, Input, SocialIcon, Avatar } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Divider from 'react-native-divider';
import * as ImagePicker from 'expo-image-picker';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
import * as Permissions from 'expo-permissions';

export default class UserSignupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      fullname: '',
      phone: '',
      email: '',
      location: '',
      password: '',
      cpassword: '',
      isLoading: false,
      photourl: '',
    };
  }
  async componentDidMount() {
    await Font.loadAsync({
      Impact: require('../../assets/fonts/impact.ttf'),
    });
    this.setState({ isReady: true });
  }

  static navigationOptions = {
    title: 'User Sign Up',
    headerTitleStyle: {
      fontSize: wp('4%'),
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
            <Avatar
              size="xlarge"
              rounded
              showEditButton
              icon={{ name: 'user', type: 'font-awesome' }}
              source={{ uri: this.state.photourl }}
              onPress={() => this.selectPhoto()}
              onEditPress={() => this.selectPhoto()}
              activeOpacity={0.7}
              containerStyle={{ marginTop: wp('15%') }}
            />
            <Button
              title="Delete Photo"
              type="clear"
              titleStyle={{ color: '#fff' }}
              onPress={() => this.deletePhoto()}
            />
            <Input
              placeholder='Name'
              placeholderTextColor='gray'
              leftIcon={{ type: 'font-awesome', name: 'user', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#fff', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('4%') }}
              onChangeText={input => this.setState({ fullname: input })}
              value={this.state.fullname}
            />
            <Input
              placeholder='Phone Number'
              placeholderTextColor='gray'
              keyboardType='numeric'
              maxLength={20}
              leftIcon={{ type: 'font-awesome', name: 'phone', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#fff', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('5%') }}
              onChangeText={input => this.setState({ phone: input })}
              value={this.state.phone}
            />
            <Input
              placeholder='Email (optional)'
              placeholderTextColor='gray'
              leftIcon={{ type: 'font-awesome', name: 'envelope', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#fff', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('5%') }}
              onChangeText={input => this.setState({ email: input })}
              value={this.state.email}
            />
            <Input
              placeholder='Location'
              placeholderTextColor='gray'
              leftIcon={{ type: 'font-awesome', name: 'map-pin', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#fff', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('5%') }}
              onChangeText={input => this.setState({ location: input })}
              value={this.state.location}
            />
            <Input
              placeholder='Password'
              placeholderTextColor='gray'
              secureTextEntry={true}
              leftIcon={{ type: 'font-awesome', name: 'lock', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#fff', paddingHorizontal: wp('2%'), fontSize: wp('4.5%') }}
              containerStyle={{ width: wp('95%'), marginTop: wp('4%'), }}
              onChangeText={input => this.setState({ password: input })}
              value={this.state.password}
              errorStyle={{ color: '#fff' }}
              errorMessage='Minimum of 6 characters'
              rightIcon={
                (this.state.password !== "") ?
                  (this.state.password.length >= 6) ? { type: 'font-awesome', name: 'check-circle', size: wp('5%'), color: '#42DB50' } : { type: 'font-awesome', name: 'times-circle', size: wp('5%'), color: '#F84127' }
                  : null}
            />
            <Input
              placeholder='Confirm Password'
              placeholderTextColor='gray'
              secureTextEntry={true}
              leftIcon={{ type: 'font-awesome', name: 'lock', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#fff', paddingHorizontal: wp('2%'), fontSize: wp('4.5%') }}
              containerStyle={{ width: wp('95%'), marginTop: wp('3%'), }}
              onChangeText={input => this.setState({ cpassword: input })}
              value={this.state.cpassword}
              rightIcon={
                (this.state.password !== "" && this.state.cpassword !== "") ?
                  (this.state.password === this.state.cpassword) ? { type: 'font-awesome', name: 'check-circle', size: wp('5%'), color: '#42DB50' } : { type: 'font-awesome', name: 'times-circle', size: wp('5%'), color: '#F84127' }
                  : null}
            />

            <Button
              title="SUBMIT"
              titleStyle={styles.loginButtonTitle}
              buttonStyle={styles.loginButton}
              loading={this.state.isLoading}
              disabled={this.state.isLoading}
              loadingProps={{ color: '#000' }}
              //icon={{name: "location-arrow", size: wp('5%'), color: "white"}}
              onPress={() => this.createAccount()}
            />

            <Divider orientation="center" borderColor="gray">
              <Text style={styles.socialSignIn}>Continue with</Text>
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
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }

  selectPhoto = async () => {
    const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 4],
        quality: 1
      });
  
      console.log("Image Picker Log: " + result.uri);
  
      if (!result.cancelled) {
        this.setState({ photourl: result.uri });
      } else {
        this.setState({ photourl: '' });
      }
    } else {
      console.log('Camera permission not granted');
      this.setState({ photourl: '' });
    }
  }

  createAccount = async () => {
    this.setState({ isLoading: true })

    const fullname = this.state.fullname.trim()
    const phone = this.state.phone.trim()
    const email = this.state.email.trim()
    const location = this.state.location.trim()
    const password = this.state.password.trim()
    const cpassword = this.state.cpassword.trim()
    const photourl = this.state.photourl

    if (fullname === "" ||
      phone === "" ||
      email === "" ||
      location === "" ||
      password === "" ||
      cpassword === ""
    ) {
      alert("Please enter all required fields")
      this.setState({ isLoading: false })
    } else if (email !== "" && !this.isValidEmail(email)) {
      alert("Please enter a valid email address")
      this.setState({ isLoading: false })
    } else if (password.length < 6) {
      alert("Password must be minimum 6 characters")
      this.setState({ isLoading: false })
    } else if (password !== cpassword) {
      alert("Password and confirm password do not match")
      this.setState({ isLoading: false })
    } else {

      const apiurl = global.url + 'usersignup.php'
      const formData = new FormData()

      if (photourl !== '') {
        //Add your input data
        formData.append('fullname', fullname)
        formData.append('phone', phone)
        formData.append('email', email)
        formData.append('location', location)
        formData.append('password', password)
        formData.append('cpassword', cpassword)

        const uriPart = photourl.split('.');
        const fileExtension = uriPart[uriPart.length - 1];
        let photoname = 'photo' + new Date().getTime();

        formData.append('photo', {
          uri: photourl,
          name: photoname + '.' + fileExtension,
          type: 'image/' + fileExtension
        });
      } else {
        formData.append('fullname', fullname)
        formData.append('phone', phone)
        formData.append('email', email)
        formData.append('location', location)
        formData.append('password', password)
        formData.append('cpassword', cpassword)
        formData.append('photo', photourl)
      }

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
          this.setState({ isLoading: false })
          this.props.navigation.navigate('LoginNavigator')
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

  deletePhoto = async () => {
    this.setState({ photourl: '' });
  }

  isValidEmail(email) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (reg.test(email)) {
      return true
    } else {
      return false
    }
  }

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
        { permissions: ['public_profile', 'email'] }
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
    fontSize: wp('5.56%'),
    color: '#fff',
    fontFamily: 'Helvetica Neue',
    marginTop: wp('35%')
  },
  loginButtonTitle: {
    fontFamily: 'Arial',
    color: '#fff',
  },
  loginButton: {
    borderRadius: wp('6.94%'),
    width: wp('65%'),
    height: hp('8%'),
    marginVertical: wp('8%')
  },
  forgotPassword: {
    fontSize: wp('5%'),
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
