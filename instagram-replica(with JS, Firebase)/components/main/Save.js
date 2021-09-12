import React, { useState } from "react";
import { View, TextInput, Image, Button } from "react-native";
import firebase from "firebase";
import { NavigationContainer } from "@react-navigation/native";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function Save(props) {
  console.log("props", props.route.params.image);
  const [caption, setCaption] = useState("");

  const uploadImage = async () => {
    const image = props.route.params.image;
    const res = await fetch(image);
    const blob = await res.blob();
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    console.log("childPath", childPath);
    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = snapshot => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted =() => {
        console.log('at taskCompleted outer');
    task.snapshot.ref.getDownloadURL().then((snapshot) => {
        console.log('at taskCompleted inner');
        savePostData(snapshot);
        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  }

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        downloadURL,
        caption,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        props.navigation.popToTop();
      });
  }
  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Write a caption..."
        onChangeText={(caption) => setCaption(caption)}
      />
      <Button title="Save" onPress={() => uploadImage()} />
    </View>
  );
}
