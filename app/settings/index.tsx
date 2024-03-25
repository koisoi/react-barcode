import { useContext, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { styles } from "../styles";
import { AppContext } from "../context";
import { useRouter } from "expo-router";
import { setItemAsync } from "expo-secure-store";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
    const { link, setLink } = useContext(AppContext);
    const [input, setInput] = useState<string>(link || "");

    const router = useRouter();
    const storeLink = async (link: string) => {
        await setItemAsync("link", link);
    };

    return (
        <View style={styles.container}>
            <Text>Ссылка для отправки кодов:</Text>
            <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
            />
            <Button
                title="Сохранить"
                onPress={async () => {
                    console.log(input);
                    setLink(input);
                    await storeLink(input);
                    router.back();
                }}
            />
        </View>
    );
}
