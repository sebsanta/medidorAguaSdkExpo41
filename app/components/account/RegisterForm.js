import React , { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button} from "react-native-elements";
import Loading from "../Loading";
import { validateEmail} from "../../utils/validations";
import { size, isEmpty } from "lodash";
import * as firebase from "firebase";
import { useNavigation } from "@react-navigation/native";



export default function RegisterForm(props){
    const { toastRef } = props;
    //console.log(props);
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setshowRepeatPassword] = useState(false);
    const [formData, setFormData] = useState(defaultFormValue());
    const [loading, setLoading] = useState(false); 
    const navigation = useNavigation();

    const onSubmit = ()=> {

        if(isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.repeatPassword))
        {
            //toastRef.current.show("Todos los campos son obligatorios");
            toastRef.current.show("Todos los campos deben son obligatorios");
            //console.log("Todos los campos deben llenarse");
            } else if(!validateEmail(formData.email)){
                toastRef.current.show("El email tiene un formato incorrecto");
                //console.log("El email no es correcto");
            } else if(formData.password !== formData.repeatPassword){
                toastRef.current.show("Las contraseñas deben ser iguales");
                //console.log("Las contraseñas deben ser iguales"); 
            } else if(size(formData.password) < 6){
                toastRef.current.show("La contraseña debe tener a lo menos 6 caracteres");
                //console.log("La contraseña tiene que tener por lo menos de 6 caracteres");
            }
            else {
                setLoading(true);
                 firebase.auth()
                 .createUserWithEmailAndPassword(formData.email, formData.password)
                 .then((response) => {
                    setLoading(false);
                     navigation.navigate("account");
                 })
                 .catch((err) => {
                    //throw error; 
                    setLoading(false);
                    toastRef.current.show("EL email ya está en uso, pruebe con otro");
                 })
            }
        
      //  console.log(formData);
      //  console.log(validateEmail(formData.email));
    };

    const onChange = (e, type)=> {
        setFormData({ ...formData, [type]: e.nativeEvent.text })
    };

    return(
        <View style={styles.formContainer}>
            <Input 
                placeholder="Correo electónico"
                containerStyle={styles.inputForm}
                onChange={(e) => onChange(e, "email")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.inputForm}
                password = {true}
                secureTextEntry={showPassword ? false : true}
                onChange={(e) => onChange(e, "password")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
            />
            <Input 
                placeholder="Repetir contraseña"
                containerStyle={styles.inputForm}
                secureTextEntry={showRepeatPassword ? false : true}
                onChange={(e) => onChange(e, "repeatPassword")}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showRepeatPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconRight}
                        onPress={()=> setshowRepeatPassword(!showRepeatPassword)}
                    />
                }
            />
            <Button 
                title="Unirse"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={onSubmit} 
            />
            <Loading isVisible={loading} text="Creando Usuario..."

            />

        </View>
    );
}

function defaultFormValue(){
    return{
        email:"",
        password:"",
        repeatPassword:"",
    };
}

const styles = StyleSheet.create({
    formContainer: {
        flex:1,
        alignItems: "center",
        justifyContent:"center",
        marginTop: 20,
    },
    inputForm: {
        width:"100%",
        marginTop:20,
        backgroundColor:"#d6dbdf",
        borderRadius:10,
    },
    btnContainerRegister: {
        marginTop:20,
        //marginBottom:20,
        width: "95%",
    },
    btnRegister:{
        backgroundColor:"#4285f4",
    },
    iconRight:{
        color:"grey",

    },
});