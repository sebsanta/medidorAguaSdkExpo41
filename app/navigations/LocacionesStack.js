import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Locaciones from "../screens/Locaciones/Locaciones";
import AddLocacion from "../screens/Locaciones/AddLocacion";
import Locacion from "../screens/Locaciones/Locacion";
import AddReviewLocacion from "../screens/Locaciones/AddReviewLocacion";
import Favorites from "../../app/screens/Favorites";
import Informacion from "../components/Informacion";


const Stack = createStackNavigator();

export default function LocacionesStack(){
    return(
        <Stack.Navigator>
             <Stack.Screen 
                name = "locaciones" 
                component = {Locaciones} 
                options={{title:"Locaciones "}}/>
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