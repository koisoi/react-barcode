import { AppContext } from "./context";
import { Slot } from "expo-router";
import { useCameraPermissions } from "expo-camera/next";

export default function Root() {
    const [hasPermission, requestPermission] = useCameraPermissions();

    const context = {
        hasPermission: hasPermission?.granted || false,
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
