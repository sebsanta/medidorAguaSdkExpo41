import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Alert, Dimensions, LogBox } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import { map, size , filter } from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import Modal from "../Modal";
import Informacion from "../Informacion";
import { useNavigation } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function AddLocacionesForm(props){
    LogBox.ignoreLogs(['Failed prop type']);
    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
        }, [])

    const { toastRef, setIsLoading, navigation } = props;
    const [locacionName, setLocacionName] = useState("");
    const [regionName, setRegionName] = useState("");
    const [locacionAdress, setLocacionAdress] = useState("");
    const [locacionDescripcion, setLocacionDescripcion] = useState("");
    const [ppmNumber, setPpmNumber] = useState("");
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationLoc, setLocationLoc] = useState(null);
    
    
    const addLocacion = () => {
       
        if(!locacionName || !locacionAdress || !locacionDescripcion || !ppmNumber){
            toastRef.current.show("Todos los campos del formulario son obligatorios",1500);
        } else if(size(imageSelected) === 0) {
            toastRef.current.show("Debes subir a lo menos una foto",1500);
        } else if(!locationLoc){
            toastRef.current.show("Se tiene que localizar el punto de extraccion en el mapa", 2000);
        }else{
            setIsLoading(true);
            uploadImageStorage().then(response => {
                //console.log(response);
                setIsLoading(false);
                db.collection("Locaciones")
                .add({
                    name:locacionName,
                    region: regionName,
                    adress: locacionAdress,
                    description: locacionDescripcion,
                    ppm:ppmNumber,
                    location: locationLoc,
                    images: response,
                    rating: 0,
                    ratingTotal: 0,
                    quantityVoting: 0,
                    createAt: new Date(),
                    createBy: firebase.auth().currentUser.uid,
                })
                .then(()=> {
                    setIsLoading(false);
                    navigation.navigate("locaciones");
                    console.log("OK");
                }).catch(()=> {
                    setIsLoading(false);
                    toastRef.current.show("Error al subir la Locación, inténtelo mas tarde")
                })
            });
           // console.log("ok");
        }
    };

    const uploadImageStorage = async () => {
        
        const imageBlob = [];

        await  Promise.all(
            map(imageSelected, async(image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref("locaciones").child(uuid());
                await ref.put(blob).then(async(result) => {
                   // console.log("ok!");
                   await firebase.storage()
                   .ref(`locaciones/${result.metadata.name}`)
                   .getDownloadURL()
                   .then((photoUrl) => {
                       imageBlob.push(photoUrl);
                   });
                });
            })
        );
        return imageBlob;
    };


    return(
        <ScrollView style={styles.ScrollView}>
            <ImageLocacion 
                imagenLocacion={imageSelected[0]}
            />
            <FormAdd 
                setLocacionName={setLocacionName}
                setRegionName={setRegionName}
                setLocacionAdress={setLocacionAdress}
                setLocacionDescripcion={setLocacionDescripcion}
                setPpmNumber={setPpmNumber}
                setIsVisibleMap={setIsVisibleMap}
                locationLoc={locationLoc}
            />
            <UploadImage 
                toastRef={toastRef}
                setImageSelected={setImageSelected}
                imageSelected={imageSelected}
                />
            <Button 
                title="Crear Locación"
                onPress={addLocacion}
                buttonStyle={styles.btnAddLocacion}
            />
            <Map 
                isVisibleMap={isVisibleMap}
                setIsVisibleMap = {setIsVisibleMap}
                setLocationLoc={setLocationLoc}
                toastRef={toastRef}
            />
        </ScrollView>
    );
}

function ImageLocacion(props){
    const { imagenLocacion } = props;
    return (
        <View style={styles.viewPhoto}>
            <Image 
                source={imagenLocacion ? {uri: imagenLocacion} : require("../../../assets/img/no-image.png") }
                style={{width: widthScreen, height:200}}
            />
        </View>
    );
}

function FormAdd(props){
    const navigation = useNavigation(); 

    const goLocaciones = () => {
        navigation.navigate("locacion");
    };
    const { setLocacionName, 
            setRegionName,
            setLocacionAdress, 
            setLocacionDescripcion, 
            setPpmNumber,
            setIsVisibleMap,
            locationLoc,
             } = props;

    return (
        <View style={styles.viewForm}>
            <Input 
                placeholder="Comuna"
                containerStyle={styles.input}
                onChange={(e) => setLocacionName(e.nativeEvent.text)}
            />
            <Input 
                placeholder="Región"
                containerStyle={styles.input}
                onChange={(e) => setRegionName(e.nativeEvent.text)}
            />
            <Input 
                placeholder="Dirección aproximada"
                containerStyle={styles.input}
                onChange={(e) => setLocacionAdress(e.nativeEvent.text)}
                rightIcon={{
                    type:"material-community",
                    name:"google-maps",
                    color: locationLoc ? "#00a680" : "grey",
                    onPress:() => setIsVisibleMap(true),
                }}
            />
             <Input 
                keyboardType="numeric"
                placeholder="Ingrese los PPM"
                maxLength={4}
                containerStyle={styles.inputNumber}
                onChange={(e) => setPpmNumber(e.nativeEvent.text)}
                rightIcon={{
                    type:"material-community",
                    name:"help-rhombus",
                    color: locationLoc ? "#00a680" : "grey",
                    onPress: () => navigation.navigate("informacion", {screen: "informacion"}),
                }}
            />
            <Input 
                placeholder="Descripción de la muestra"
                multiline={true}
                containerStyle={styles.textArea}
                //inputContainerStyle={styles.textArea}
                onChange={(e) => setLocacionDescripcion(e.nativeEvent.text)}
            />
           
        </View>
    );
}


