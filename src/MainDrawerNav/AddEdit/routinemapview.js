import React, { Component } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import MapView from 'react-native-maps';
//import Polyline from '@mapbox/polyline';
//import * as Permissions from 'expo-permissions';
//import Geolocation from 'react-native-geolocation-service';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

//just sublime: latitude, longtitude and destination title. Dont touch anything
class MapViewScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMapReady: false,
      latitude: 0,
      longitude: 0,
      error: null,
      isLoading: false,
    }
  }

  componentDidMount() {
    this.getCurrentLocation();
  }

  getCurrentLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({
        error: error.message, latitude: 0, longitude: 0
      }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }

  onMapLayout = () => {
    this.setState({ isMapReady: true });
  }

  onPressMapView = (e) => {
    if (e.action === "press") {
      this.setState({
        latitude: e.coordinate.latitude,
        longitude: e.coordinate.longitude,
      });
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={styles.map}
          mapType='standard'
          showsScale
          showsCompass
          showsPointsOfInterest
          showsBuildings
          showsUserLocation={true}
          onLayout={this.onMapLayout}
          onPress={e => this.onPressMapView(e.nativeEvent)}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0043,
            longitudeDelta: 0.0034
          }}
        >
          {this.state.latitude !== 0 && this.state.longitude !== 0 && this.state.isMapReady && <MapView.Marker
            coordinate={{
              "latitude": this.state.latitude,
              "longitude": this.state.longitude
            }}
            title={"Your Location"}
          />}
        </MapView>
        {this.state.latitude !== 0 && this.state.longitude !== 0 && this.state.isMapReady &&
          <View style={{ position: 'absolute', alignSelf: 'center', bottom: 0, }}>
            <Button
              title="PICK THIS LOCATION"
              titleStyle={styles.loginButtonTitle}
              buttonStyle={styles.loginButton}
              icon={{ name: "map-marker", type: "font-awesome", size: wp('5%'), color: "white" }}
              loading={this.state.isLoading}
              disabled={this.state.isLoading}
              loadingProps={{ color: '#000' }}
              onPress={() => this.props.navigation.navigate('AddRoutineTaleem',{
                latitude: this.state.latitude,
                longitude: this.state.longitude
              })}
            />
          </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
  },
});

export default MapViewScreen;