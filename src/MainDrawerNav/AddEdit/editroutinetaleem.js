import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { Card, ListItem, Button, Icon, SearchBar } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
//import Icon from 'react-native-vector-icons/FontAwesome';

class ItemSubtitle extends Component {
  render() {
    return (
      <View>
        <Text style={styles.itemSubtitle}>{this.props.speaker}</Text>
        <Text style={styles.itemSubtitle}>{this.props.location}</Text>
        <Text style={styles.itemSubtitle}>{this.props.weekday} ({this.props.time})</Text>
      </View>
    );
  }
}
class EditRoutineTaleem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routineTaleem: [],
      loading: true,
      refreshing: false,
    }
  }

  componentDidMount(){
    this.loadInitialState().done();
  }

  loadInitialState = async () =>{
    //Get username from AsyncStorage
    const routineTaleem = await this.getRoutineTaleem();
    this.setState({
      routineTaleem:routineTaleem,
      loading: false,
      refreshing: false,
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.loadInitialState().done;
  }

  keyExtractor = (item, index) => index.toString()
  renderItem = ({ item }) => (
    <View style={{ backgroundColor: '#fff', paddingHorizontal: wp('2%'), paddingTop: wp('2%'), }}>
      <View style={styles.backgroundImage} borderRadius={wp('2%')}>
        <ListItem
          title={item.topic}
          titleStyle={{ color: '#000', fontSize: wp('3.5%'), fontWeight: 'bold' }}
          subtitle={
            <ItemSubtitle 
              speaker={item.speaker} 
              location={item.location} 
              weekday={item.dayordate} 
              time={item.time} 
            />}
          leftAvatar={{ source: { uri: item.speakerphotourl }, size: wp('24%')}}
          containerStyle={{ backgroundColor: 'transparent', padding: wp('2.5%'), }}
          onPress={() => this.props.navigation.navigate('SingleRoutineTaleem', {
            lectureid: item.lectureid,
            title: item.topic,
            speaker: item.speaker,
            location: item.location,
            weekday: item.dayordate,
            time: item.time,
            briefinfo: item.briefinfo,
            photourl: item.speakerphotourl,
          })}
        />
      </View>
    </View>
  )
  render() {
    if(this.state.loading) { 
      return (
      	<ActivityIndicator size="large" color="#e2e2e2" style={{flex: 1,
          justifyContent: 'center',
          alignItems: 'center',}}/>
      ); 
    }

    if (!this.state.routineTaleem.success) {
      return (
        <View style={{alignItems:'center', marginTop: wp('50%')}}>
          <Text>{this.state.routineTaleem.message}</Text>
          <TouchableOpacity onPress={() => this.onRefresh()}>
            <Text>Click to Refresh</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.routineTaleem.message}
          renderItem={this.renderItem}
          refreshing = {this.state.refreshing}
          onRefresh = {() => this.onRefresh()}
        />
      </View>
    );
  }

  getRoutineTaleem = async() => {
    const apiurl = global.url + 'getroutinetaleembyuserid.php';
    const userid = await retrieveData('userid');
    try {
      const formData = new FormData()
      formData.append('userid', userid)
      
      const response = await fetch(apiurl, {
        //handle post data
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData
      });
      const res = await response.json();
      //console.log(res)
      return res;
    }
    catch (err) {
      return console.log(err);
    }
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#B5C3C3',
  },
  itemSubtitle: {
    fontSize: wp('3%'),
    color: '#000'
  }
});
export default EditRoutineTaleem;