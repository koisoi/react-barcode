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
    centeredText: {
        textAlign: "center",
    },

    camera: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    iconButton: {
        position: "absolute",
        top: 50,
        right: 25,
        zIndex: 2,
    },
    text: {
        position: "absolute",
        top: 150,
        right: 25,
        zIndex: 3,
        color: "white",
        fontSize: 20,
    },
});
