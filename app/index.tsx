import { useContext, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import {
    Camera,
    useCameraDevice,
    useCodeScanner,
} from "react-native-vision-camera";
import { useRouter } from "expo-router";
import { styles } from "./styles";
import NoCameraError from "./noCameraError";
import NoCameraPermission from "./noCameraPermission";
import { AppContext } from "./context";
import { MaterialIcons } from "@expo/vector-icons";

export default function App() {
    const { hasPermission, requestPermission } = useContext(AppContext);

    const codeScanner = useCodeScanner({
        codeTypes: ["ean-13"],
        onCodeScanned: (codes) => {
            console.log(`Scanned ${codes.length} codes!`);
            codes.forEach((el) => console.log(el.value));
        },
    });

    const device = useCameraDevice("back");
    const router = useRouter();

    useEffect(() => {
        if (!hasPermission) requestPermission();
    }, []);

    if (!hasPermission) return <NoCameraPermission />;

    if (device == null) return <NoCameraError />;

    return (
        <View style={styles.container}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={true}
                codeScanner={codeScanner}
            />
            <MaterialIcons
                name="settings"
                size={30}
                color="white"
                style={styles.iconButton}
                onPress={() => router.push("/settings")}
            />
        </View>
    );
}
