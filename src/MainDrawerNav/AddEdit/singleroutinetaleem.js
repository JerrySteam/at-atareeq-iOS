import React, { Component } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, ScrollView, } from 'react-native';
import { Button, Input, Avatar, Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DatePicker from 'react-native-datepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class SingleRoutineTaleem extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      lectureid: navigation.getParam('lectureid', 'NO-ID'),
      title: navigation.getParam('title', 'NO-TOPIC'),
      speaker: navigation.getParam('speaker', 'NO-NAME'),
      location: navigation.getParam('location', 'NO-ADDRESS'),
      weekday: navigation.getParam('weekday', 'NO-DAY'),
      time: navigation.getParam('time', 'NO-TIME'),
      briefinfo: navigation.getParam('briefinfo', 'NO-TIME'),
      photourl: navigation.getParam('photourl', 'NO-TIME'),
    }
  }

  render() {
    return (
      <View style={styles.backgroundImage}>
        <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={100}>
          <ScrollView contentContainerStyle={{ alignItems: "center", paddingVertical: wp('12%') }}>
          <Avatar
              size="xlarge"
              rounded
              showEditButton
              icon={{ name: 'user', type: 'font-awesome' }}
              source={{ uri: this.state.photourl }}
              onPress={() => this.selectPhoto()}
              onEditPress={() => this.selectPhoto()}
            />
            <Button
              title="Delete Photo"
              type="clear"
              titleStyle={{ color: '#000' }}
              onPress={() => this.deletePhoto()}
            />
            <Input
              placeholder='Weekday'
              leftIcon={{ type: 'font-awesome', name: 'map-pin', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('5%') }}
              onChangeText={input => this.setState({ weekday: input })}
              value={this.state.weekday}
              disabled
            />
            <Input
              placeholder='Lecture title'
              leftIcon={{ type: 'font-awesome', name: 'book', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('8%') }}
              onChangeText={input => this.setState({ title: input })}
              value={this.state.title}
            />
            <Input
              placeholder='Speaker'
              leftIcon={{ type: 'font-awesome', name: 'user', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('5%') }}
              onChangeText={input => this.setState({ speaker: input })}
              value={this.state.speaker}
            />
            <Input
              placeholder='Location'
              leftIcon={{ type: 'font-awesome', name: 'map-pin', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('5%') }}
              onChangeText={input => this.setState({ location: input })}
              value={this.state.location}
            />
            <Input
              placeholder='Time'
              leftIcon={{ type: 'font-awesome', name: 'clock-o', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('2%') }}
              onChangeText={input => this.setState({ time: input })}
              value={this.state.time}
            />
            <Input
              placeholder='Brief info about the lecture (Optional)'
              leftIcon={{ type: 'font-awesome', name: 'edit', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('2%'), height: wp('20%'), }}
              multiline={true}
              numberOfLines={4}
              onChangeText={input => this.setState({ briefinfo: input })}
              value={this.state.briefinfo}
            />
            <Button
              title="UPDATE"
              titleStyle={styles.loginButtonTitle}
              buttonStyle={styles.loginButton}
              icon={{ name: "send", size: wp('5%'), color: "white" }}
              loading={this.state.isLoading}
              disabled={this.state.isLoading}
              loadingProps={{ color: '#000' }}
              onPress={() => this.updateRoutineTaleem()}
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

  updateRoutineTaleem = async () => {
    this.setState({ isLoading: true })
    const lectureid = this.state.lectureid
    const title = this.state.title.trim()
    const speaker = this.state.speaker.trim()
    const location = this.state.location.trim()
    const weekday = this.state.weekday
    const time = this.state.time.trim()
    const briefinfo = this.state.briefinfo.trim()
    const photourl = this.state.photourl
    
    if (title === "" ||
      speaker === "" ||
      location === "" ||
      weekday === "" ||
      time === ""
    ) {
      alert("Please enter all required fields")
      this.setState({ isLoading: false })
    } else {

      const apiurl = global.url + 'editroutinetaleem.php'
      const formData = new FormData()
      formData.append('lectureid', lectureid)
      formData.append('title', title)
      formData.append('speaker', speaker)
      formData.append('location', location)
      formData.append('weekday', weekday)
      formData.append('time', time)
      formData.append('briefinfo', briefinfo)

      if (photourl !== '') {
        const uriPart = photourl.split('.');
        const fileExtension = uriPart[uriPart.length - 1];
        let photoname = 'photo' + new Date().getTime();

        formData.append('photo', {
          uri: photourl,
          name: photoname + '.' + fileExtension,
          type: 'image/' + fileExtension
        });
      } else {
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

          //const res = await response.text();
          //console.log(res)
          //this.setState({ isLoading: false })
          const res = await response.json();
          alert(res.message)
          if (res.success) {
            this.setState({
              title: '',
              speaker: '',
              location: '',
              time: '',
              briefinfo: '',
              photourl: '',
            })
          }
          this.setState({ isLoading: false })
        }
        catch (err) {
          console.log(err);
          this.setState({ isLoading: false })
        }
      }, 100)
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
    marginVertical: wp('8%')
  },

});
