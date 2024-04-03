import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ToastAndroid } from "react-native";
import { styles } from "../styles";
import { useRouter } from "expo-router";
import { setItemAsync } from "expo-secure-store";
import { LoginData, getLoginData } from "../../lib";

export default function Settings() {
    const [key, setKey] = useState<string>("");
    const [login, setLogin] = useState<string>("");

    const router = useRouter();
    const storeData = async (data: LoginData) => {
        try {
            await setItemAsync("loginData", JSON.stringify(data));
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        if (!key || !login) {
            ToastAndroid.show(`Введите оба параметра.`, ToastAndroid.SHORT);
            return;
        }

        // console.log(keyInput);
        await storeData({ key, login });
        router.back();
    };

    useEffect(() => {
        const getData = async () => {
            const loginData = await getLoginData();
            setKey(loginData?.key || "");
            setLogin(loginData?.login || "");
        };

        getData();
    }, []);

    return (
        <View style={styles.blackContainer}>
            <Text style={styles.text}>Ключ:</Text>
            <TextInput style={styles.input} value={key} onChangeText={setKey} />
            <Text style={styles.text}>Логин:</Text>
            <TextInput
                style={styles.input}
                value={login}
                onChangeText={setLogin}
            />
            <Button title="Сохранить" onPress={handleSave} />
        </View>
    );
}
