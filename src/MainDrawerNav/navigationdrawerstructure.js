import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Button } from 'react-native-elements';

export default class NavigationDrawerStructure extends React.Component {
  //Structure for the navigatin Drawer
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <View style={{ flexDirection: 'row', paddingLeft: wp('5%')}}>
        <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
          <Icon name="bars" size={wp('7%')} color="#fff"/>
        </TouchableOpacity>
      </View>
    );
  }
}

export class HomeSearchButton extends React.Component {
  render() {
    //const {navigate} = this.props.navigation;
    return (
      <Button 
        type='outline'
        icon={<Icon name="search" size={wp('3.5%')} color="white"/>}
        title=" Search for lectures, speakers, mosques..."
        titleStyle={{color: '#fff', fontSize: wp('3.5%'), fontFamily: 'Helvetica',}}
        buttonStyle={{width: wp('80%'), borderRadius: wp('7%'), borderColor:'#fff',}}
        //onPress={() => navigate('Search')}
      />
    );
  }
}

export class Divider extends React.Component {
  render() {
    return (
      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: '#e2e2e2',
          marginTop: 15,
        }}
      />
    );
  }
}