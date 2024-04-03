import { useContext, useEffect, useRef, useState } from "react";
import {
    Dimensions,
    PixelRatio,
    Pressable,
    View,
    Text,
    AppState,
    ToastAndroid,
    Button,
} from "react-native";
import {
    Camera,
    Code,
    CodeScannerFrame,
    Frame,
    useCameraDevice,
    useCameraFormat,
    useCodeScanner,
} from "react-native-vision-camera";
import { useNavigation, useRouter } from "expo-router";
import { styles } from "./styles";
import NoCameraError from "./noCameraError";
import NoCameraPermission from "./noCameraPermission";
import { AppContext } from "./context";
import { MaterialIcons } from "@expo/vector-icons";
import {
    Barcode,
    CameraHighlight,
    CameraHighlights,
    useBarcodeScanner,
} from "@mgcrea/vision-camera-barcode-scanner";
import { getLoginData } from "../lib";
import { BarcodeScanningResult, CameraView } from "expo-camera/next";
import { CameraLoading } from "./cameraLoading";

export default function App() {
    const { hasPermission, requestPermission } = useContext(AppContext);
    // const device = useCameraDevice("back");
    const router = useRouter();

    const isFocused = useNavigation().isFocused();
    // const appState = AppState.currentState;
    // const isActive: boolean =
    //     isFocused && appState === "active" && typeof device !== "undefined";

    const [cameraReady, setCameraReady] = useState<boolean>(false);
    const [scanPause, setScanPause] = useState<boolean>(false);
    const [torch, setTorch] = useState<boolean>(false);
    const prevScan = useRef<BarcodeScanningResult | null>(null);

    // const [pixelRatio] = useState(PixelRatio.get());
    // const format = useCameraFormat(device, [
    //     { videoAspectRatio: 16 / 9 },
    //     { fps: 60 },
    // ]);

    // const screen = Dimensions.get("screen");
    // const screenWidth = screen.width * pixelRatio;
    // const screenHeight = screen.height * pixelRatio;
    // const videoWidth = format!.videoWidth;
    // const videoHeight = format!.videoHeight;

    /* the video coordinates are measured based on the video width and height, however
     * the camera is displayed using StyleSheet.absoluteFill, which will expand the video to the
     * top and bottom of the screen, and overflow on the sides. To figure out where the square is
     * on the video's coordinate plane (which starts off the screen due to the overflow), we need to
     * calculate how much the video overflowed on the sides. clippedVideoSectionWidth is how much
     * the camera overflowed on a single side */
    // const filledVideoWidth = (videoHeight * screenWidth) / screenHeight;
    // const clippedVideoSectionsWidth = Math.abs(filledVideoWidth - videoWidth);
    // const clippedVideoSectionWidth = clippedVideoSectionsWidth / 2;
    // const squareWidth = (videoWidth - clippedVideoSectionsWidth) * 0.6;

    const handleCodeScanTemplate = async (
        // codes: Code[],
        // frame: CodeScannerFrame
        result: BarcodeScanningResult
    ) => {
        if (
            scanPause ||
            (prevScan.current &&
                /*codes[0].value*/ result.data ===
                    prevScan.current?./*value*/ data)
            // || !codes[0].corners
        )
            return;
        // console.log(scanPause);
        const loginData = await getLoginData();

        setScanPause(true);

        // result.cornerPoints

        // const [topLeft, topRight, bottomRight, bottomLeft] =
        //     result.cornerPoints;
        // [
        //     codes[0].corners[0],
        //     codes[0].corners[1],
        //     codes[0].corners[2],
        //     codes[0].corners[3],
        // ];

        // const top = (topLeft.y + topRight.y) / 2;
        // const left = (topLeft.x + bottomLeft.x) / 2;
        // const right = (topRight.x + bottomRight.x) / 2;
        // const bottom = (bottomLeft.y + bottomRight.y) / 2;

        // const boundingRect = {
        //     left:
        //         (videoWidth - clippedVideoSectionsWidth) * 0.02 +
        //         clippedVideoSectionWidth,
        //     top: videoHeight * 0.225,
        //     right:
        //         (videoWidth - clippedVideoSectionsWidth) * 0.98 +
        //         clippedVideoSectionWidth,
        //     bottom: videoHeight * 0.775,
        // };

        // const isBarcodeInsideArea: boolean =
        //     left > boundingRect.left &&
        //     top > boundingRect.top &&
        //     right < boundingRect.right &&
        //     bottom < boundingRect.bottom;

        // if (isBarcodeInsideArea) {
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
                            barcode: /*codes[0].value*/ result.data,
                            description:
                                /*codes[0].type*/ result.type === "512"
                                    ? "upc-a"
                                    : "ean13",
                            id: new Date().toString() + loginData.login,
                        },
                    ]),
                }
            );

            if (!response.ok) {
                throw new Error(`Запрос вернул статус-код ${response.status}`);
            }

            ToastAndroid.show("Код успешно отправлен.", ToastAndroid.SHORT);
            prevScan.current = /*codes[0]*/ result;
            setScanPause(false);
        } catch (error) {
            ToastAndroid.show(
                `Произошла ошибка при отправке кода: ${error}.`,
                ToastAndroid.SHORT
            );
            setScanPause(false);
        }
        // } else {
        //     console.log("code is out of area");
        //     setScanPause(false);
        // }
    };

    // const handleCodeScan = Worklets.createRunInJsFn(handleCodeScanTemplate);

    // const resizeMode = "cover";

    // const { props: cameraProps, highlights } = useBarcodeScanner({
    //     barcodeTypes: ["ean-13"], // optional
    //     onBarcodeScanned: (codes, frame) => {
    //         "worklet";
    //         // handleCodeScan(codes, frame);
    //     },
    //     resizeMode,
    //     disableHighlighting: false,
    // });

    // const codeScanner = useCodeScanner({
    //     codeTypes: ["qr", "ean-13"],
    //     onCodeScanned: (codes, frame) => {
    //         // handleCodeScanTemplate(codes, frame);
    //     },
    // });

    useEffect(() => {
        if (!hasPermission) requestPermission();
    }, []);

    if (!hasPermission) return <NoCameraPermission />;

    // if (device == null) return <NoCameraError />;

    return (
        <View style={styles.blackContainer}>
            {/* <Pressable
            onPress={() => router.push("/settings")}
            style={styles.iconButton}
        >
            <MaterialIcons
                name="settings"
                size={30}
                color="white"
            />
        </Pressable> */}
            <Text style={styles.text}>Поместите код в рамку</Text>
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
            {/* <Text style={styles.text}>{prevScan.current?.value}</Text> */}
            {/*isFocused && (
                <>
                    <Camera
                        style={styles.camera}
                        device={device}
                        isActive={isActive}
                        codeScanner={codeScanner}
                        // {...cameraProps}
                    />
                     <CameraHighlights highlights={highlights} color="white" />
                    <CameraHighlight
                        origin={{
                            x: videoWidth * 0.02,
                            y: videoHeight * 0.225,
                        }}
                        size={{ width: squareWidth, height: squareWidth }}
                        color="white"
                    />
                </>
            )*/}
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
