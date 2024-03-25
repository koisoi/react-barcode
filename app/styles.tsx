import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    input: {
        width: 250,
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    iconButton: {
        position: "absolute",
        top: 50,
        right: 25,
        zIndex: 1,
    },
    centeredText: {
        textAlign: "center",
    },
});

export const buttonsColor: string = "#841584";
