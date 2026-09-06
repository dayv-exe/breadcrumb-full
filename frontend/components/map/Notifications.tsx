import { StyleSheet, View } from "react-native";
import CustomLabel from "../CustomLabel";

export default function Notifications() {
  return (
    <View
      style={styles.container}
    >
      <View
        style={styles.header}
      >
        <CustomLabel adaptToTheme bold fontSize={21} labelText="Notifications" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  }
})