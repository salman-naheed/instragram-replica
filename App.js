import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "./components/auth/Landing";
import { Register } from "./components/auth/Register";
import { Login } from "./components/auth/Login";
import Main from "./components/Main.";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk));

import firebase from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyA40UEwNpJjDKR7lgHD6z0qjuswKMw46Mw",
  authDomain: "insta-dev-e5a8b.firebaseapp.com",
  projectId: "insta-dev-e5a8b",
  storageBucket: "insta-dev-e5a8b.appspot.com",
  messagingSenderId: "62564337856",
  appId: "1:62564337856:web:690a4cda0fe8a000b98525",
  measurementId: "G-XF4M48M73P",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState ({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState ({
          loggedIn: true,
          loaded: true,
        })
      }
    });
  }
  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Loading</Text>
        </View>
      );
    }
  
  if(!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouterName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Login" component={Login} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return (
      <Provider store={store}>
      <Main/>
      </Provider>
    );
  }
}

export default App;
