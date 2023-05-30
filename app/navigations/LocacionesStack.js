import React from "react";
import { StyleSheet } from 'react-native'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Locaciones from "../screens/Locaciones/Locaciones";
import AddLocacion from "../screens/Locaciones/AddLocacion";
import Locacion from "../screens/Locaciones/Locacion";
import AddReviewLocacion from "../screens/Locaciones/AddReviewLocacion";
import Favorites from "../../app/screens/Favorites";
import Informacion from "../components/Informacion";

const Stack = createNativeStackNavigator();

export default function LocacionesStack(){
    return(
        <Stack.Navigator >
             <Stack.Screen 
                component={Locaciones}
                name = "Lista de Locaciones" 
                options={{ title: "Locacioness", headerShown: false }} 
            />
            <Stack.Screen 
                name="add-locaciones"
                component={AddLocacion}
                options= {{
                    title:"Añadir nueva locación"
                }}
            />
            <Stack.Screen 
                name="locacion"
                component={Locacion}
            />
            <Stack.Screen 
                name="add-review-locacion" 
                component={AddReviewLocacion}
                options={{ title: "Nuevo Comentario" }}
            />
            <Stack.Screen 
                name = "informacion" 
                component = {Informacion} 
                options=
                {{
                    title:"informacion ",
                }}
            />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    textoSuperior: {
        color: "#EAEDED",
        fontWeight: "bold",
        backgroundColor: "red",
    },
    locaciones: {
        color: "red",
        fontWeight:"bold",
        paddingBottom:10,
    }
})