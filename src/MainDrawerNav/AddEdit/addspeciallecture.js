import React, { Component } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, ScrollView, } from 'react-native';
import { Button, Input, Avatar, Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DatePicker from 'react-native-datepicker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class AddSpecialLecture extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      photourl: '',
      title: '',
      speaker: '',
      location: '',
      date: null,
      starttime: null,
      endtime: null,
      briefinfo: '',
      latitude: this.props.navigation.getParam('latitude', 0),
      longitude: this.props.navigation.getParam('longitude', 0),
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.navigation.getParam('latitude', 0) !==
      prevProps.navigation.getParam('latitude', 0) &&
      this.props.navigation.getParam('longitude', 0) !==
      prevProps.navigation.getParam('longitude', 0)
    ) {
      const latitude = this.props.navigation.getParam('latitude', 0);
      const longitude = this.props.navigation.getParam('longitude', 0);
      this.setState({ latitude, longitude });
    }
  }

  render() {
    console.log(this.state.latitude + ", " + this.state.longitude);
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
              leftIcon={{ type: 'font-awesome', name: 'map-marker', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('5%') }}
              onChangeText={input => this.setState({ location: input })}
              value={this.state.location}
            />
            <DatePicker
              style={{ width: wp('90%'), marginTop: wp('5%') }}
              date={this.state.date}
              mode="date"
              iconComponent={<Icon name='calendar-o' type='font-awesome' color='#e2e2e2' />}
              placeholder="Select Date"
              format="DD/MM/YYYY"
              minDate={new Date()}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={true}
              customStyles={{
                dateIcon: {
                  marginRight: wp('80%')
                },
                dateInput: {
                  marginLeft: 4,
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                  borderLeftWidth: 0,
                  fontSize: wp('4.5%')
                }
              }}
              onDateChange={(date) => { this.setState({ date: date }) }}
            />
            <DatePicker
              style={{ width: wp('90%'), marginTop: wp('5%') }}
              date={this.state.starttime}
              mode="time"
              iconComponent={<Icon name='clock-o' type='font-awesome' color='#e2e2e2' />}
              placeholder="Select Start Time"
              format="h:mm a"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={true}
              customStyles={{
                dateIcon: {
                  marginRight: wp('80%')
                },
                dateInput: {
                  marginLeft: 4,
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                  borderLeftWidth: 0,
                  fontSize: wp('4.5%')
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(time) => { this.setState({ starttime: time }) }}
            />
            <DatePicker
              style={{ width: wp('90%'), marginTop: wp('5%') }}
              date={this.state.endtime}
              mode="time"
              iconComponent={<Icon name='clock-o' type='font-awesome' color='#e2e2e2' />}
              placeholder="Select End Time (optional)"
              format="h:mm a"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={true}
              customStyles={{
                dateIcon: {
                  marginRight: wp('80%')
                },
                dateInput: {
                  marginLeft: 4,
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                  borderLeftWidth: 0,
                  fontSize: wp('4.5%')
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(time) => { this.setState({ endtime: time }) }}
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
              title='Select location on map'
              type='outline'
              titleStyle={{ color: '#000' }}
              buttonStyle={styles.loginButton}
              onPress={() => this.props.navigation.navigate("SpecialMapView")}
            />
            <Button
              title="POST"
              titleStyle={styles.loginButtonTitle}
              buttonStyle={styles.loginButton}
              icon={{ name: "send", size: wp('5%'), color: "white" }}
              loading={this.state.isLoading}
              disabled={this.state.isLoading}
              loadingProps={{ color: '#000' }}
              onPress={() => this.addSpecialLecture()}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
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

  deletePhoto = async () => {
    this.setState({ photourl: '' });
  }

  addSpecialLecture = async () => {
    this.setState({ isLoading: true })
    const userid = await retrieveData('userid');
    const title = this.state.title.trim()
    const speaker = this.state.speaker.trim()
    const location = this.state.location.trim()
    const date = this.state.date
    const starttime = this.state.starttime
    const endtime = this.state.endtime
    const briefinfo = this.state.briefinfo.trim()
    const latitude = this.state.latitude
    const longitude = this.state.longitude
    const photourl = this.state.photourl

    if (title === "" ||
      speaker === "" ||
      location === "" ||
      date === null ||
      starttime === null
    ) {
      alert("Please enter all required fields")
      this.setState({ isLoading: false })
    } else {

      const apiurl = global.url + 'addspeciallecture.php'
      const formData = new FormData()
      let time = starttime;
      if (endtime !== null) {
        time = time + " - " + endtime;
      }

      formData.append('userid', userid)
      formData.append('title', title)
      formData.append('speaker', speaker)
      formData.append('location', location)
      formData.append('date', date)
      formData.append('time', time)
      formData.append('briefinfo', briefinfo)
      formData.append('latitude', latitude)
      formData.append('longitude', longitude)

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
            date: null,
            time: '',
            briefinfo: '',
            photourl: '',
            latitude: 0,
            longitude: 0,
          })
        }
        this.setState({ isLoading: false })
      }
      catch (err) {
        console.log(err);
        this.setState({ isLoading: false })
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
    marginTop: wp('8%')
  },

});
