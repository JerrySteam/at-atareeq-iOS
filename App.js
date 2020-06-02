import React, { Component }  from 'react';
import { StyleSheet,} from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import './src/constants';
import './src/helperfunctions';

import IndexScreen from './src';

/**Start Stack Navigation Screen*/
import LoginScreen from './src/StartStack/login';
import ForgotPasswordScreen from './src/StartStack/forgotpassword';
import ResetPasswordScreen from './src/StartStack/resetpassword';

/**Create Account Stack Navigation Screen*/
import AccountRoleScreen from './src/CreateAccountStack/selectrole';
import AdminSignupScreen from './src/CreateAccountStack/adminsignup';
import UserSignupScreen from './src/CreateAccountStack/usersignup';

import MainDrawerNav from './src/MainDrawerNav'

//console.ignoredYellowBox = ["Warning: Can't"];
console.disableYellowBox = true;

const LoginStack = createStackNavigator({
  Login: {screen: LoginScreen,},
  ForgotPassword: {screen: ForgotPasswordScreen,},
  ResetPassword: {screen: ResetPasswordScreen,},
},{headerMode: 'screen'})

const AccountStack = createStackNavigator({
  AccountRole: {screen: AccountRoleScreen,},
  AdminSignup: {screen: AdminSignupScreen,},
  UserSignup: {screen: UserSignupScreen,},
},{headerMode: 'screen'});
 
const MainNavigator = createSwitchNavigator({
  Index: IndexScreen,
  LoginNavigator: LoginStack,
  AccountNavigator: AccountStack,
  MainDrawerNav: {screen: MainDrawerNav,},
},
{
  initialRouteName: 'Index',
});

const AppContainer =  createAppContainer(MainNavigator);

export default class App extends Component{
  render(){
    return (
      <AppContainer />
    );
  }
  
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //paddingTop: Constants.statusBarHeight,
  },
});

