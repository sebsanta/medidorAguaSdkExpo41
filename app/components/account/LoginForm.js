import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { isEmpty } from "lodash";
import { useNavigation } from "@react-navigation/native"
import * as firebase from "firebase";
import * as Google from "expo-google-app-auth";
import { validateEmail } from "../../utils/validations"
import Loading from "../Loading";

export default function LoginForm(props){
const [ loading, setLoading] = useState(false);
const { toastRef } = props;
const[showPassword, setShowPassword] = useState(false);
const [formData, setFormData] = useState(defaulFormValue());
const navigation = useNavigation();

firebase.auth().onAuthStateChanged((user) => {
    user && navigation.navigate("account");
})

const onChange = (e, type) => {
setFormData({ ...formData, [type]:e.nativeEvent.text });

};

const onSubmit = () => {
    if(isEmpty(formData.email) || isEmpty(formData.password)){
        toastRef.current.show("Todos los campos son obligatorios");
    } else if(!validateEmail(formData.email)){
        toastRef.current.show("El email no es válido")
    }else{
        setLoading(true);
        firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then(()=> {
            setLoading(false);
            navigation.goBack();
        })
        .catch(()=> {
            setLoading(false);
            toastRef.current.show("Email o contraseña incorrecta");
        })
    }
};

 isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          //firebase.auth().signOut();
          return true;
        }
      };
    };
    return false;
  };

onSignIn = googleUser => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase
    .auth()
    .onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
        );

           //googleUser.getAuthResponse().id_token);
  
        // Sign in with credential from the Google user.
        firebase
            .auth()
            .signInWithCredential(credential).then(function(){
                console.log("usuario ingreso");
            })
            .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      } else {
        console.log('User already signed-in Firebase.');
      }
    }
    );
  };


async function signInWithGoogleAsync() {
    try {
      const result = await Google.logInAsync({
        androidClientId: '483811688154-6i51ian541c4ms8ifttl8suevtufvo9a.apps.googleusercontent.com',
        /*iosClientId: YOUR_CLIENT_ID_HERE, */
        scopes: ['profile', 'email'],
      });
      if (result.type === 'success') {
        this.onSignIn(result);
        navigation.navigate("account", {user});
        return result.accessToken;

      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

    return(
        <View style={styles.formContainer}>
            <Input 
                placeholder = "Correo Electrónico"
                containerStyle =  {styles.inputForm}
                onChange={(e)=> onChange(e, "email")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input 
                placeholder ="Contraseña"
                containerStyle = {styles.inputForm}
                onChange={(e)=> onChange(e,"password")}
                password={true}
                secureTextEntry={showPassword ? false : true}
                rightIcon={
                    <Icon 
                        type="material-community"
                        name={ showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={()=> setShowPassword(!showPassword)}
                    />
                }
            />
            <Button 
                title="Iniciar sesión"
                containerStyle = {styles.btnContainerLogin}
                buttonStyle = {styles.btnLogin}
                onPress={onSubmit}
                />

      <View >
        <Button 
                containerStyle={styles.btnContainerGoogle}
                buttonStyle={styles.btnGoogle}
                title="Inicia sesión con tu cuenta Google" 
                onPress={signInWithGoogleAsync} />
      </View>
            <Loading isVisible={loading} text="Iniciando sesión"/>
        </View>
    );
}

function defaulFormValue (){
    return{
        email:"",
        password:""
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex:1,
        alignItems: "center",
        justifyContent: "center",
        marginTop:30,
    },
    inputForm:{
        width:"100%",
        marginTop:20,
        backgroundColor:"#d6dbdf",
        borderRadius:10,
    },
    btnContainerLogin:{
        marginTop: 20,
        width: "95%",
    },
    btnLogin:{
        backgroundColor:"#4285f4",
    },
    iconRight:{
        color:"grey",
    },  
    btnContainerGoogle:{
        marginTop: 20,
        width: "95%",
    },
    btnGoogle:{
        backgroundColor:"#4285f4", 
        borderRadius:10,    
    },
});