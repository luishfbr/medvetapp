import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

const AppButton = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={styles.appButtonContainer}>
    <Text style={styles.appButtonText}>{title}</Text>
  </TouchableOpacity>
);
export default AppButton 

const styles = StyleSheet.create({
    screenContainer: {
      flex: 1,
      justifyContent: "center",
      padding: 16,
    },
    appButtonContainer: {
      backgroundColor: "#1E1E1E",
      borderRadius: 10,
      paddingVertical: 15,
      marginBottom: 20
    },
    appButtonText: {
      fontSize: 22,
      color: "#fff",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
    }
  });