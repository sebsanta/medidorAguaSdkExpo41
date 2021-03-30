import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Image, Icon, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";



export default function Informacion() {

    const navigation = useNavigation(); 
    return (
        <ScrollView centerContent={true} style={styles.viewBody}>
            <Image 
                 source={require("../../assets/img/info-agua.png") }
                 resizeMode="contain"
                 style={styles.image}
            />
            <Text style={styles.title}>Puede detectar tres tipos de impurezas presentes en el agua.</Text>
            <View style={styles.viewText}>
                <Icon
                    style={styles.Icon}
                    type="material-community"
                    name="beaker-remove"
                    color="#7a7a7a"
                    size={30}
                />
                <Text style={styles.description}>Sales solubles tales como iones de Calcio y Magnesio.</Text>
            </View>
            <View style={styles.viewText}>
                <Icon
                    style={styles.Icon}
                    type="material-community"
                    name="skull-crossbones"
                    color="#7a7a7a"
                    size={30}
                />
                <Text style={styles.description}>Iones de metales pesados tales como Zinc, Cromo, Plomo y Cobre.</Text>
            </View>
            <View style={styles.viewText}>
                <Icon
                    style={styles.Icon}
                    type="material-community"
                    name="flask-remove-outline"
                    color="#7a7a7a"
                    size={30}
                />
                <Text style={styles.description}>Acetatos de Amonio, Sodio y otros iones orgánicos.</Text>
            </View>
            <View style={styles.viewBtn}>
                <Button 
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    title="Volver"
                    onPress={() => navigation.navigate("add-locaciones")}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        marginTop:5,
        padding:10,
    },
    viewText:{
        flexDirection: "row",
        padding:0,
    },
    title:{
        fontWeight:"bold",
        fontSize:19,
        marginBottom: 10,
        textAlign: "center",  
        color:"#34495E",
    },
    Icon:{
        height:30,
        width:30,
        padding:10,
        paddingRight:5,
    },
    description:{
        textAlign:"justify",
        marginBottom:20,
        color:"grey",
        marginRight:30,
        fontSize:15,
    },
    image:{
        height: 250,
        width: "100%",
        marginBottom: 10,
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
})
