import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, AsyncStorage, ImageBackground, } from 'react-native';
import { Icon, Avatar, Badge } from 'react-native-elements';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Divider } from './navigationdrawerstructure';
import { ScrollView } from 'react-native-gesture-handler';

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
    ];
    this.state = {
      fullname: null,
      photourl: '',
      count: [],
      roleid: 0,
      favCount: 0,
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
    setInterval(() => {
      this.getUnviewedLectureCount();
      this.getFavouriteLectureCount();
    }, 1000);

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
      <ImageBackground
        source={require('../../backgroundimage/login.png')}
        style={styles.backgroundImage}
        blurRadius={2}>

        <View style={styles.sideMenuContainer}>
          {/*Top Large Image */}
          <Avatar
            rounded
            size={wp('22%')}
            source={{ uri: this.state.photourl, }}
            containerStyle={{ marginVertical: wp('5%') }}
          />
          <Text style={{ color: '#fff', fontSize: wp('5%') }}>{this.state.fullname}</Text>
          {/*Divider between Top Image and Sidebar Option*/}
          <Divider />
          {/*Setting up Navigation Options from option array using loop*/}
          <View style={{ width: '100%' }}>
            <ScrollView>
              {this.items.map((item, key) => (
                (item.navOptionThumb === 'edit') ?
                  (this.state.roleid === '2') ?
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingTop: wp('3.5%'),
                        paddingBottom: wp('3.5%'),
                        backgroundColor: 'transparent',
                        //backgroundColor: global.currentScreenIndex === key ? '#e0dbdb' : '#ffffff',
                      }}
                      key={key}
                    >
                      <View style={{ marginRight: 10, marginLeft: 20 }}>
                        <Icon name={item.navOptionThumb} size={23} color={global.currentScreenIndex === key ? '#808080' : '#fff'} />
                      </View>
                      <Text
                        style={{
                          position: 'absolute', left: wp('15%'),
                          fontSize: wp('4.17%'),
                          color: global.currentScreenIndex === key ? '#808080' : '#fff',
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
                      paddingTop: wp('3.5%'),
                      paddingBottom: wp('3.5%'),
                      backgroundColor: 'transparent',
                      //backgroundColor: global.currentScreenIndex === key ? '#e0dbdb' : '#ffffff',
                    }}
                    key={key}
                  >
                    <View style={{ marginRight: 10, marginLeft: 20 }}>
                      <Icon name={item.navOptionThumb} size={23} color={global.currentScreenIndex === key ? '#808080' : '#fff'} type='font-awesome' />
                    </View>
                    <Text

                      style={{
                        position: 'absolute', left: wp('15%'),
                        fontSize: wp('4.17%'),
                        color: global.currentScreenIndex === key ? '#808080' : '#fff',
                      }}
                      onPress={() => {
                        global.currentScreenIndex = key;
                        item.navOptionName === 'LECTURES' && this.state.count.success === true ? this.onViewLectures() : null;
                        this.props.navigation.navigate(item.screenToNavigate);
                        // if (item.navOptionName === 'LOGOUT') {
                        //   logout(this.props.navigation.navigate)
                        // } else {
                        //   this.props.navigation.navigate(item.screenToNavigate);
                        // }
                      }}
                    >
                      {item.navOptionName}
                    </Text>
                    {(item.navOptionName === 'LECTURES' &&
                      this.state.count.message > 0) ?
                      <View style={{ position: 'absolute', right: wp('8%') }}>
                        <Badge
                          value={this.state.count.message}
                          status="primary"
                          textStyle={{ alignContent: 'center', justifyContent: 'center' }}
                          onPress={() => this.onViewLectures()}
                        />
                      </View>
                      : null}

                    {(item.navOptionName === 'FAVOURITES' && this.state.favCount.message > 0) ?
                      <View style={{ position: 'absolute', right: wp('8%') }}>
                        <Badge
                          value={this.state.favCount.message}
                          status="primary"
                          textStyle={{ alignContent: 'center', justifyContent: 'center' }}
                          onPress={() => this.props.navigation.navigate(item.screenToNavigate)}
                        />
                      </View>
                      : null}
                  </View>
              ))}

              <Divider />
              <View style={{ width: '100%'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: wp('3%'),
                    paddingBottom: wp('3.5%'),
                    backgroundColor: 'transparent',
                  }}
                >
                  <View style={{ marginRight: 10, marginLeft: 20 }}>
                    <Icon name='sign-out' size={23} color='#fff' type='font-awesome' />
                  </View>
                  <Text
                    style={{
                      position: 'absolute', left: wp('15%'), fontSize: wp('4.17%'), color: '#fff',
                    }}
                    onPress={() => {
                      logout(this.props.navigation.navigate)
                      //this.props.navigation.navigate('LoginNavigator');  
                    }}
                  >
                    LOGOUT
                  </Text>
                </View>
              </View>
            </ScrollView>
          </View>

        </View>
      </ImageBackground>
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

  getFavouriteLectureCount = async () => {
    const apiurl = global.url + 'getfavouritelectures.php';
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
        this.setState({ favCount: res })
      }
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
  },
  sideMenuContainer: {
    width: '100%',
    height: '100%',
    //backgroundColor: '#fff',
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