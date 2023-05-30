import React, { useState, useEffect , useRef } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { AirbnbRating, Button, Input } from "react-native-elements";
import { LogBox } from 'react-native';
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddReviewLocacion(props) {
    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }, [])

    const { navigation, route } = props;
    const { idLocacion } = route.params;
    const [rating, setRating] = useState(null);
    const [ppmNumber, setPpmNumber] = useState("");
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();

    const addReview = () => {
        if(!rating ){
            toastRef.current.show("No has entregado ninguna puntuación");
        }
        else if(!ppmNumber){
            toastRef.current.show("Debes entregar la medición de PPM");
        }
        else if(!title){
            toastRef.current.show("Debes colocar un título");
        }
        else if(!review){
            toastRef.current.show("Debes colocar un comentario");
        }
        else{
            setIsLoading(true);
            const user = firebase.auth().currentUser;
            const payload = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                idLocacion: idLocacion,
                title: title,
                review: review,
                ppm:ppmNumber,
                rating: rating,
                createAt: new Date(),
            };
            db.collection("Reviews")
            .add(payload)
            .then(()=> {
                 updateLocacion()
                 //console.log("rapido");
                 //setIsLoading(false);
            })
            .catch(()=> {
                toastRef.current.show("Error al enviar review");
                setIsLoading(false);
            });
        }
    };

    const updateLocacion = () => {
        const locacionRef = db.collection("Locaciones").doc(idLocacion);

        locacionRef.get().then((response)=> {
            const locacionData = response.data();
            const ratingTotal = locacionData.ratingTotal + rating;
            const quantityVoting = locacionData.quantityVoting + 1;
            const ratingResult = ratingTotal/quantityVoting;

            locacionRef.update({
                rating: ratingResult,
                ratingTotal,
                quantityVoting,
            }).then(()=> {
                setIsLoading(false);
                navigation.goBack();
            });
        });
    };

    //console.log(idLocacion);

    return (
        <ScrollView style={styles.ScrollView}>
        <View style={styles.viewBody}>
            <Text style={styles.textoPuntuacion}>Ingresa una puntuación</Text>
            <View style={styles.viewRating}>
                <AirbnbRating 
                    count={5}
                    reviews={[
                        "Pésimo",
                        "Deficiente",
                        "Normal",
                        "Muy bueno",
                        "Excelente"
                    ]}
                    defaultRating={0}
                    size={35}
                    onFinishRating={(value)=> {setRating(value)}}
                />
            </View>
            <View style={styles.formReview}>
                <Input 
                    keyboardType="numeric"
                    placeholder="Ingrese los PPM"
                    containerStyle={styles.input}
                        onChange={(e) => setPpmNumber(e.nativeEvent.text)}
                />
                <Input 
                    placeholder="Agrega un título"
                    containerStyle={styles.input}
                    onChange={(e)=> setTitle(e.nativeEvent.text)}
                />
                <Input 
                    placeholder="Escribe un comentario"
                    title="Comentario"
                    multiline={true}
                    containerStyle={styles.textArea}
                    //inputContainerStyle={styles.textArea}
                    onChange={(e)=> setReview(e.nativeEvent.text)}
                />
                <Button 
                    title="Enviar Comentario"
                    containerStyle={styles.btnContainer}
                    buttonStyle= {styles.btn}
                    onPress={addReview}
                />
            </View>
            <Toast 
                    ref={toastRef} 
                    position="center" 
                    opacity={0.9}  
            />
            <Loading 
                    isVisible={isLoading}
                    text="Enviando comentario"
            />
        </View>
        </ScrollView>
    );
}



const styles = StyleSheet.create({
    ScrollView: {
        height: "100%",
    },
    viewBody:{
        flex:1,
    },  
    viewRating:{
        height:110,
        backgroundColor:"#f2f2f2",
        paddingBottom:20,
    },
    formReview:{
        flex:1,
        alignItems:"center",
        margin:10,
        marginTop:40,
    },
    input:{
        marginBottom:10,
        borderRadius:10,
        backgroundColor:"#d6dbdf",
    },
    textArea:{
        height:150,
        width:"100%",
        padding:0,
        margin:0,
        backgroundColor:"#d6dbdf",
        borderRadius:10,
    },
    btnContainer:{
        flex:1,
        justifyContent:"flex-end",
        marginTop:20,
        marginBottom:10,
        width:"95%",
    },
    btn:{
        backgroundColor:"#4285F4",
    },
    textoPuntuacion:{
        paddingTop:20,
        textAlign:"center",
        alignItems:"center",
        justifyContent:"center",
        fontSize:25,
        fontWeight:"bold",
        color: "grey",
    },
});
