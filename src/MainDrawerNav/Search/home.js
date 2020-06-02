import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image, ScrollView, FlatList, Picker, ActivityIndicator } from 'react-native';
import { Card, ListItem, Button, Icon, SearchBar } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RNPickerSelect from 'react-native-picker-select';

export class AppSearchBar extends React.Component {
  state = {
    search: '',
  };

  updateSearch = search => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;

    return (
      <SearchBar
        placeholder="Type Here..."
        onChangeText={this.updateSearch}
        value={search}
        containerStyle={{ width: wp('80%'), padding: 0, backgroundColor: 'transparent', }}
        inputContainerStyle={{ borderRadius: wp('7%'), backgroundColor: 'transparent', }}
        inputStyle={{ fontFamily: 'Helvetica', color: '#fff', }}
      />
    );
  }
}

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
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: '',
      specialLectures: [],
      loading: true,
      refreshing: false,
      search : '',
      showLoading : false,
    };
    this.arrayholder = [];
    this.routine = [];
    this.special = [];
    this.speaker = [];
    this.mosque = [];
  }

  componentDidMount() {
    this.loadInitialState().done();
  }

  loadInitialState = async () => {
    //Get username from AsyncStorage
   
    const specialLectures = await this.getSpecialLectures();
    this.routine = await Promise.all(this.arrayholder.message.filter(a => a.categoryid === 1))
    this.special = await Promise.all(this.arrayholder.message.filter(a => a.categoryid === 2))
    this.speaker = await Promise.all(this.arrayholder.message.sort((a, b) => (a.speaker > b.speaker) ? 1 : -1))
    this.mosque = await Promise.all(this.arrayholder.message.sort((a, b) => (a.location > b.location) ? 1 : -1))

    //<AppSearchBar lectures ={specialLectures} />
    this.setState({
      specialLectures: specialLectures,
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
    <View style={{ backgroundColor: '#fff', paddingHorizontal: wp('2%'), paddingTop: wp('2%'), }}>
      <View style={styles.backgroundImage} borderRadius={wp('2%')}>
        <ListItem
          title={item.topic}
          titleStyle={{ color: '#000', fontSize: wp('3.5%'), fontWeight: 'bold' }}
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
            photourl: item.speakerphotourl,
          })}
        />
      </View>
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
    if (this.state.loading) {
      return (
        <ActivityIndicator size="large" color="#e2e2e2" style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }} />
      );
    }

    if (!this.state.specialLectures.success) {
      return (
        <View style={{ alignItems: 'center', marginTop: wp('50%') }}>
          <Text>{this.state.specialLectures.message}</Text>
          <TouchableOpacity onPress={() => this.onRefresh()}>
            <Text>Click to Refresh</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View>
        <View style={{ backgroundColor: '#2D343E', height: wp('14%'), justifyContent: 'center' }}>
          <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            disabled = {this.state.loading}
            style={{
              inputAndroidContainer: {
                width: wp('50%'), borderColor: '#fff', alignSelf: 'flex-end', backgroundColor: '#9B9EA3', height: wp('10%'), borderRadius: wp('7%'), marginRight: wp('2%'), paddingHorizontal: wp('5%'), justifyContent: 'center',
              },
              inputAndroid: {
                color: '#fff',
              },
            }}
            value={this.state.category}
            onValueChange={(value) => this.onPickerValueChange(value)}

            items={[
              { label: "Routine Ta'leem", value: "routine" },
              { label: "Special Lecture", value: "special" },
              { label: "Speaker", value: "speaker" },
              { label: "Mosque", value: "mosque" },
            ]}
          />
        </View>
        <View style={{ marginBottom: wp('30%') }}>
          <FlatList
            keyExtractor={this.keyExtractor}
            data={this.state.specialLectures.message}
            renderItem={this.renderItem}
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
            ListHeaderComponent={this.renderHeader}      
          />
        </View>
      </View>
    );
  }

  getSpecialLectures = async () => {
    const apiurl = global.url + 'getalllectures.php'
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

  onPickerValueChange = async (value) => {
    this.setState({ loading: true })
    this.setState({ category: value })
    //console.log(value);
    if (value === null) this.setState({ specialLectures: this.arrayholder})
    switch (value) {
      case 'routine':
        this.setState({ specialLectures: {'success':true, 'message':this.routine} });
        break;

      case 'special':
        this.setState({ specialLectures: {'success':true, 'message':this.special} });
        break;

      case 'speaker':
        this.setState({ specialLectures: {'success':true, 'message':this.speaker} });
        break;

      case 'mosque':
        this.setState({ specialLectures: {'success':true, 'message':this.mosque} });
        break;

      default:
        break;
    }
    this.setState({ loading: false })

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
export default Home;