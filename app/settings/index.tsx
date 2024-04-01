import { useContext, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { styles } from "../styles";
import { AppContext } from "../context";
import { useRouter } from "expo-router";
import { setItemAsync } from "expo-secure-store";

export default function Settings() {
    const { link, setLink } = useContext(AppContext);
    const [keyInput, setKeyInput] = useState<string>(link || "");

    const router = useRouter();
    const storeLink = async (link: string) => {
        await setItemAsync("link", link);
    };

    return (
        <View style={styles.container}>
            <Text>Ключ:</Text>
            <TextInput
                style={styles.input}
                value={keyInput}
                onChangeText={setKeyInput}
            />
            {/* <Text>Логин:</Text>
        <TextInput
            style={styles.input}
            value={keyInput}
            onChangeText={setKeyInput}
        /> */}
            <Button
                title="Сохранить"
                onPress={async () => {
                    console.log(keyInput);
                    setLink(keyInput);
                    await storeLink(keyInput);
                    router.back();
                }}
            />
        </View>
    );
}
