import React from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function ListLocaciones(props){
    const {locaciones, handleLoadMore, isLoading} = props;
    const navigation = useNavigation();

    return(
        <View>
            {size(locaciones) > 0 ?  (
                <FlatList 
                    data={locaciones}
                    renderItem={(locacion)=> <Locacion locacion={locacion} navigation={navigation}/>}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={<FooterList isLoading={isLoading}/>}
                />
            ) : (
                <View style={styles.loaderLocaciones}>
                    <ActivityIndicator size="large" color="#4285f4" />
                    <Text>Cargando Locaciones</Text>
                </View>
            )}
        </View>
    );
}

function FooterList(props){
    const { isLoading } = props;
    if(isLoading){
        return(
            <View style={styles.loaderLocaciones}>
                <ActivityIndicator size="large" />
            </View>
        )
    } else {
        return(
            <View style={styles.notFoundLocaciones}>
                <Text>No hay mas locaciones que mostrar</Text>
            </View>
        )
    }
};

function Locacion(props){
    const {locacion, navigation} = props;
    const {id, images, name, adress, description, ppm , region, createAt} = locacion.item;
    const imageLocacion = images[0];
    const createReview = new Date(createAt.seconds * 1000);

    const goLocaciones = () => {
        navigation.navigate("locacion", {
            id,
            name,
        });
    };
    return (
        <TouchableOpacity onPress={goLocaciones}>
            <View style={styles.viewLocaciones}>
                <View style={styles.viewLocacionesImage}>
                <Image 
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#4285f4" />}
                        source={
                            imageLocacion ? { uri: imageLocacion} : require("../../../assets/img/no-image.png")
                        }
                        style={styles.imageLocacion}
                    />
                </View>
                <View>
                    <Text style={styles.locacionName}>Región: {region}</Text>
                    <Text style={styles.locacionAddress}>Comuna: {name}</Text>
                    <Text style={styles.locacionAddress}>Dirección: {adress.substr(0,29)}...</Text>
                    <Text style={styles.locacionDescription}>Descripción: {description.substr(0, 25)}...</Text>
                    <Text style={styles.ppmInfo}>Medición PPM: {ppm}</Text>
                    <Text style={styles.ppmInfo}>Fecha: {createReview.getDate()}/{createReview.getMonth() + 1}/
                            {createReview.getFullYear()} - {createReview.getHours() < 10 ? "0" : ""}
                            {createReview.getHours()}:{createReview.getMinutes() < 10 ? "0" : ""}
                            {createReview.getMinutes()}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    loaderLocaciones:{
        marginTop:20,
        marginBottom:20,
        alignItems:"center",
    },
    viewLocaciones:{
        flexDirection:"row",
        margin:10,
    },
    viewLocacionesImage:{
        marginRight:15,
    },
    imageLocacion:{
        width:90,
        height:120,
    },  
    locacionName:{
        fontWeight:"bold",
    },
    ppmInfo:{
        paddingTop:2,
        color:"grey",
    },
    locacionAddress:{
        paddingTop:2,
        color:"grey",
    },
    locacionDescription:{
        paddingTop:2,
        color:"grey",
        width:300,
    },
    notFoundLocaciones:{
        marginTop:10,
        marginBottom:20,
        alignItems:"center",
    },
});


