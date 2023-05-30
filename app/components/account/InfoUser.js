import React, { useEffect} from "react";
import { StyleSheet, Text, View , LogBox} from "react-native";
import { Avatar } from "react-native-elements";
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export default function InfoUser(props){
    LogBox.ignoreLogs(['Setting a timer']);
    LogBox.ignoreLogs(['Failed prop type']);
    useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
        }, [])
    const{userInfo : { uid, photoURL, displayName, email }, 
    toastRef,
    setLoading,
    setLoadingText,} = props;
    //console.log(props.userInfo);
    const changeAvatar = async () => { 
        const resultPermissions = await Permissions.askAsync(Permissions.CAMERA);
        const resultPermissionsCamera = resultPermissions?.permissions?.CAMERA?.status;
        if(resultPermissionsCamera === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos");
        } else{
            const result = await ImagePicker.launchImageLibraryAsync({
                AllowsEditing:true,
                aspect: [4,3],
            });
            if(result.cancelled){
                toastRef.current.show("Has cerrado la selección de imágenes");
            }else{
                uploadImage(result.uri).
                then(() => {
                   // console.log("imagen subida");
                    updatePhotoUrl(); 
                }).catch(() =>{
                    toastRef.current.show("Error al subir la imagen");
                });
            }
        }
    };

    const uploadImage = async (uri) => {
        setLoadingText("Actualizando avatar");
        setLoading(true);
        const response = await fetch(uri);
        const blob = await response.blob();
        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        ref.put(blob);
        console.log(JSON.stringify(blob));
       // console.log(JSON.stringify(response));
    };

    const updatePhotoUrl = () => {
        firebase.storage().ref(`avatar/${uid}`).getDownloadURL().then(async (response) => {
            const update = {
                photoURL: response,
            };
            await firebase.auth().currentUser.updateProfile(update);
            setLoading(false);
            //console.log("Imagen Actualizada");
        })
        .catch(()=>{
            toastRef.current.show("Error al subir la imagen");
        })
    };

    //console.log(photoURL);
    //console.log(displayName);
    //console.log(email);
    return (
        <View style = {styles.viewUserInfo}>
            <Avatar 
                rounded
                size="large"
                showEditButton
                onEditPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
                source={
                    photoURL ? { uri: photoURL} : require("../../../assets/img/default-avatar.jpg")
                }
            />
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : "Anónimo"}
                </Text>
                <Text>
                    {email ? email : "Social Login"}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewUserInfo:{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor:"#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30,
    },
    userInfoAvatar:{
        marginRight:20,
    },
    displayName:{
        fontWeight:"bold",
        paddingTop:5,
    },
});