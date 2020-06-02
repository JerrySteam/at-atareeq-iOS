import React, { Component } from 'react';
import { StyleSheet, Image, View, KeyboardAvoidingView, ScrollView, Picker, ActivityIndicator } from 'react-native';
import { Button, Input, Card, Avatar } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

class EditProfile extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      isLoading: false,
      isLoadingPass: false,
      userid: navigation.getParam('userid', ''),
      fullname: navigation.getParam('fullname', ''),
      displayname: navigation.getParam('displayname', ''),
      phone: navigation.getParam('phone', ''),
      email: navigation.getParam('email', ''),
      location: navigation.getParam('location', ''),
      photourl: navigation.getParam('photourl', null),
      currentpassword: '',
      newpassword:'',
      confirmpassword:'',
    }
  }

  render() {
    return (
      <View>
        <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={100}>
          <ScrollView contentContainerStyle={{ alignItems: "center" }}>
            <View style={{ flex: 1, flexDirection: 'row', marginVertical: wp('5%') }}>
              <Avatar
                rounded
                showEditButton
                icon={{ name: 'user', type: 'font-awesome' }}
                size={wp('30%')}
                source={{ uri: this.state.photourl, }}
                onPress={() => this.selectPhoto()}
                onEditPress={() => this.selectPhoto()}
              />
              <Input
                label='Full Name'
                labelStyle={{ fontSize: wp('4%') }}
                placeholder='Full Name'
                leftIcon={{ type: 'font-awesome', name: 'user', size: wp('5%'), color: 'gray' }}
                inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
                containerStyle={{ width: wp('63%'), }}
                onChangeText={input => this.setState({ fullname: input })}
                value={this.state.fullname}
              />
            </View>
            <Button
              title="Delete Photo"
              type="clear"
              titleStyle={{ color: '#000' }}
              onPress={() => this.deletePhoto()}
            />
            <Input
              label='Display Name'
              labelStyle={{ fontSize: wp('4%') }}
              placeholder='Display Name'
              leftIcon={{ type: 'font-awesome', name: 'user', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('2%') }}
              onChangeText={input => this.setState({ displayname: input })}
              value={this.state.displayname}
            />
            <Input
              disabled={true}
              label='Phone Number'
              labelStyle={{ fontSize: wp('4%') }}
              placeholder='Phone Number'
              leftIcon={{ type: 'font-awesome', name: 'phone', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('5%') }}
              value={this.state.phone}
            />
            <Input
              disabled={true}
              label='Email Address'
              labelStyle={{ fontSize: wp('4%') }}
              placeholder='Email Address'
              leftIcon={{ type: 'font-awesome', name: 'envelope', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('5%') }}
              value={this.state.email}
            />
            <Button
              title="SUBMIT"
              titleStyle={styles.loginButtonTitle}
              buttonStyle={styles.loginButton}
              loading={this.state.isLoading}
              disabled={this.state.isLoading}
              loadingProps={{ color: '#000' }}
              onPress={() => this.updateAccount()}
            />
            <Card
              title='Change Password'
              titleStyle={styles.cardTitle}
              dividerStyle={{ height: 0 }}
            >
              <Input
                placeholder='Current Password'
                secureTextEntry={true}
                leftIcon={{ type: 'font-awesome', name: 'lock', size: wp('5%'), color: 'gray' }}
                inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%') }}
                containerStyle={{ width: wp('95%'), }}
                onChangeText={input => this.setState({ currentpassword: input })}
                value={this.state.currentpassword}
              />
              <Input
                placeholder='New Password'
                secureTextEntry={true}
                leftIcon={{ type: 'font-awesome', name: 'lock', size: wp('5%'), color: 'gray' }}
                inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%') }}
                containerStyle={{ width: wp('95%'), marginTop: wp('5%'), }}
                onChangeText={input => this.setState({ newpassword: input })}
                value={this.state.newpassword}
                errorStyle={{ color: '#000' }}
                errorMessage='Minimum of 6 characters'
                rightIcon ={
                  (this.state.newpassword !== "") ?
                    (this.state.newpassword.length >= 6) ? { type: 'font-awesome', name: 'check-circle', size: wp('5%'), color: '#42DB50'}: { type: 'font-awesome', name: 'times-circle', size: wp('5%'), color: '#F84127'}
                  : null}
              />
              <Input
                placeholder='Confirm New Password'
                secureTextEntry={true}
                leftIcon={{ type: 'font-awesome', name: 'lock', size: wp('5%'), color: 'gray' }}
                inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%') }}
                containerStyle={{ width: wp('95%'), marginTop: wp('5%'), }}
                onChangeText={input => this.setState({ confirmpassword: input })}
                value={this.state.confirmpassword}
                rightIcon ={
                  (this.state.newpassword !== "" && this.state.confirmpassword !== "") ?
                    (this.state.newpassword===this.state.confirmpassword) ? { type: 'font-awesome', name: 'check-circle', size: wp('5%'), color: '#42DB50'}: { type: 'font-awesome', name: 'times-circle', size: wp('5%'), color: '#F84127'}
                  : null}
              />
            </Card>
            <Button
              title="CHANGE PASSWORD"
              titleStyle={styles.loginButtonTitle}
              buttonStyle={styles.loginButton}
              loading={this.state.isLoadingPass}
              disabled={this.state.isLoadingPass}
              loadingProps={{ color: '#000' }}
              onPress={() => this.changePassword()}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  /* selectPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 4],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ photourl: result.uri });
    } else {
      this.setState({ photourl: '' });
    }
  } */

  selectPhoto = async () => {
    const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        aspect: [4, 4],
        quality: 1
      });
  
      //console.log("Image Picker Log: " + result.uri);
  
      if (!result.cancelled) {
        this.setState({ photourl: result.uri });
      } else {
        this.setState({ photourl: '' });
      }
    } else {
      alert('Camera permission not granted');
      this.setState({ photourl: '' });
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

  updateAccount = async () => {
    this.setState({ isLoading: true })

    const userid = this.state.userid
    const fullname = this.state.fullname.trim()
    const displayname = this.state.displayname.trim()
    const photourl = this.state.photourl
    //alert("Going")
    if (fullname === "" || displayname === "") {
      alert("Please enter your full name and display name")
      this.setState({ isLoading: false })
    } else {
      const apiurl = global.url + 'editprofile.php'
      const formData = new FormData()

      if (photourl !== '') {
        //Add your input data
        formData.append('userid', userid)
        formData.append('fullname', fullname)
        formData.append('displayname', displayname)

        const uriPart = photourl.split('.');
        const fileExtension = uriPart[uriPart.length - 1];
        let photoname = 'photo'+ new Date().getTime();

        formData.append('photo', {
          uri: photourl,
          name: photoname+'.'+fileExtension,
          type: 'image/'+fileExtension
        });
      } else {
        formData.append('userid', userid)
        formData.append('fullname', fullname)
        formData.append('displayname', displayname)
        formData.append('photo', photourl)
      }

      setTimeout( async() => {
        try {
          const response = await fetch(apiurl, {
            //handle post data
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData
          });
          const res = await response.json();
          if (res.success) {
            this.setState({
              fullname: this.state.fullname,
              displayname: this.state.displayname,
              photourl: this.state.photourl
            })
          }
          alert(res.message);
          this.setState({ isLoading: false });
        }
        catch (err) {
          return console.log(err);
        }
      }, 100)
    }
  }

  changePassword = async () => {
    this.setState({ isLoadingPass: true })

    const userid = this.state.userid
    const currentpassword = this.state.currentpassword.trim()
    const newpassword = this.state.newpassword.trim()
    const confirmpassword = this.state.confirmpassword.trim()

    if (currentpassword === "" || newpassword === "" || confirmpassword === "") {
      alert("Please all fields are required")
      this.setState({ isLoadingPass: false })
    }else if (newpassword.length < 6){
      alert("New password must be minimum 6 characters")
      this.setState({ isLoadingPass: false })
    }else if (newpassword !== confirmpassword){
      alert("New password and confirm password do not match")
      this.setState({ isLoadingPass: false })
    }else {
      const apiurl = global.url + 'changepassword.php'
      const formData = new FormData()

      formData.append('userid', userid)
      formData.append('currentpassword', currentpassword)
      formData.append('newpassword', newpassword)
      formData.append('confirmpassword', confirmpassword)

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
        //this.setState({ isLoadingPass: false })

        const res = await response.json();
        if (res.success) {
          alert(res.message+". You will be logged out shortly");
          this.setState({ isLoadingPass: false });
          const param = this.props.navigation.navigate
          setTimeout((function(){ 
            logout(param); 
          }), 3000);
        } else {
          alert(res.message);
          this.setState({ isLoadingPass: false });
        }
      }
      catch (err) {
        return console.log(err);
      }
    }
  }  
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: wp('5%'),
    color: '#000',
    textAlign: 'center'
  },
  profileThumbnail: {
    width: wp('30%'),
    height: wp('30%'),
    borderRadius: wp('100%'),
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
  }
});
export default EditProfile;