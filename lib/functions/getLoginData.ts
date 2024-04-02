import { getItemAsync } from "expo-secure-store";
import { LoginData } from "../types/loginData";

export const getLoginData = async (): Promise<LoginData | null> => {
    let result: LoginData | null = null;
    try {
        const item = await getItemAsync("loginData");
        result = item ? JSON.parse(item) : null;
    } catch (error) {
        console.error(error);
    }
    return result;
};
