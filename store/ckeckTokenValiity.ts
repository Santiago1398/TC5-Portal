import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEnvStore } from "@/store/envSotre";
import { useEffect } from "react";

export const checkTokenValidity = async (): Promise<boolean> => {
    try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
            console.log("❌ No hay token en AsyncStorage");
            return false;
        }
        console.log("✅ Token encontrado:", token);

        const apiUrl = useEnvStore.getState().getApiUrl();
        const res = await axios.post(`${apiUrl}/api/v1/loginMovil/validarToken`, { token });

        console.log("✅ Respuesta del backend:", res.data);

        const valido = res.data.status === "OK";
        console.log("¿Es válido?", valido);

        return valido;
    } catch (error) {
        console.error("❌ Error al validar token:", error);
        return false;
    }
};


