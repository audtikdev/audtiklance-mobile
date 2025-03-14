import React from "react";
import { View, ActivityIndicator, Modal, StyleSheet } from "react-native";

interface LoadingOverlayProps {
    visible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible }) => {
    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
    },
    loaderContainer: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: "rgba(0,0,0,0.7)",
    },
});

export default LoadingOverlay;
