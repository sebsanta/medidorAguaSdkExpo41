import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import TopMuestras from "../screens/TopMuestras";

const Stack = createStackNavigator();

export default function TopMuestrasStack(){
    return(
        <Stack.Navigator>
             <Stack.Screen name = "topmuestras" component = {TopMuestras} options={{title:"Top Muestras de agua ", headerShown: false}}/>
        </Stack.Navigator>

    );
}