import React from 'react'
import {View, TextInput, Image, Button} from 'react-native'
import firebase from 'firebase';
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Save(props){
    console.log('props', props.route.params.image)
    const [caption, setCaption] = useState("")
    const image = props.route.params.image;
    const uploadImage = async () => {
        const res = await fetch(image);
        const blob = await res.blob();
    }

    return(
        <View style={{flex: 1}}>
        <TextInput
        placeholder="Write a caption..."
        onChangeText={(caption) => setCaption(caption)}
        />
        <Button title="Save"
            onPress={()=> uploadImage()}
        />
        </View>
    )
}