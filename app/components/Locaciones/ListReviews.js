import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button, Avatar, Rating } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { map } from "lodash";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function ListReviews(props) {

    const { navigation, idLocacion, setRating } = props;
    const [ userLogged, setUserLogged ] = useState(false);
    const [reviews, setReviews] = useState([]);
    //console.log(reviews);


    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });


    useFocusEffect(
        useCallback(() => { 
            db.collection("Reviews")
            .where("idLocacion", "==" , idLocacion)
            //.orderBy("createAt", "desc")
            .get()
            .then((response)=> {
                const resultReview = [];
                response.forEach(doc => {
                    const data = doc.data();
                    data.id = doc.id;
                    resultReview.push(data);
                });
                
                const orderResultView = resultReview.sort((a, b) => {
                 a = new Date(a.createAt.seconds * 1000);
                 b = new Date(b.createAt.seconds * 1000);
                return a > b ? -1 : a < b ? 1 : 0;
            });
            setReviews(orderResultView);
        });
    }, [])
    );

    return (
        <View>
            {userLogged ? (
                <View>
                <Button 
                    title="Escribe una opinión"
                    buttonStyle={styles.btnAddReview}
                    titleStyle={styles.btnTitleAddCommnent}
                    icon={{
                        type: "material-community",
                        name: "square-edit-outline",
                        color: "#4285F4",
                    }}
                    onPress={() => navigation.navigate("add-review-locacion", {
                        idLocacion: idLocacion,
                    })}
                />
                    <Text style={styles.OpinionesReseñas}>Información sobre reseñas</Text>
                </View>
            ) : (
                <View>
                    <Text 
                        style={{ textAlign: "center", color:"#4285F4", padding:20 }}
                        onPress={() => navigation.navigate("account")}>
                            Para escribir un comentario es necesario estar logeado { " " }
                            <Text style={{ fontWeight: "bold"}}>
                                pulsa AQUÍ para Iniciar Sesión
                            </Text>
                    </Text>       
                </View>
            )}
            {map(reviews, (review, index) => (
                <Review 
                    key={index}
                    review={review}
                />
            ))}
        </View>
    );
}

function Review(props){
    const { title, review, rating, createAt, avatarUser, ppm } = props.review;
    const createReview = new Date(createAt.seconds * 1000);

    //console.log(props);

    return( 
        <View style={styles.viewReview}>
            <View style={styles.viewImageAvatar} >
                    <Avatar 
                        size="large"
                        rounded
                        containerStyle={styles.imageAvatarUser}
                        source={avatarUser ? { uri: avatarUser }: require("../../../assets/img/no-image.png")}
                    />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.reviewText}>{review}</Text>
                <Text style={styles.reviewPPM}>Medición PPM: {ppm}</Text>
                <Rating 
                    imageSize={15}
                    startingValue={rating}
                    readonly
                />
                <Text style={styles.reviewDate}>{createReview.getDate()}/{createReview.getMonth() + 1}/
                            {createReview.getFullYear()} - {createReview.getHours() < 10 ? "0" : ""}
                            {createReview.getHours()}:{createReview.getMinutes() < 10 ? "0" : ""}
                            {createReview.getMinutes()}
                </Text>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    btnAddReview:{
        backgroundColor: "#EBEDEF",
        borderRadius:10,
        //fontWeight:"bold",
    },
    btnTitleAddCommnent:{
        color:"#4285F4",
        fontWeight:"bold",
        fontSize:17,
    },
    viewReview:{
        flexDirection: "row",
        padding:10,
        paddingBottom:10,
        paddingTop:20,
        borderBottomWidth:1,
        borderBottomColor:"#e3e3e3",
    },
    viewImageAvatar:{
        marginRight:15,
    },
    imageAvatarUser:{
        width:50,
        height:50,
    },
    viewInfo:{
        flex:1,
        alignItems:"flex-start",
    },
    reviewTitle:{
        fontWeight:"bold",
    },
    reviewText:{
        paddingTop:2,
        color:"grey",
        marginBottom:5,
    },
    reviewPPM:{
        paddingTop:0,
        color:"grey",
        marginBottom:5,
    },
    reviewDate:{
        marginTop:5,
        color:"grey",
        fontSize:12,
        position:"absolute",
        right:0,
        bottom:0,
    },
    OpinionesReseñas:{
        fontSize:20,
        paddingLeft:15,  
        paddingTop:20,
        fontWeight:"bold",
        color:"black",
        

    },
});
