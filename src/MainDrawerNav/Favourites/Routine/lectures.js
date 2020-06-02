import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { Card, ListItem, Button, Avatar } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
//import Icon from 'react-native-vector-icons/FontAwesome';

//the class below requires
class RoutineTaleemLecture extends Component {
  render() {
    return (
      <View style={styles.favouriteRTWrapper}>
        <View style={styles.favouriteRTContainer}>
          <View style={styles.favouriteRTThumbnailContainer}>
            {/*
            <Image
              source={{ uri: this.props.thumbnail }}
              style={styles.favouriteRTThumbnail}
              PlaceholderContent={<ActivityIndicator />}
            />
            */}

            <Avatar
              size = {wp('22%')}
              rounded
              source={{ uri: this.props.thumbnail }}
            />
          </View>
          <View style={styles.favouriteRTContent}>
            <Text style={styles.favouriteRTSpeaker}>{this.props.speaker} </Text>
            <Text style={styles.favouriteRTTitle}>{this.props.title}</Text>
            <Text style={styles.favouriteRTSubtitle}>{this.props.location} </Text>
            <Text style={styles.favouriteRTSubtitle}>{this.props.time} ({this.props.date})</Text>
          </View>
        </View>
        <Button
          buttonStyle={styles.favouriteRTRemoveButton}
          title='REMOVE'
          onPress={() => this.props.removeFavourite(this.props.lectureid)}
        />
      </View>
    );
  }


}
class LectureScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routineTaleems: [],
      loading: true,
      refreshing: false,
    }
  }
  componentDidMount() {
    this.loadInitialState().done();
  }

  loadInitialState = async () => {
    //Get username from AsyncStorage
    const routineTaleems = await this.getRoutineTaleem();
    this.setState({
      routineTaleems: routineTaleems,
      loading: false,
      refreshing: false,
    });
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadInitialState().done;
  }

  keyExtractor = (item, index) => index.toString()
  renderItem = ({ item }) => (
    <RoutineTaleemLecture
      thumbnail={item.speakerphotourl}
      speaker={item.speaker}
      title={item.topic}
      location={item.location}
      date={item.dayordate}
      time={item.time}
      lectureid={item.lectureid}
      removeFavourite={this.removeFavourite}
    />
  )
  render() {
    if (this.state.loading) {
      return (
        <ActivityIndicator size="large" color="#e2e2e2" style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }} />
      );
    }

    if (!this.state.routineTaleems.success) {
      return (
        <View style={{ alignItems: 'center', marginTop: wp('50%') }}>
          <Text>{this.state.routineTaleems.message}</Text>
          <TouchableOpacity onPress={() => this.onRefresh()}>
            <Text>Click to Refresh</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.routineTaleems.message}
        renderItem={this.renderItem}
        numColumns={2}
        refreshing={this.state.refreshing}
        onRefresh={() => this.onRefresh()}
      />
    );
  }

  getRoutineTaleem = async () => {
    const apiurl = global.url + 'favouriteroutinetaleem.php';
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
          userid: userid,
        })
      });
      const res = await response.json();
      //console.log(res)
      return res;
    }
    catch (err) {
      return console.log(err);
    }
  }

  removeFavourite = async (lectureid) => {
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
          lectureid: lectureid,
          userid: userid,
        })
      });
      const res = await response.json();
      console.log(res.message);
      this.onRefresh();
      return res;
    }
    catch (err) {
      return console.log(err);
    }
  }
}

const styles = StyleSheet.create({
  favouriteRTWrapper: {
    backgroundColor: '#E4E9ED',
    paddingHorizontal: wp('2%'),
    paddingTop: wp('2%'),
    width: wp('50%')
  },
  favouriteRTContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#27313B',
    paddingBottom: 0,
    borderTopRightRadius: wp('2%'),
    borderTopLeftRadius: wp('2%'),
  },
  favouriteRTThumbnailContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: wp('5%')
  },
  favouriteRTThumbnail: {
    width: wp('22%'),
    height: wp('22%'),
    borderRadius: wp('100%'),
  },
  favouriteRTContent: {
    padding: wp('3%'),
  },
  favouriteRTSpeaker: {
    fontSize: wp('3%'),
    color: '#fff',
    textTransform: 'uppercase',
    paddingBottom: wp('1%'),
  },
  favouriteRTTitle: {
    fontSize: wp('3%'),
    color: '#fff'
  },
  favouriteRTSubtitle: {
    fontSize: wp('2.5%'),
    color: '#fff'
  },
  favouriteRTRemoveButton: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    borderBottomLeftRadius: wp('2%'),
    borderBottomRightRadius: wp('2%'),
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  }

});
export default LectureScreen;