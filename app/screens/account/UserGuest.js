import React from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function UserGuest(){
   
    const navigation = useNavigation(); 

    return(
        <ScrollView centerContent={true} style={styles.viewBody}> 
            <Image 
                source={require("../../../assets/img/user-guest.jpg") }
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.title}>Consulta tu perfil de AguaInfo</Text>
            <Text style={styles.description}>
                ¿Has tomado alguna vez una muestra de agua y has medido su pureza
                y calidad? En cada lugar que veas un recurso hidrico, toma una muestra,
                analízala y guarda el registro en la app y compartela con los demás usuarios.
            </Text>
            <View style={styles.viewBtn}>
                <Button 
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    title="Ver tu perfil"
                    onPress={() => navigation.navigate("login")}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
        viewBody: {
            marginLeft:30,
            marginRight:30,
        },
        image:{
            height: 300,
            width: "100%",
            marginBottom: 40,
        },
        title:{
            fontWeight:"bold",
            fontSize:19,
            marginBottom: 10,
            textAlign: "center",  
            color:"#34495E",
        },
        description:{
            textAlign:"center",
            marginBottom:20,
            color:"grey",
        },
        viewBtn:{
            flex:1,
            alignItems:"center",
        },
        btnStyle:{
            backgroundColor:"#4285f4",
        },
        btnContainer:{
            width:"70%",
        },
});