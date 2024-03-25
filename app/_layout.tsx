import { useEffect, useState } from "react";
import { useCameraPermission } from "react-native-vision-camera";
import { AppContext } from "./context";
import { Slot } from "expo-router";
import { getItemAsync } from "expo-secure-store";

export default function Root() {
    const { hasPermission, requestPermission } = useCameraPermission();

    const [link, setLink] = useState<string | null>(null);
    const context = {
        link,
        setLink,
        hasPermission,
        requestPermission,
    };

    useEffect(() => {
        const getLink = async () => {
            let result = await getItemAsync("link");
            setLink(result);
        };
        getLink();
    }, []);

    return (
        <AppContext.Provider value={context}>
            <Slot />
        </AppContext.Provider>
    );
}
