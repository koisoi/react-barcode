import { Dispatch, SetStateAction, createContext } from "react";

export const AppContext = createContext<{
    // link: null | string;
    // setLink: Dispatch<SetStateAction<string | null>>;
    hasPermission: boolean;
    requestPermission: () => any;
}>({
    // link: null,
    // setLink: () => {},
    hasPermission: false,
    requestPermission: () => {},
});
