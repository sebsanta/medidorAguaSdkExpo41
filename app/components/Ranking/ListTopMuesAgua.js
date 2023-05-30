import { Row } from 'native-base';
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { Card, Image, Icon, Rating, colors } from 'react-native-elements';


export default function ListTopMuesAgua(props) {
    //console.log(props);
const { id, locaciones, navigation , ppm} = props;

    return (
        <FlatList 
            data={locaciones}
            renderItem={(locacion) => 
                (<Locacion locacion={locacion} navigation={navigation} />)}
            keyExtractor={(item, index) => index.toString()}
        />
    );
}

function Locacion(props){
    const { locacion, navigation } = props;
    const { id, name, rating, images, description, ppm } = locacion.item;
    const [ iconColor, setIconColor ] = useState("#000");

useEffect(() => {
    if(locacion.index === 0){
        setIconColor("#efb819")
    }else if(locacion.index === 1){
        setIconColor("#e3e4e5")
    }else if(locacion.index === 2){
        setIconColor("#cd7f32")
    }
}, []);

return (
    <TouchableOpacity style={styles.contenedor} onPress={() => navigation.navigate("locaciones", { screen: "locacion", params: { id } })}>
        <Card containerStyle={styles.containerCard}>
            <Icon 
                type="material-community"
                name="heart-circle-outline"
                color={iconColor}
                size={40}
                containerStyle={styles.containerIcon}
            />
            <Image 
                style={styles.locacionImage}
                resizeMode="cover"
                source={
                    images[0] 
                    ? {uri: images[0]} 
                    : require("../../../assets/img/no-image.png")
                }
            />
            <View style={styles.titleRating}>
                <Text style={styles.title}>{name}</Text>
                <Rating 
                    imageSize={20}
                    startValue={rating}
                    readonly
                />
            </View>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.infoPPM}>Medición PPM: {ppm}</Text>
        </Card>
    </TouchableOpacity>
); 
}

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: "#ABB2B9",
    },
    containerCard:{
        marginBottom:30,
        borderWidth:0,

    },
    containerIcon:{
        position:"absolute",
        top:0,
        left:0,
        zIndex:1,

    },
    locacionImage:{
        width:"100%",
        height:200,
    },
    titleRating:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,

    },
    title:{
        fontSize:20,
        fontWeight:"bold",
    },
    description:{
        color:"grey",
        marginTop:0,
        textAlign:"justify",
    },
    infoPPM:{
        color:"grey",
        marginTop:5,
        textAlign:"justify",
    },
});
