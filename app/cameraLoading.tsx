import { ActivityIndicator, View, Text } from "react-native";
import { styles } from "./styles";

export const CameraLoading = () => {
    return (
        <>
            <ActivityIndicator size="large" />
            <Text style={styles.text}>Загрузка камеры...</Text>
        </>
    );
};
