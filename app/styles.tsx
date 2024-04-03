import { StyleSheet } from "react-native";

const prestyles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#000",
        color: "white",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    input: {
        width: 250,
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        color: "white",
        borderColor: "white",
    },
    centeredText: {
        textAlign: "center",
    },
    camera: {
        width: "80%",
        aspectRatio: 1,
        overflow: "hidden",
        borderRadius: 10,
        marginBottom: 40,
        zIndex: 1,
    },
    iconButton: {
        position: "absolute",
        top: 50,
        right: 25,
        zIndex: 2,
    },
    text: {
        color: "white",
        fontSize: 20,
        textAlign: "center",
    },
});

export const styles = StyleSheet.create({
    ...prestyles,
    blackContainer: {
        ...prestyles.container,
        backgroundColor: "#000",
    },
});
