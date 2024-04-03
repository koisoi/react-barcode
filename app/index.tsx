import { useContext, useEffect, useRef, useState } from "react";
import { View, Text, ToastAndroid, Button } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { styles } from "./styles";
import NoCameraPermission from "./noCameraPermission";
import { AppContext } from "./context";
import { getLoginData } from "../lib";
import { BarcodeScanningResult, CameraView } from "expo-camera/next";

export default function App() {
    const { hasPermission, requestPermission } = useContext(AppContext);
    const router = useRouter();

    const isFocused = useNavigation().isFocused();

    const [cameraReady, setCameraReady] = useState<boolean>(false);
    const [scanPause, setScanPause] = useState<boolean>(false);
    const [torch, setTorch] = useState<boolean>(false);
    const prevScan = useRef<BarcodeScanningResult | null>(null);

    const handleCodeScanTemplate = async (result: BarcodeScanningResult) => {
        if (
            scanPause ||
            (prevScan.current && result.data === prevScan.current?.data)
        )
            return;
        const loginData = await getLoginData();

        setScanPause(true);
        if (!loginData?.key || !loginData?.login) {
            ToastAndroid.show(
                `Параметры для отправки кода не были заданы; код не будет отправлен.`,
                ToastAndroid.SHORT
            );
            setScanPause(false);
            console.log(result);
            return;
        }

        try {
            const response = await fetch(
                `https://stat.webtrack.biz/storage/remote/barcode/login/${loginData.login}/key/${loginData.key}/`,
                {
                    method: "POST",
                    body: JSON.stringify([
                        {
                            barcode: result.data,
                            description:
                                result.type === "512" ? "upc-a" : "ean13",
                            id: new Date().toString() + loginData.login,
                        },
                    ]),
                }
            );

            if (!response.ok) {
                throw new Error(`Запрос вернул статус-код ${response.status}`);
            }

            ToastAndroid.show("Код успешно отправлен.", ToastAndroid.SHORT);
            prevScan.current = result;
            setScanPause(false);
        } catch (error) {
            ToastAndroid.show(
                `Произошла ошибка при отправке кода: ${error}.`,
                ToastAndroid.SHORT
            );
            setScanPause(false);
        }
    };

    useEffect(() => {
        if (!hasPermission) requestPermission();
    }, []);

    if (!hasPermission) return <NoCameraPermission />;

    return (
        <View style={styles.blackContainer}>
            <Text style={styles.text}>
                {cameraReady ? "Поместите код в рамку" : "Загрузка камеры..."}
            </Text>
            {isFocused && (
                <CameraView
                    facing="back"
                    style={styles.camera}
                    barcodeScannerSettings={{
                        barcodeTypes: ["ean13", "upc_a"],
                    }}
                    onBarcodeScanned={handleCodeScanTemplate}
                    enableTorch={torch}
                    onCameraReady={() => setCameraReady(true)}
                />
            )}
            <Button
                title={`В${torch ? "ы" : ""}ключить фонарь`}
                onPress={() => setTorch(!torch)}
            />
            <Button
                title="Настройки"
                onPress={() => router.push("/settings")}
            />
        </View>
    );
}