function Map(props){
    const { isVisibleMap, setIsVisibleMap , toastRef, setLocationLoc} = props;
    const [location, setLocation] = useState(null);
    useEffect(() => {
       (async ()=> {
           const resultPermissions = await Permissions.askAsync(Permissions.LOCATION);
           //console.log(resultPermissions);
           const statusPermissions = resultPermissions.permissions.location.status;
           if(statusPermissions !== "granted"){
               toastRef.current.show("Tienes que aceptar los permisos de localización para crear una nueva Localización",3000);
           }else{
               const loc = await Location.getCurrentPositionAsync({});
               //console.log(loc);
               setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta:0.001,
               });
           }
       })()
    }, []);

    const confirmLocation = () => {
        setLocationLoc(location);
        toastRef.current.show("Localización guardada correctamente");
        setIsVisibleMap(false);
    };


    return (
        <Modal 
            isVisible={isVisibleMap}
            setIsVisible={setIsVisibleMap}    
        >
            <View>
                {location && (
                    <MapView 
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >  
                    <MapView.Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        draggable
                    />
                    </MapView>
                )}
                
                <View style={styles.viewMapBtn}>
                    <Button title="Guardar Ubicación"
                            containerStyle={styles.viewMapBtnContainerSave}
                            buttonStyle={styles.viewMapBtnSave}
                            onPress={confirmLocation}
                    />
                    <Button title="Cancelar Ubicación" 
                            containerStyle={styles.viewMapBtnContainerCancel}
                            buttonStyle={styles.viewMapBtnCancel}
                            onPress={()=> setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    );
}



function UploadImage(props){
    const{ toastRef , setImageSelected, imageSelected } = props;

    const imageSelect = async () => {
        const resultPemissions = await Permissions.askAsync(Permissions.CAMERA);

        if(resultPemissions === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de la galeria, si has rechazado debes ir a ajustes y activarlos manualmente", 3000);
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });
            if(result.cancelled){
                toastRef.current.show("Has cerrado la galeria sin seleccionar imagenes", 2000);
            }else{
                setImageSelected(result.uri);
                setImageSelected([...imageSelected, result.uri]);
            }
        }
    };

    const removeImage = (image) => {
        const arrayImages = imageSelected;

        Alert.alert(
            "Eliminar Imagen",
            "¿Estás seguro de que quieres eliminar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Eliminar", 
                    onPress: () => {
                        setImageSelected(filter(arrayImages, (imageUrl) => imageUrl !== image));
                    },
                },
            ],
            {cancelable: false}
        );
    };

    return(
        <View style={styles.viewImage}>
            {size(imageSelected) < 4 && (
                 <Icon 
                 type="material-community"
                 name="camera"
                 color="#7a7a7a"
                 size={40}
                 containerStyle={styles.containerIcon}
                 onPress={imageSelect}
             />
            )}
        {map(imageSelected, (imageLocacion, index)=> (
          <Avatar 
                key={index}
                style={styles.miniatureStyle}
                source={{uri: imageLocacion}}
                onPress={()=> removeImage(imageLocacion)}
          />
        ))}
        </View>
    );
}

const styles = StyleSheet.create({
    ScrollView:{
        height:"100%",
    },
    viewForm:{
        marginLeft:10,
        marginRight:10,
    },
    input:{
        marginBottom:10,
        backgroundColor:"#D6DBDF",
        borderRadius:10,
    },
    textArea:{
        height:100,
        width:"100%",
        padding:0,
        margin:0,
        backgroundColor:"#D6DBDF",
        borderRadius:10,
    },
    btnAddLocacion:{
        backgroundColor:"#4285F4",
        margin:20,
    },
    viewImage:{
        flexDirection:"row",
        marginLeft:20,
        marginTop:30,
        marginRight:20,
    },
    containerIcon:{
        alignItems:"center",
        justifyContent:"center",
        marginRight:10,
        height:70,
        width:70,
        backgroundColor:"#e3e3e3",
    },
    miniatureStyle:{
        width:70,
        height:70,
        marginRight:10,
    },
    viewPhoto:{
        alignItems:"center",
        height:200,
        marginBottom:20,
    },
    mapStyle:{
        width:"100%",
        height:550,
    },
    viewMapBtn:{
        flexDirection: "row",
        justifyContent:"center",
        marginTop:10,
    },
    viewMapBtnContainerCancel:{
        paddingLeft:5,
    },
    viewMapBtnCancel:{
        backgroundColor:"#CB4335",
    },
    viewMapBtnContainerSave:{
        paddingRight:5,
    },
    viewMapBtnSave:{
        backgroundColor:"#4285f4",
    },
    placeSearch:{
        flex:1,
    },
    inputNumber:{
        marginBottom:10,
        backgroundColor:"#D6DBDF",
        borderRadius:10,
    },
});