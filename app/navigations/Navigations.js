import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Icon} from "react-native-elements"

import LocacionesStack from "./LocacionesStack";
import FavoritesStack from "./FavoriteStack";
import AccountStack from "./AccountStack";
import TopMuestrasStack from "./TopMuestrasStack";
import SearchStack from "./SearchStack";
import Informacion from "../components/Informacion";


const Tab = createBottomTabNavigator();

export default function Navigation() {

    return(
        <NavigationContainer>
            <Tab.Navigator 
            initialRouteName="locaciones" 
            tabBarOptions={{
                inactiveTintColor:"#646464",
                activeTintColor:"#00a680",
            }}
            screenOptions={({route}) => ({
                tabBarIcon: ({color}) => screenOptions(route, color),
            })}
                >
                <Tab.Screen name = "locaciones" component={LocacionesStack} options = {{title: "Locaciones"}}/>
                <Tab.Screen name = "favoritos" component ={FavoritesStack} options = {{title: "Favoritos"}}/>
                <Tab.Screen name = "topmuestras" component = {TopMuestrasStack} options = {{title: "Top Muestras"}}/>
                <Tab.Screen name = "search" component = {SearchStack} options = {{title: "Buscar"}}/>
                <Tab.Screen name = "account" component = {AccountStack} options = {{title: "Cuenta"}}/>
               
            </Tab.Navigator>
        </NavigationContainer>
    );
}

function screenOptions(route, color){
    let iconName;
    switch (route.name) {
        case "locaciones":
            iconName = "compass-outline"
            break;
        
        case "favoritos":
            iconName = "heart-outline"
            break;    

        case "topmuestras":
            iconName = "star-outline"
            break;  

        case "search":
            iconName = "magnify"
            break;  

        case "account":
            iconName = "home-outline"
            break;        

        default:
            break;
    }
    return(
        <Icon type="material-community" name={iconName} size={22} color={color} />
    )
}



/*
  

            */