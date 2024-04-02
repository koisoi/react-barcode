import { useCameraPermission } from "react-native-vision-camera";
import { AppContext } from "./context";
import { Slot } from "expo-router";

export default function Root() {
    const { hasPermission, requestPermission } = useCameraPermission();

    const context = {
        hasPermission,
        requestPermission,
    };

    // useEffect(() => {
    //     const getLink = async () => {
    //         let result = await getItemAsync("link");
    //         setLink(result);
    //     };
    //     getLink();
    // }, []);

    return (
        <AppContext.Provider value={context}>
            <Slot />
        </AppContext.Provider>
    );
}
