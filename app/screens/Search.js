import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Image } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import {FireSQL} from "firesql";
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(), {includeId: "id" });

export default function Search(props) {
    const{ navigation } = props;
    const [ search, setSearch ] = useState("");
    const [locaciones, setLocaciones] = useState([]);
    //console.log(locaciones);


    useEffect(() => {

        if(search){
            fireSQL.query(`SELECT * FROM Locaciones WHERE name LIKE '${search}%'`)
            .then((response) => {
                 //console.log(response);
                 setLocaciones(response);
            }); 
        }
    }, [search]);

    return(
        <View>
            <SearchBar 
                placeholder="Busca una locación"
                onChangeText={(e) => setSearch(e)}
                value={search}
                containerStyle={styles.searchBar}
            />
            {locaciones.length === 0 ? (
                <NotFoundLocacion />
            ):(
               <FlatList 
                    data={locaciones}
                    renderItem={(locacion) => <Locacion locacion={locacion} navigation={navigation}/>}
                    keyExtractor={(item, index) => index.toString()}
               />
            )}
        </View>
    );
}

function NotFoundLocacion(){
    return(
    <View Style={{ flex:1, alignItems: "center" }}>
        <Image 
            source={ require("../../assets/img/no-search-1.png")}
            resizeMode="cover"
            style={{ width: 200, height:200, alignItems:"center"}}
        />
        <Text style={styles.styleText}>No se han encontrado resultados para la búsqueda...</Text>
    </View>
    );
}

function Locacion(props){
    const { locacion, navigation} = props;
    const { id, name, images } = locacion.item;

    return (
        <ListItem 
            title={name}
            leftAvatar={{
                source: images[0] ? { uri: images[0] } : require("../../assets/img/no-image.png")
            }}
            rightIcon={<Icon type="material-community" name="chevron-right"/> }
            onPress={()=> navigation.navigate("locaciones", {screen: "locacion", params: {id, name}},)}
        />
    );
}

const styles = StyleSheet.create({
    searchBar:{
        marginBottom:20,
    },
    styleText:{
        padding:20,
        justifyContent:"center",
        color:"grey",
        fontWeight:"bold",
        fontSize:23,
    },
})