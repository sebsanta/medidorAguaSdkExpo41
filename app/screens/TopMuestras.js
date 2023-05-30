import React, { useState, useEffect, useRef, useCallback } from "react";
import {Text, View} from "react-native";
import Toast from "react-native-easy-toast";
import { useFocusEffect } from "@react-navigation/native";
import ListTopMuesAgua from "../components/Ranking/ListTopMuesAgua";
import { firebaseApp } from "../utils/firebase"; 
import firebase from "firebase/app";
import "firebase/firestore";
import { NavigationRouteContext } from "@react-navigation/native";

const db = firebase.firestore(firebaseApp);

export default function TopMuestras(props){

console.log(props);
const { id,navigation } = props;
const [ locaciones, setLocaciones ] = useState([]);
const toastRef = useRef();

//console.log(locaciones);


useFocusEffect(
    useCallback(() => {
    db.collection("Locaciones")
        .orderBy("ppm", "asc")
    .limit(5)
    .get()
    .then((response) => {
        const locacionArray =  [];
        response.forEach((doc) => {
            //console.log(doc.data());
            const data = doc.data();
            data.id = doc.id;
            locacionArray.push(data);
        });
        setLocaciones(locacionArray);
    });
    return () => {
        //navigation.navigate("account");
    };
}, [])
);




/*useEffect(() => {
    db.collection("Locaciones")
    .orderBy("rating", "desc")
    .limit(5)
    .get()
    .then((response) => {
        const locacionArray =  [];
        response.forEach((doc) => {
            //console.log(doc.data());
            const data = doc.data();
            data.id = doc.id;
            locacionArray.push(data);
        });
        setLocaciones(locacionArray);
    });
}, []);
*/

    return(
        <View>
            <ListTopMuesAgua locaciones={locaciones} navigation={navigation} />
            <Toast 
                ref={toastRef} position="center" opacity={0.9}
            />
        </View> 

    );
}