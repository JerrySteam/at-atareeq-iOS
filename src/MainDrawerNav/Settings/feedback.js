import React, { Component } from 'react';
import { StyleSheet, Image, View, KeyboardAvoidingView, ScrollView, Picker, ActivityIndicator } from 'react-native';
import { Button, Input, Card } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class Feedback extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      userid: navigation.getParam('userid', ''),
      phone: '',
      message: '',
      isLoading: false,
    }
  }
  render() {
    return (
      <View>
        <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={100}>
          <ScrollView contentContainerStyle={{ alignItems: "center" }}>
            <Input
              label='Phone Number'
              keyboardType='numeric'
              maxLength={20}
              labelStyle={{ fontSize: wp('4%') }}
              placeholder='Active Phone Number'
              leftIcon={{ type: 'font-awesome', name: 'phone', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('8%') }}
              onChangeText={input => this.setState({ phone: input })}
              value={this.state.phone}
            />
            <Input
              label='Message'
              labelStyle={{ fontSize: wp('4%') }}
              placeholder='Your Message'
              leftIcon={{ type: 'font-awesome', name: 'envelope', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('5%') }}
              multiline={true}
              numberOfLines={4}
              onChangeText={input => this.setState({ message: input })}
              value={this.state.message}
            />

            <Button
              title="SUBMIT"
              titleStyle={styles.loginButtonTitle}
              buttonStyle={styles.loginButton}
              loading={this.state.isLoading}
              disabled={this.state.isLoading}
              loadingProps={{ color: '#000' }}
              onPress={() => this.sendFeedback()}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  sendFeedback = async () => {
    this.setState({ isLoading: true })

    const userid = this.state.userid
    const phone = this.state.phone.trim()
    const message = this.state.message.trim()

    if (phone === "" || message === "") {
      alert("Please all fields are required")
      this.setState({ isLoading: false })
    } else {
      const apiurl = global.url + 'sendfeedback.php'
      const formData = new FormData()

      formData.append('userid', userid)
      formData.append('phone', phone)
      formData.append('message', message)

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
          this.setState({ 
            isLoading: false,
            phone: '',
            message: '', 
          })
        } else {
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
export default Feedback;