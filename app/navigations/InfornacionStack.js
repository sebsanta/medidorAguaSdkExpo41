import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import Informacion from "../components/Informacion";
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function InfornacionStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name = "informacion" 
                component = {Informacion} 
                options=
                {{
                    title:"informacion ",
                    tabBarVisible: false,
                }}/>
        </Stack.Navigator>

);
}

const styles = StyleSheet.create({})
