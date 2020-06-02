import React, { Component } from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Button } from 'react-native';
import MapView from 'react-native-maps';
import Polyline from '@mapbox/polyline';
//import * as Permissions from 'expo-permissions';
//import Geolocation from 'react-native-geolocation-service';

//just sublime: latitude, longtitude and destination title. Dont touch anything
class MapViewScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isMapReady: false,
      latitude: 0,
      longitude: 0,
      error: null,
      concat: null,
      coords: [],
      x: 'false',
      //cordLatitude: parseFloat(this.props.navigation.getParam('cordLatitude', 0)),
      //cordLongitude: parseFloat(this.props.navigation.getParam('cordLongitude', 0)),
      cordLatitude: this.props.navigation.getParam('cordLatitude', 0),
      cordLongitude: this.props.navigation.getParam('cordLongitude', 0),
      destination: this.props.navigation.getParam('destination', "Lecture venue"),
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
        this.mergeLot();
      },
      (error) => this.setState({
        error: error.message, latitude: 0, longitude: 0
      }),
      { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },
    );
  }

  mergeLot = () => {
    if (this.state.latitude != 0 && this.state.longitude != 0) {
      let concatLoc = this.state.latitude + "," + this.state.longitude
      let concatDest = this.state.cordLatitude + "," + this.state.cordLongitude
      this.setState({
        concat: concatLoc
      }, () => {
        this.getDirections(concatLoc, concatDest);
      });
    }

  }

  getDirections = async (startLoc, destinationLoc) => {

    try {
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`)
      let respJson = await resp.json();
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      })
      this.setState({ coords: coords })
      this.setState({ x: "true" })
      return coords
    } catch (error) {
      this.setState({ x: "error" })
      return error
    }
  }

  onMapLayout = () => {
    this.setState({ isMapReady: true });
  }

  render() {
    return (
      <MapView
        style={styles.map}
        mapType='standard'
        showsScale
        showsCompass
        showsPointsOfInterest
        showsBuildings
        showsUserLocation={true}
        onLayout={this.onMapLayout}
        onPress={e => console.log(e.nativeEvent)}
        region={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: 0.0043,
          longitudeDelta: 0.0034
        }}
      >

        {this.state.latitude !== 0 && this.state.longitude !== 0 && this.state.isMapReady && <MapView.Marker
          coordinate={{ "latitude": this.state.latitude, "longitude": this.state.longitude }}
          title={"Your Location"}
        />}

        {this.state.cordLatitude !== 0 && this.state.cordLongitude !== 0 && this.state.isMapReady && <MapView.Marker
          coordinate={{ "latitude": this.state.cordLatitude, "longitude": this.state.cordLongitude }}
          title={this.state.destination}
        />}

        {this.state.latitude !== 0 && this.state.longitude !== 0 && this.state.x == 'true' && this.state.isMapReady && <MapView.Polyline
          coordinates={this.state.coords}
          strokeWidth={2}
          strokeColor="red" />
        }

        {this.state.latitude !== 0 && this.state.longitude !== 0 && this.state.x == 'error' && this.state.isMapReady && <MapView.Polyline
          coordinates={[
            { latitude: this.state.latitude, longitude: this.state.longitude },
            { latitude: this.state.cordLatitude, longitude: this.state.cordLongitude },
          ]}
          strokeWidth={2}
          strokeColor="red" />
        }
      </MapView>
    );
  }

  getRegionForCoordinates = (points) => {
    // points should be an array of { latitude: X, longitude: Y }
    let minX, maxX, minY, maxY;

    // init first point
    ((point) => {
      minX = point.latitude;
      maxX = point.latitude;
      minY = point.longitude;
      maxY = point.longitude;
    })(points[0]);

    // calculate rect
    points.map((point) => {
      minX = Math.min(minX, point.latitude);
      maxX = Math.max(maxX, point.latitude);
      minY = Math.min(minY, point.longitude);
      maxY = Math.max(maxY, point.longitude);
    });

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const deltaX = (maxX - minX);
    const deltaY = (maxY - minY);

    return {
      latitude: midX,
      longitude: midY,
      latitudeDelta: deltaX,
      longitudeDelta: deltaY
    };
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
  }
});

export default MapViewScreen;