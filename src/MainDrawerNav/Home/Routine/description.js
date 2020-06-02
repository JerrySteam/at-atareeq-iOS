import React, { Component } from 'react';
import { View, Text, Share, StyleSheet, ImageBackground, ScrollView, } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class LectureDescScreen extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      lectureid: navigation.getParam('lectureid', 'NO-ID'),
      topic: navigation.getParam('topic', 'NO-TOPIC'),
      speaker: navigation.getParam('speaker', 'NO-NAME'),
      location: navigation.getParam('location', 'NO-ADDRESS'),
      date: navigation.getParam('date', 'NO-DATE'),
      time: navigation.getParam('time', 'NO-TIME'),
      briefinfo: navigation.getParam('briefinfo', 'NO-TIME'),
      latitude: navigation.getParam('latitude', 0),
      longitude: navigation.getParam('longitude', 0),
      photourl: navigation.getParam('photourl', 'NO-TIME'),

      isFavourite: false,
      isNotification: false,
      //userid: '',
    }
  }

  componentDidMount(){
    this.loadInitialState().done()
  }

  loadInitialState = async () =>{
    //Get username from AsyncStorage
    //const userid = await retrieveData('userid');
    const isFavourite = await this.isFavourite()
    const isNotification = await this.isNotification()

    this.setState({
      isFavourite:isFavourite,
      isNotification:isNotification,
      //userid: userid
    });
  }

  render() {
    return (
      <ImageBackground style={styles.backgroundImage} source={require('../../../../backgroundimage/description.jpg')}>
        <View>
          <ScrollView>
            <View style={styles.lectureTitleBox}>
              <Text style={styles.lectureTitle}>{this.state.topic}</Text>
              <Avatar rounded size={wp('40%')} source={{ uri: this.state.photourl }} />
            </View>
            <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: wp('4%'), marginTop: wp('10%') }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Icon name='user' type='font-awesome' size={wp('4%')} color='skyblue' />
                  <Text style={styles.itemSubtitle}>{this.state.speaker}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Icon name='map-pin' type='font-awesome' size={wp('4%')} color='red' />
                  <Text style={styles.itemSubtitle}>{this.state.location}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Icon name='calendar' type='font-awesome' size={wp('4%')} color='limegreen' />
                  <Text style={styles.itemSubtitle}>{this.state.date}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Icon name='clock-o' type='font-awesome' size={wp('4%')} color='lightblue' />
                  <Text style={styles.itemSubtitle}>{this.state.time}</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.lectureInfo}>{this.state.briefinfo}</Text>
              </View>
            </View>
            <View style={{ flex: 2, flexDirection: 'row', marginTop: wp('13%'), alignItems: 'center', justifyContent: 'space-evenly', }}>
              <Icon 
                name='map-marker' 
                color='purple' 
                type='font-awesome'
                onPress={() => this.onMapViewPress(this.props.navigation)} 
              />
              <Icon  
                name={this.state.isNotification ? 'volume-up':'volume-off'}
                color='#00aced' 
                type='font-awesome' 
                onPress={() => this.onNotificationPress()} 
              />
              <Icon 
                name={this.state.isFavourite ? 'star':'star-o'} 
                color='orange' 
                type='font-awesome'  
                onPress={() => this.onFavouritePress()} 
              />
              <Icon 
                name='share' 
                color='limegreen' 
                type='font-awesome' 
                onPress={() => this.shareMessage()} 
              />
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }

  onMapViewPress = async(navigation) =>{
    var cordLatitude = this.state.latitude
    var cordLongitude = this.state.longitude
    var destination = this.state.location

    if (isNaN(cordLatitude) || isNaN(cordLongitude) || cordLatitude == 0 || cordLongitude == 0) {
      alert("Map view location not available for this lecture.")
    } else {
      navigation.navigate('MapView',{
        cordLatitude: this.state.latitude,
        cordLongitude: this.state.longitude,
        destination: destination,
      })
    }
  }

  isFavourite = async() =>{
    const apiurl = global.url + 'isfavourite.php';
    const userid = await retrieveData('userid');

    try {
      const response = await fetch(apiurl, {
        //handle post data
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          lectureid:this.state.lectureid,
          userid: userid,
        }),
      });
      const res = await response.json();
      //console.log(res)
      return res.success;
    }
    catch (err) {
      return console.log(err);
    }
  }

  onFavouritePress = async() =>{
    if (this.state.isFavourite){
      this.setState ({isFavourite: false})
      const res = await this.removeFavourite();
      if (!res.success) {
        alert(res.message);
        this.setState ({isFavourite: true})
      } 
    }else{
      this.setState ({isFavourite: true})
      const res = await this.addFavourite();
      if (!res.success) {
        alert(res.message);
        this.setState ({isFavourite: false})
      }
    }
  }

  addFavourite = async() => {
    const apiurl = global.url + 'addfavourite.php';
    const userid = await retrieveData('userid');

    try {
      const response = await fetch(apiurl, {
        //handle post data
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lectureid: this.state.lectureid,
          userid: userid,
        })
      });
      const res = await response.json();
      console.log(res.message)
      return res;
    }
    catch (err) {
      return console.log(err);
    }
  }

  removeFavourite = async() => {
    const apiurl = global.url + 'removefavourite.php';
    const userid = await retrieveData('userid');
    try {
      const response = await fetch(apiurl, {
        //handle post data
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lectureid: this.state.lectureid,
          userid: userid,
        })
      });
      const res = await response.json();
      console.log(res.message)
      return res;
    }
    catch (err) {
      return console.log(err);
    }
  }

  isNotification = async() =>{
    const apiurl = global.url + 'isnotification.php';
    const userid = await retrieveData('userid');

    try {
      const response = await fetch(apiurl, {
        //handle post data
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          lectureid:this.state.lectureid,
          userid: userid,
        }),
      });
      const res = await response.json();
      //console.log(res)
      return res.success;
    }
    catch (err) {
      return console.log(err);
    }
  }

  onNotificationPress = async() =>{
    if (this.state.isNotification){
      this.setState ({isNotification: false})
      const res = await this.removeNotification();
      if (!res.success) {
        alert(res.message)
        this.setState ({isNotification: true})
      }
      
    }else{
      this.setState ({isNotification: true})
      const res = await this.addNotification();
      if (!res.success) {
        alert(res.message)
        this.setState ({isNotification: false})
      }
    }
  }

  addNotification = async() => {
    const apiurl = global.url + 'addnotification.php';
    const userid = await retrieveData('userid');

    try {
      const response = await fetch(apiurl, {
        //handle post data
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lectureid: this.state.lectureid,
          userid: userid,
        })
      });
      const res = await response.json();
      console.log(res.message)
      return res;
    }
    catch (err) {
      return console.log(err);
    }
  }

  removeNotification = async() => {
    const apiurl = global.url + 'removenotification.php';
    const userid = await retrieveData('userid');

    try {
      const response = await fetch(apiurl, {
        //handle post data
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lectureid: this.state.lectureid,
          userid: userid,
        })
      });
      const res = await response.json();
      console.log(res.message)
      return res;
    }
    catch (err) {
      return console.log(err);
    }
  }

  shareMessage = () => {

    let message = "Topic: "+this.state.topic+"\n"+
                  "Speaker: "+this.state.speaker+"\n"+
                  "Location: "+this.state.location+"\n"+
                  "Date: "+this.state.date+"\n"+
                  "Time: "+this.state.time+"\n"+
                  "Brief Information: "+this.state.briefinfo;
    //Here is the Share API 
    Share.share({
      message: message,
    })
    //after successful share return result
    .then(result => console.log(result))
    //If any thing goes wrong it comes here
    .catch(errorMsg => console.log(errorMsg));
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: wp('100%'),
    height: wp('48%'),
  },
  itemSubtitle: {
    fontSize: wp('3%'),
    marginBottom: wp('2%'),
    paddingLeft: wp('1.5%'),
  },
  lectureInfo: {
    fontSize: wp('3.5%'),
  },
  lectureTitleBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lectureTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: wp('15%'),
    marginBottom: wp('3%'),
    paddingHorizontal: wp('5%'),
  }
});

export default LectureDescScreen;