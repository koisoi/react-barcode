import { View, Text, Button, Linking } from "react-native";
import { buttonsColor, styles } from "./styles";
import { useContext } from "react";
import { AppContext } from "./context";

export default function NoCameraPermission() {
    const { requestPermission } = useContext(AppContext);

    return (
        <View style={styles.container}>
            <Text style={styles.centeredText}>
                Приложению необходимо разрешение на использование камеры.
            </Text>
            <Button
                onPress={() => requestPermission()}
                title="Разрешить"
                color={buttonsColor}
                accessibilityLabel="Разрешить использовать мою камеру"
            />
            <Button
                onPress={async () => await Linking.openSettings()}
                title="Открыть настройки приложения"
                color={buttonsColor}
                accessibilityLabel="Открыть настройки приложения, чтобы разрешить использовать мою камеру"
            />
        </View>
    );
}
