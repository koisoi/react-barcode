import { useContext, useEffect, useRef, useState } from "react";
import { Pressable, View, Text } from "react-native";
import {
    Camera,
    Code,
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
    const { hasPermission, requestPermission, link } = useContext(AppContext);
    const [scanPause, setScanPause] = useState<boolean>(false);
    const prevScan = useRef<Code | null>(null);

    const handleCodeScan = async (codes: Code[]) => {
        if (scanPause || !link) return;
        setScanPause(true);
        if (prevScan.current && codes[0].value === prevScan.current?.value) {
            setScanPause(false);
            return;
        }

        // const promise = await fetch(link)
        prevScan.current = codes[0];
        console.log(`Scanned code: ${codes[0].value}.`);
        setScanPause(false);
    };

    const codeScanner = useCodeScanner({
        codeTypes: ["ean-13"],
        onCodeScanned: handleCodeScan,
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
            <Pressable
                onPress={() => router.push("/settings")}
                style={styles.iconButton}
            >
                <MaterialIcons name="settings" size={30} color="white" />
            </Pressable>
            <Pressable
                accessibilityLabel="Разрешить использовать мою камеру"
                style={styles.pressableTest}
            >
                <Text>Проверка</Text>
            </Pressable>
            <Camera
                style={styles.camera}
                device={device}
                isActive={true}
                photo={true}
                codeScanner={codeScanner}
            />
        </View>
    );
}
