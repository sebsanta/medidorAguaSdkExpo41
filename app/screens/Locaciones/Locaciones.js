import React, { useState, useEffect, useCallback } from "react";
import {StyleSheet, View, Text} from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListLocaciones from "../../components/Locaciones/ListLocaciones";

const db = firebase.firestore(firebaseApp);

export default function Locaciones(props){
    const { navigation } = props;
    const [user, setUser] = useState(null);
    const [locaciones, setLocaciones] = useState([]);
    const [totalLocaciones, setTotalLocaciones] = useState(0);
    const [startLocaciones, setStartLocaciones] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const limitLocaciones = 6;


    //console.log(totalLocaciones);
    //console.log(props);
    //console.log(locaciones);

   


    useEffect(() => {
       firebase.auth().onAuthStateChanged((userInfo) => {
           //console.log(userInfo);
           setUser(userInfo);
       });
    }, []);

    useFocusEffect(
        useCallback(() => {
            db.collection("Locaciones")
            .get()
            .then((snap) => {
              setTotalLocaciones(snap.size);
            }); 
      
            const resultLocaciones = [];
            db.collection("Locaciones")
            .orderBy("createAt", "desc")
            .limit(limitLocaciones)
            .get()
            .then((response) => {
              setStartLocaciones(response.docs[response.docs.length -1]);
      
              response.forEach((doc) => {
                  const locacion = doc.data();
                  locacion.id = doc.id;
                  resultLocaciones.push(locacion);
              });
              setLocaciones(resultLocaciones);
            });
        }, [])
    );


    const handleLoadMore = () =>{
        const resultLocaciones = [];
        locaciones.length < totalLocaciones && setIsLoading(true);

        db.collection("Locaciones")
        .orderBy("createAt", "desc")
        .startAfter(startLocaciones.data().createAt)
        .limit(limitLocaciones)
        .get()
        .then((response) => {
            if(response.docs.length > 0) {
                setStartLocaciones(response.docs[response.docs.length - 1]);
            } else {
                setIsLoading(false);
            }
            response.forEach((doc) => {
                const locacion = doc.data();
                locacion.id = doc.id;
                resultLocaciones.push(locacion);
            });
            setLocaciones([...locaciones, ...resultLocaciones ]);
        });
    };

    return(
        <View style={styles.viewBody}>
            <ListLocaciones 
                locaciones={locaciones}
                handleLoadMore={handleLoadMore}
                isLoading={isLoading}
            />
            {user && (
                 <Icon 
                 reverse
                 type="material-community"
                 name="plus"
                 color="#4285f4"
                 containerStyle={styles.btnContainer}
                 onPress={() => navigation.navigate("add-locaciones")}
             />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor:"#fff",
    },
    btnContainer:{
        position: "absolute",
        bottom:10,
        right:10,
        shadowColor: "black",
        //textShadowOffset:{ width: 2, height:2 },
        shadowOpacity:0.5,
    },
});