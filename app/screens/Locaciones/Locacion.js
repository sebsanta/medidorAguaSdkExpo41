import React, { useEffect, useState , useCallback, useRef } from 'react';
import { StyleSheet, ScrollView, Text, View , Dimensions, LogBox } from 'react-native';
import { Rating , ListItem, Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import { map } from "lodash";
import Loading from "../../components/Loading";
import CarouselImages from "../../components/Carousel";
import ListReviews from "../../components/Locaciones/ListReviews";
import Map from "../../components/Map";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

export default function Locacion(props) {
    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
        }, [])
    //console.log(props);
    const { navigation, route , ppm, region} = props;
    const { id, name } = route.params; 
    const [ locacion, setLocacion ] = useState(null);
    const [ rating, setRating ] = useState(0);
    const [ reviews, setReviews] = useState([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userLogged, setUserLogged] = useState(false);
    const toastRef = useRef();
  
   
    useEffect(() => {
        navigation.setOptions({title: name});
    }, []);
    
    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    })

    useFocusEffect(
        useCallback(() => {
            db.collection("Locaciones")
            .doc(id)
            .get()
            .then((response) => {
                 const data = response.data();
                 data.id = response.id;
                 setLocacion(data);
                 setRating(data.rating);
                 //console.log(response.data());
            });
            return () => {
                //navigation.goBack();
            };
         }, [])
    );


    useEffect(() => {
       if(userLogged && locacion){
           db.collection("Favorites")
           .where("idLocacion", "==" , locacion.id)
           .where("idUser", "==", firebase.auth().currentUser.uid)
           .get()
           .then((response) => {
               if(response.docs.length === 1){
                    setIsFavorite(true);
               };
           });
       }
    }, [userLogged, locacion])


    const addFavorites = () => {
        if(!userLogged ){
            toastRef.current.show("Para usar el sistema de favoritos tienes que estar loggeado");
        } else {
            const payload = {
                idUser: firebase.auth().currentUser.uid,
                idLocacion: locacion.id
            }
            db.collection("Favorites")
            .add(payload)
            .then(() => {
                setIsFavorite(true);
                toastRef.current.show("Locación se ha añadido a favoritos");
            })
            .catch(() => {
                toastRef.current.show("Error al añadir la locación a favoritos"); 
            });
        }
    };

    const removeFavorites = () => {
        db.collection("Favorites")
          .where("idLocacion", "==" , locacion.id)
          .where("idUser", "==", firebase.auth().currentUser.uid)
          .get()
          .then((response) => {
             response.forEach((doc) => {
                const idFavorite = doc.id;
                db.collection("Favorites")
                .doc(idFavorite)
                .delete()
                .then(() => {
                    setIsFavorite(false);
                    toastRef.current.show("Locación eliminada de lista de favoritos");
                })
                .catch(() => {
                    toastRef.current.show("Error al eliminar la locación de favoritos");
                });
             });
          });
    };

    
    

    if(!locacion) return <Loading isVisible={true} text="Cargando..." />;

    return (
        <ScrollView vertical style={styles.viewBody}>
            <View style={styles.viewFavorite}>
                <Icon 
                    type="material-community"
                    name={isFavorite ? "heart" : "heart-outline"}
                    onPress={isFavorite ? removeFavorites : addFavorites}
                    color={isFavorite ? "#F00" : "#000"}
                    size={35}
                    underlayColor="transparent"
                />
            </View>
           <CarouselImages 
                arrayImages={locacion.images}
                height={250}
                width={screenWidth}
           />
           <TitleLocacion 
                region={locacion.region}
                name={locacion.name}
                description={locacion.description}
                rating={rating}
                ppm={locacion.ppm}
                createAt={locacion.createAt}
           />
          
           <LocacionInfo 
                region={locacion.region}
                location={locacion.location}
                name={locacion.name}
                address={locacion.adress}
           />
           <ListReviews
                navigation={navigation}
                idLocacion={locacion.id}
                setRating={setRating}
           />
           <Toast ref={toastRef} position="center" opacity={0.9}/>
        </ScrollView>
    );
    
}

function TitleLocacion(props){
    const { name, region, ppm, description, rating, createAt } = props;
    const createReview = new Date(createAt.seconds * 1000);
    return(
        <View style={styles.viewLocacionTitle}>
            <View style={{ frexDirection: "row"}}>
                <Text style={styles.nameLocacion}>Región: {region}</Text>
                <Text style={styles.nameLocacion}>Comuna: {name}</Text>
                <Rating 
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.ppmInfo}>Medición PPM: {ppm}</Text>
            <Text style={styles.descriptionLocacion}>
                Descripción: {description}
            </Text>
            <Text style={styles.descriptionLocacion}>Fecha: {createReview.getDate()}/{createReview.getMonth() + 1}/
                            {createReview.getFullYear()} - {createReview.getHours() < 10 ? "0" : ""}
                            {createReview.getHours()}:{createReview.getMinutes() < 10 ? "0" : ""}
                            {createReview.getMinutes()}
            </Text>
           
        </View>
    )
};



function LocacionInfo(props){
    const{ location, name, address } = props;

    const listInfo = [
        {
            text: address,
            iconName: "map-marker",
            iconType: "material-community",
            action : null,
        },
    ];

    return(
        <View style={styles.viewLocacionInfo}>
            <Text style={styles.locacionInfoTitle}>
                Información sobre Locación.
            </Text>
            <Map 
                location={location}
                name={name}
                height={140}
            />
            {map(listInfo, (item, index) => (
                <ListItem 
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name: item.iconName,
                        type: item.iconType,
                        color:"#4285F4",
                    }}
                    containerStyle={styles.containerListItem}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor: "#fff",
    },
    viewLocacionTitle:{
        padding:15,
    },
    nameLocacion:{
        fontSize:20,
        fontWeight:"bold",
    },
    descriptionLocacion:{
        marginTop:5,
        color:"grey",
    },
    ppmInfo:{
        marginTop:5,
        color:"grey",
    },
    rating:{
        position:"absolute",
        right:0,
    },
    viewLocacionInfo:{
        margin: 15,
        marginTop: 25,
    },
    locacionInfoTitle:{
        fontSize:20,
        fontWeight:"bold",
        marginBottom:10,
    },
    containerListItem:{
        borderBottomColor:"#d8d8d8",
        borderBottomWidth:1,
    },
    viewFavorite:{
        position:"absolute",
        top:0,
        right:0,
        zIndex:2,
        backgroundColor:"#fff",
        borderRadius:100,
        padding:5,
        //paddingLeft:15,
    },
    reviewDate:{
        marginTop:5,
        color:"grey",
        fontSize:12,
        position:"absolute",
        
        bottom:0,
    },
});
