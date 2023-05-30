import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Search from "../screens/Search";

const Stack = createNativeStackNavigator();

export default function SearchStack(){
    return(
        <Stack.Navigator>
             <Stack.Screen name = "search" component = {Search} options={{title:"Buscar ", headerShown: false }}/>
        </Stack.Navigator>

    );
}