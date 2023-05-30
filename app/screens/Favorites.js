import React, { useState , useRef , useCallback } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { Image, Icon, Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../components/Loading";
import { useFocusEffect } from "@react-navigation/native"
import { firebaseApp } from "../utils/firebase";
import firebase from "firebase";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function Favorites(props){

const { navigation } = props;
const [locaciones, setLocaciones] = useState(null);
const [userLogged, setUserLoggued] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [reloadData, setReloadData] = useState(false);
const toastRef = useRef();


//console.log(props);

firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLoggued(true) : setUserLoggued(false);
})

useFocusEffect(
    useCallback(() => {
        if(userLogged){
            const idUser = firebase.auth().currentUser.uid;
            db.collection("Favorites")
            .where("idUser", "==" , idUser)
            .get()
            .then((response) => {
                const idLocacionArray = [];
                response.forEach((doc) => {
                    idLocacionArray.push(doc.data().idLocacion);
                });
                getDataLocaciones(idLocacionArray).then((response) => {
                    const locaciones = [];
                    response.forEach((doc)=> {
                        const locacion = doc.data();
                        locacion.id = doc.id;
                        locaciones.push(locacion);
                    });
                    setLocaciones(locaciones);
                });
            });
        }
        setReloadData(false);
    }, [userLogged, reloadData])
);



const getDataLocaciones = (idLocacionArray) => {
    const arrayLocaciones = [];
    idLocacionArray.forEach((idLocacion) => {
        const result = db.collection("Locaciones").doc(idLocacion).get();
        arrayLocaciones.push(result);
    })
    return Promise.all(arrayLocaciones);
};

if(!userLogged){
    return <UserNoLogged navigation={navigation}/>;
}

if(!locaciones ){
    return <Loading isVisible={true} text="Cargando Locaciones"/>
} else if(locaciones?.length === 0){
    return <NotFoundLocaciones />
}

    return (
        <View style={styles.viewBody}>
            {locaciones ? (
                <FlatList 
                    data={locaciones}
                    renderItem={(locacion) => (
                        <Locacion locacion={locacion} 
                                  setIsLoading={setIsLoading} 
                                  toastRef={toastRef} 
                                  setReloadData={setReloadData}
                                  navigation={navigation}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            ) : (
                <View style={styles.loaderLocaciones}>
                    <ActivityIndicator size="large"/>  
                    <Text style={{ textAlign: "center" }}>Cargando locaciones</Text>
                </View>
            )}
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading text="Eliminando locación" isVisible={isLoading}/>
        </View>
    );
}

function NotFoundLocaciones(){
    return (
        <View style={{ flex:1, alignItems:"center", justifyContent:"center"}}>
            <Icon type="material-community" name="alert-outline" size={50}/>
            <Text style={{ fontSize: 20, fontWeight: "bold"}}>
                No tienes locaciones en tu lista
            </Text>
        </View>
    );
}

function UserNoLogged(props) {
    const { navigation } = props;
    return(
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Icon type="material-community" name="alert-outline" size={50} />
            <Text style={{ fontSize:20, fontWeight:"bold", textAlign:"center"}}>
                Necesitas estar loggeado para ver esta sección
            </Text>
            <Button 
                title="Ir al Loggin"
                containerStyle={{ marginTop: 20, width:"80%"}}
                buttonStyle={{backgroundColor:"#00a680"}}
                onPress={() => navigation.navigate("account",{screen: "login"})}
            />
        </View>
    );
}

function Locacion(props){
    const { locacion , setIsLoading, toastRef , setReloadData, navigation} = props;
    const { id, name, images } = locacion.item;

    const confirmRemoveFavorite = () => {
        Alert.alert(
            "Eliminar locación de Favoritos",
            "¿Estás seguro que quieres eliminar la locación de Favoritos?",
            [
                {
                    text : "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Eliminar",
                    onPress: removeFavorite,
                },
            ],
            {
                cancelable: false
            }
        );
    };

    const removeFavorite = () => {
       setIsLoading(true);
       db.collection("Favorites")
       .where("idLocacion", "==", id)
       .where("idUser", "==", firebase.auth().currentUser.uid)
       .get()
       .then((response) => {
            response.forEach((doc)=>{
                const idFavorite = doc.id;
                db.collection("Favorites")
                .doc(idFavorite)
                .delete()
                .then(()=>{
                    setIsLoading(false);
                    setReloadData(true);
                    toastRef.current.show("Se ha eliminado la locación de Favoritos",1000)
                })
                .catch(()=> {
                    setIsLoading(false);
                    toastRef.current.show("Error al eliminar locación de Favoritos",1000)
                });
            });
       });
    };
    
    return(
        <View style={styles.locacion}>
            <TouchableOpacity onPress={() => navigation.navigate("locaciones", { screen: "locacion", params: {id}, })}>
                <Image 
                    resizeMode="cover"
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator color="#fff"/>}
                    source={
                        images[0]
                        ? {uri: images[0]}
                        : require("../../assets/img/no-image.png")
                    }
                />
                <View style={styles.info}>
                    <Text style={styles.name}>{name}</Text>
                    <Icon 
                        type="material-community"
                        name="heart"
                        color="#f00"
                        containerStyle={styles.favorites}
                        onPress={confirmRemoveFavorite}
                        underlayColor="transparent"
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody:{
        flex:1,
        backgroundColor:"#f2f2f2",
    },
    loaderLocaciones:{
        marginTop:10,
        marginBottom:10,
    },
    locacion:{
        margin:20,
    },
    image:{
        width:"100%",
        height:180,
    },
    info:{
        flex:1,
        alignItems:"center",
        justifyContent:"space-between",
        flexDirection:"row",
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:10,
        marginTop:-30,
        backgroundColor:"#fff",
    },
    name:{
        fontWeight:"bold",
        fontSize:23,
    },
    favorites:{
        marginTop:-35,
        backgroundColor:"#EBEEF1",
        padding:15,
        borderRadius:100,
    },
})