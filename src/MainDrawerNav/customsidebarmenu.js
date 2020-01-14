import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, AsyncStorage } from 'react-native';
import { Icon, Avatar, Badge } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Divider } from './navigationdrawerstructure';

export default class CustomSidebarMenu extends Component {
  _isMounted = false;
  constructor() {
    super();
    //Setting up the Main Top Large Image of the Custom Sidebar
    this.profileImage =
      'https://aboutreact.com/wp-content/uploads/2018/07/sample_img.png';
    //Array of the sidebar navigation option with icon and screen to navigate
    //This screens can be any screen defined in Drawer Navigator in App.js
    //You can find the Icons from here https://material.io/tools/icons/
    this.items = [
      {
        navOptionThumb: 'home',
        navOptionName: 'HOME',
        screenToNavigate: 'HomeDrawer',
      },
      {
        navOptionThumb: 'list',
        navOptionName: 'LECTURES',
        screenToNavigate: 'LectureDrawer',
      },
      {
        navOptionThumb: 'star',
        navOptionName: 'FAVOURITES',
        screenToNavigate: 'FavouritesDrawer',
      },
      {
        navOptionThumb: 'edit',
        navOptionName: 'ADD/EDIT LECTURES',
        screenToNavigate: 'AddEditLecturesDrawer',
      },
      {
        navOptionThumb: 'search',
        navOptionName: 'SEARCH',
        screenToNavigate: 'SearchDrawer',
      },
      {
        navOptionThumb: 'cloud-download',
        navOptionName: 'DOWNLOADS',
        screenToNavigate: 'DownloadsDrawer',
      },
      {
        navOptionThumb: 'folder',
        navOptionName: 'RESOURCES',
        screenToNavigate: 'ResourcesDrawer',
      },
      {
        navOptionThumb: 'cog',
        navOptionName: 'SETTINGS',
        screenToNavigate: 'SettingsDrawer',
      },
      {
        navOptionThumb: 'sign-out',
        navOptionName: 'LOGOUT',
        screenToNavigate: 'LoginNavigator',
      },
    ];
    this.state = {
      fullname: null,
      photourl: null,
      count: [],
      roleid: 0,
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadInitialState().done();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadInitialState = async () => {
    const fullname = await retrieveData('fullname');
    const photourl = await retrieveData('photourl');
    const roleid = await retrieveData('roleid');

    await this.getUnviewedLectureCount();
    setInterval(() => { this.getUnviewedLectureCount() }, 1000);

    if (fullname !== null) {
      this.setState({
        fullname: fullname,
        photourl: photourl,
        roleid: roleid,
      });
    }
  }

  render() {
    return (
      <View style={styles.sideMenuContainer}>
        {/*Top Large Image */}
        <Avatar
          rounded
          size={wp('22%')}
          source={{ uri: this.state.photourl, }}
          containerStyle={{ marginVertical: wp('5%') }}
        />
        <Text>{this.state.fullname}</Text>
        {/*Divider between Top Image and Sidebar Option*/}
        <Divider />

        {/*Setting up Navigation Options from option array using loop*/}
        <View style={{ width: '100%' }}>
          {this.items.map((item, key) => (
            (item.navOptionThumb === 'edit') ?
              (this.state.roleid === '2') ?
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    backgroundColor: global.currentScreenIndex === key ? '#e0dbdb' : '#ffffff',
                  }}
                  key={key}
                >
                  <View style={{ marginRight: 10, marginLeft: 20 }}>
                    <Icon name={item.navOptionThumb} size={25} color="#808080" />
                  </View>
                  <Text
                    style={{
                      fontSize: 15,
                      color: global.currentScreenIndex === key ? 'red' : 'black',
                    }}
                    onPress={() => {
                      global.currentScreenIndex = key;
                      this.props.navigation.navigate(item.screenToNavigate);
                      item.navOptionName === 'LECTURES' && this.state.count.success === true ? this.onViewLectures() : null
                    }}
                  >
                    {item.navOptionName}
                  </Text>
                  <View style={{ marginLeft: 40 }}>
                    {(item.navOptionName === 'LECTURES' && this.state.count.success === true) ?
                      <Badge
                        value={this.state.count.message}
                        status="primary"
                        textStyle={{ alignContent: 'center', justifyContent: 'center' }}
                        onPress={() => this.onViewLectures()}
                      /> : null}
                  </View>
                </View>
                : null
              : <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 10,
                  paddingBottom: 10,
                  backgroundColor: global.currentScreenIndex === key ? '#e0dbdb' : '#ffffff',
                }}
                key={key}
              >
                <View style={{ marginRight: 10, marginLeft: 20 }}>
                  <Icon name={item.navOptionThumb} size={25} color="#808080" type='font-awesome' />
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: global.currentScreenIndex === key ? 'red' : 'black',
                  }}
                  onPress={() => {
                    global.currentScreenIndex = key;
                    item.navOptionName === 'LECTURES' && this.state.count.success === true ? this.onViewLectures() : null;

                    if (item.navOptionName === 'LOGOUT') {
                      logout(this.props.navigation.navigate)
                    }else{
                      this.props.navigation.navigate(item.screenToNavigate);
                    }
                    
                    //item.navOptionName === 'LECTURES' && this.state.count.success === true ? this.onViewLectures() : null;

                  }}
                >
                  {item.navOptionName}
                </Text>
                <View style={{ marginLeft: 40 }}>
                  {(item.navOptionName === 'LECTURES' && this.state.count.success === true) ?
                    <Badge
                      value={this.state.count.message}
                      status="primary"
                      textStyle={{ alignContent: 'center', justifyContent: 'center' }}
                      onPress={() => this.onViewLectures()}
                    /> : null}
                </View>
              </View>
          ))}
        </View>
      </View>
    );
  }

  getUnviewedLectureCount = async () => {
    const apiurl = global.url + 'getunviewedlectures.php';
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
      if (this._isMounted) {
        this.setState({ count: res })
      }
    }
    catch (err) {
      return console.log(err);
    }
  }

  onViewLectures = async () => {
    const apiurl = global.url + 'updateuserlecturenotification.php';
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
      console.log(res.message)
      if (res.success) {
        await this.getUnviewedLectureCount();
      }
      //return res;
    }
    catch (err) {
      console.log(err);
    }
  }
}
const styles = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 20,
  },
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 150,
    height: 150,
    marginTop: 20,
    borderRadius: 150 / 2,
  },
});