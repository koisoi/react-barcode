import { View, Text } from "react-native";
import { styles } from "./styles";

export default function NoCameraError() {
    return (
        <View style={styles.container}>
            <Text>Ошибка: Камера не найдена.</Text>
        </View>
    );
}
