import React , {useRef, useEffect} from "react";
import { StyleSheet, View, ScrollView, Image, Text} from "react-native";
import { Divider, Button } from "react-native-elements"
import { useNavigation } from "@react-navigation/native";
import {LogBox} from "react-native";
import Toast from "react-native-easy-toast";
import LoginForm from "../../components/account/LoginForm";
import * as Google from "expo-google-app-auth";


export default function Login(){
useEffect(() => {
        LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
        }, [])
const toastRef = useRef();

    return(
            <ScrollView>
                <Image 
                    source={require("../../../assets/img/gota-agua.png")}
                    resizeMode="contain"
                    style={styles.logo}
                />
                <View style={styles.viewContainer}>
                    <LoginForm toastRef={toastRef}/>
                    <CreateAccount/>
                </View>
                <Divider style={styles.divider}/>
                <Toast ref={toastRef} position="center" opacity={0.9}/>
            </ScrollView>
    );
}

function CreateAccount(){
    const navigation = useNavigation();
    return(
        <Text style={styles.textRegister}>
            ¿Aún no tienes una cuenta?{"  "}
            <Text style={styles.btnRegister}
                  onPress={() => navigation.navigate("register")}
            >
                Regístrate
            </Text>
        </Text>
    )
};
    

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop: 20,
    },
    viewContainer:{
        marginRight:40,
        marginLeft: 40,
    },
    textRegister:{
        marginTop:15,
        marginLeft:10,
        marginRight:10,
    },
    btnRegister:{
        color:"#00a680",
        fontWeight:"bold",
    },
    divider:{
        borderColor:"#00a680",
        margin:40,
        height:1,
    },
});