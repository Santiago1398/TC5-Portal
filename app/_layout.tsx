import React, { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContent from "../components/DrawerContent";
import LoginScreen from "./login";
import HomeScreen from "./HomeScreen";
import { useAuthStore } from "@/store/authStore";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { checkTokenValidity } from "@/store/ckeckTokenValiity";


const Drawer = createDrawerNavigator();

export default function Layout() {
    const { isAuthenticated, setIsAuthenticated, isHydrated } = useAuthStore();

    useEffect(() => {
        const validateToken = async () => {
            const token = await AsyncStorage.getItem("token");
            if (token) {
                const isValid = await checkTokenValidity(token);
                if (isValid) {
                    setIsAuthenticated(true);
                } else {
                    await AsyncStorage.removeItem("token");
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
        };

        validateToken();
    }, []);

    if (!isHydrated) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: true,
                drawerStyle: {
                    width: 250,
                },
                headerTitleAlign: "center",
                headerStyle: {
                    backgroundColor: "#fff",
                },
                headerTintColor: "#000",
            }}
            initialRouteName={isAuthenticated ? "HomeScreen" : "Login"}
        >
            {isAuthenticated ? (
                <Drawer.Screen name="HomeScreen" component={HomeScreen} options={{
                    headerShown: true,
                    headerTitle: "CTIPORTAL",
                    headerTitleAlign: 'center',

                    headerStyle: {
                        backgroundColor: "#ffffff",
                    },
                    //headerTintColor: "#00449c",
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 24,
                        color: '#00449c',
                        letterSpacing: 1, // opcional para más parecido
                        fontFamily: 'Releway-Bold'
                    },

                }}
                />
            ) : (
                <Drawer.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        headerTitle: "Iniciar Sesión",
                        swipeEnabled: false,
                        drawerItemStyle: { display: "none" },
                    }}
                />
            )}
        </Drawer.Navigator>
    );
}