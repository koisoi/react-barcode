import { View, Text, Button, Linking } from "react-native";
import { styles } from "./styles";
import { useContext } from "react";
import { AppContext } from "./context";

export default function NoCameraPermission() {
    const { requestPermission } = useContext(AppContext);

    return (
        <View style={styles.blackContainer}>
            <Text style={styles.text}>
                Приложению необходимо разрешение на использование камеры.
            </Text>
            <Button
                onPress={() => requestPermission()}
                title="Разрешить"
                accessibilityLabel="Разрешить использовать мою камеру"
            />
            <Button
                onPress={async () => await Linking.openSettings()}
                title="Открыть настройки приложения"
                accessibilityLabel="Открыть настройки приложения, чтобы разрешить использовать мою камеру"
            />
        </View>
    );
}
