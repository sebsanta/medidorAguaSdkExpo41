import React, { useRef, useEffect } from "react";
import { StyleSheet, View , Image} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {LogBox} from "react-native";
import Toast from "react-native-easy-toast";
import RegisterForm from "../../components/account/RegisterForm";

export default function Register(){
    useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    }, [])
    const toastRef = useRef();
    //console.log(toastRef);

    return(
        <KeyboardAwareScrollView>
            <Image 
                source={require("../../../assets/img/gota-agua.png")}
                resizeMode="contain"
                style={styles.logo}
            />
            <View style={styles.viewForm}>
                <RegisterForm toastRef={toastRef}/>
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9}/>
        </KeyboardAwareScrollView>
    );
}


const styles = StyleSheet.create({
    logo:{
        width:"100%",
        height:150,
        marginTop:20,
    },
    viewForm:{
        marginRight:40,
        marginLeft:40,
    }, 
});