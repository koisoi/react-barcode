import { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, PixelRatio, Pressable, View } from "react-native";
import {
    Camera,
    Frame,
    useCameraDevice,
    useCameraFormat,
} from "react-native-vision-camera";
import { useRouter } from "expo-router";
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

export default function App() {
    const { hasPermission, requestPermission, link } = useContext(AppContext);
    const device = useCameraDevice("back");
    const router = useRouter();

    const [scanPause, setScanPause] = useState<boolean>(false);
    const prevScan = useRef<Barcode | null>(null);

    const [pixelRatio] = useState(PixelRatio.get());
    const format = useCameraFormat(device, [
        { videoAspectRatio: 16 / 9 },
        { fps: 60 },
    ]);

    const screen = Dimensions.get("screen");
    const screenWidth = screen.width * pixelRatio;
    const screenHeight = screen.height * pixelRatio;
    const videoWidth = format!.videoWidth;
    const videoHeight = format!.videoHeight;

    /* the video coordinates are measured based on the video width and height, however
     * the camera is displayed using StyleSheet.absoluteFill, which will expand the video to the
     * top and bottom of the screen, and overflow on the sides. To figure out where the square is
     * on the video's coordinate plane (which starts off the screen due to the overflow), we need to
     * calculate how much the video overflowed on the sides. clippedVideoSectionWidth is how much
     * the camera overflowed on a single side */
    const filledVideoWidth = (videoHeight * screenWidth) / screenHeight;
    const clippedVideoSectionsWidth = Math.abs(filledVideoWidth - videoWidth);
    const clippedVideoSectionWidth = clippedVideoSectionsWidth / 2;
    const squareWidth = (videoWidth - clippedVideoSectionsWidth) * 0.6;

    const handleCodeScanTemplate = async (codes: Barcode[], frame: Frame) => {
        if (scanPause || !link) return;
        setScanPause(true);
        if (prevScan.current && codes[0].value === prevScan.current?.value) {
            setScanPause(false);
            return;
        }

        const [topLeft, topRight, bottomRight, bottomLeft] =
            codes[0].cornerPoints;

        const top = (topLeft.y + topRight.y) / 2;
        const left = (topLeft.x + bottomLeft.x) / 2;
        const right = (topRight.x + bottomRight.x) / 2;
        const bottom = (bottomLeft.y + bottomRight.y) / 2;

        const boundingRect = {
            left:
                (videoWidth - clippedVideoSectionsWidth) * 0.02 +
                clippedVideoSectionWidth,
            top: videoHeight * 0.225,
            right:
                (videoWidth - clippedVideoSectionsWidth) * 0.98 +
                clippedVideoSectionWidth,
            bottom: videoHeight * 0.775,
        };

        const isBarcodeInsideArea: boolean =
            left > boundingRect.left &&
            top > boundingRect.top &&
            right < boundingRect.right &&
            bottom < boundingRect.bottom;

        if (isBarcodeInsideArea) {
            // const promise = await fetch(link)
            prevScan.current = codes[0];
            console.log(
                boundingRect.left,
                boundingRect.top,
                boundingRect.right,
                boundingRect.bottom
            );
            console.log(left, top, right, bottom);
            setScanPause(false);
        } else {
            console.log("Camera thinks barcode is out of area");
            console.log(
                boundingRect.left,
                boundingRect.top,
                boundingRect.right,
                boundingRect.bottom
            );
            console.log(left, top, right, bottom);
            setScanPause(false);
        }
    };

    const handleCodeScan = Worklets.createRunInJsFn(handleCodeScanTemplate);

    const resizeMode = "cover";

    const { props: cameraProps, highlights } = useBarcodeScanner({
        barcodeTypes: ["ean-13"], // optional
        onBarcodeScanned: (codes, frame) => {
            "worklet";
            handleCodeScan(codes, frame);
        },
        resizeMode,
        disableHighlighting: false,
    });

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
                <MaterialIcons name="settings" size={30} color="black" />
            </Pressable>
            {/* <Camera
                style={styles.camera}
                device={device}
                isActive={true}
                {...cameraProps}
            />
            <CameraHighlights highlights={highlights} color="white" />
            <CameraHighlight
                origin={{
                    x: videoWidth * 0.02,
                    y: videoHeight * 0.225,
                }}
                size={{ width: squareWidth, height: squareWidth }}
                color="white"
            /> */}
        </View>
    );
}
