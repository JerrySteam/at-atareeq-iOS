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
        <Text style={styles.itemSubtitle}>{this.props.date}</Text>
        <Text style={styles.itemSubtitle}>{this.props.time}</Text>
      </View>
    );
  }
}
class LectureScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      specialLectures: [],
      loading: true,
      refreshing: false,
      search : '',
      showLoading : false,
    }
    this.arrayholder = [];
  }
  componentDidMount(){
    this.loadInitialState().done();
  }

  loadInitialState = async () =>{
    //Get username from AsyncStorage
    const specialLectures = await this.getSpecialLectures();
    this.setState({
      specialLectures:specialLectures,
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
      <ImageBackground style={styles.backgroundImage} source={require('../../../../backgroundimage/login.png')} borderRadius={wp('2%')}>
        <ListItem
          title={item.topic}
          titleStyle={{ color: '#fff', fontSize: wp('3.5%'), fontWeight: 'bold' }}
          subtitle={
            <ItemSubtitle 
              speaker={item.speaker} 
              location={item.location} 
              date={item.dayordate} 
              time={item.time} 
            />
          }
          leftAvatar={{ source: { uri: item.speakerphotourl }, size: wp('24%')}}
          containerStyle={{ backgroundColor: 'transparent', padding: wp('2.5%'), }}
          onPress={() => this.props.navigation.navigate('LectureDescription', {
            lectureid: item.lectureid,
            topic: item.topic,
            speaker: item.speaker,
            location: item.location,
            date: item.dayordate,
            time: item.time,
            briefinfo: item.briefinfo,
            latitude: item.latitude,
            longitude: item.longitude,
            photourl: item.speakerphotourl,
          })}
        />
      </ImageBackground>
    </View>
  )

  renderHeader = () => {    
    return (      
      <SearchBar        
        placeholder="Type Here..."        
        lightTheme        
        round        
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        showLoading = {this.state.showLoading} 
        value={this.state.search}            
      />    
    );  
  };

  render() {
    if(this.state.loading) { 
      return (
      	<ActivityIndicator size="large" color="#e2e2e2" style={{flex: 1,
          justifyContent: 'center',
          alignItems: 'center',}}/>
      ); 
    }

    if (!this.state.specialLectures.success) {
      return (
        <View style={{alignItems:'center', marginTop: wp('50%')}}>
          <Text>{this.state.specialLectures.message}</Text>
          <TouchableOpacity onPress={() => this.onRefresh()}>
            <Text>Click to Refresh</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.specialLectures.message}
        renderItem={this.renderItem}
        refreshing = {this.state.refreshing}
        onRefresh = {() => this.onRefresh()}
        ListHeaderComponent={this.renderHeader}
      />
    );
  }

  getSpecialLectures = async() => {
    const apiurl = global.url + 'homespeciallectures.php'
    try {
      const response = await fetch(apiurl, {
        //handle post data
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      const res = await response.json();
      //console.log(res)
      this.arrayholder = res;
      return res;
    }
    catch (err) {
      return console.log(err);
    }
  }

  searchFilterFunction = text => {  
    this.setState({search: text, showLoading: true})  
    const newData = this.arrayholder.message.filter(item => {      
      const itemData = `${item.lectureid}   
      ${item.categoryid} ${item.topic.toUpperCase()}
      ${item.speaker.toUpperCase()} ${item.location.toUpperCase()}
      ${item.briefinfo.toUpperCase()} ${item.speakerphotourl}
      ${item.datecreated} ${item.createdby}
      ${item.rowid} ${item.dayordate.toUpperCase()} 
      ${item.time.toUpperCase()}`;
      
       const textData = text.toUpperCase();
        
       return itemData.indexOf(textData) > -1;    
    });
    
    this.setState({ specialLectures: {'success':true, 'message':newData}, showLoading: false });  
  };
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  itemSubtitle: {
    fontSize: wp('3%'),
    color: '#fff'
  }
});
export default LectureScreen;