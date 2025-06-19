// app/AuthGate.tsx o screens/AuthGate.tsx
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { checkTokenValidity } from "@/store/ckeckTokenValiity";
import { useEnvStore } from "@/store/envSotre";


export default function AuthGate() {
    const navigation = useNavigation<any>();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                useEnvStore.getState().toggleMode(false); // Reinicia a producción
            }

            if (token) {
                const valid = await checkTokenValidity(token);
                if (valid) {
                    navigation.replace("HomeScreen"); // o WebViewScreen
                } else {
                    await AsyncStorage.removeItem("token");
                    navigation.replace("LoginScreen");
                }
            } else {
                navigation.replace("LoginScreen");
            }
        };

        checkAuth();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
        </View>
    );
}
