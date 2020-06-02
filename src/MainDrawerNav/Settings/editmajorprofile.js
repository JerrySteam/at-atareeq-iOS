import React, { Component } from 'react';
import { StyleSheet, Image, View, KeyboardAvoidingView, ScrollView, Picker, ActivityIndicator, Text } from 'react-native';
import { Button, Input, Card } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


class EditMajorProfile extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      isLoading: false,
      userid: navigation.getParam('userid', null),
      mosquelocation: navigation.getParam('mosquelocation', null),
      mosquename: navigation.getParam('mosquename', null),
      mosquemessage: navigation.getParam('mosquemessage', null)
    }
  }

  render() {
    if (this.state.mosquemessage !== null) {
      return (
        <View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text>{this.state.mosquemessage}</Text>
          </View>
        </View>
      )
    }
    return (
      <View>
        <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={100}>
          <ScrollView contentContainerStyle={{ alignItems: "center" }}>
            <Input
              disabled={true}
              label='Change Location'
              labelStyle={{ fontSize: wp('4%') }}
              placeholder='Change Location'
              leftIcon={{ type: 'font-awesome', name: 'map-pin', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('8%') }}
              //onChangeText={input => this.setState({ mosquelocation: input })}
              value={this.state.mosquelocation}
              
            />
            <Input
              disabled={true}
              label='Edit Mosque/Organization'
              labelStyle={{ fontSize: wp('4%') }}
              placeholder='Edit Mosque/Organization'
              leftIcon={{ type: 'font-awesome', name: 'globe', size: wp('5%'), color: 'gray' }}
              inputStyle={{ color: '#000', paddingHorizontal: wp('2%'), fontSize: wp('4.5%'), }}
              containerStyle={{ width: wp('95%'), marginTop: wp('5%') }}
              //onChangeText={input => this.setState({ mosquename: input })}
              value={this.state.mosquename}
            />
            {/** 
            <Button
              title="SUBMIT"
              titleStyle={styles.loginButtonTitle}
              buttonStyle={styles.loginButton}
              onPress={() => this.updateMajorProfile()}
            />
            */}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  updateMajorProfile = async () => {
    this.setState({ isLoading: true })

    const userid = this.state.userid
    const mosquelocation = this.state.mosquelocation.trim()
    const mosquename = this.state.mosquename.trim()

    if (mosquelocation === "" || mosquename === "") {
      alert("Please all fields are required")
      this.setState({ isLoading: false })
    } else {
      const apiurl = global.url + 'editmajorprofile.php'
      const formData = new FormData()

      formData.append('userid', userid)
      formData.append('mosquelocation', mosquelocation)
      formData.append('mosquename', mosquename)
      
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
        this.setState({ isLoading: false })
        
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
export default EditMajorProfile;