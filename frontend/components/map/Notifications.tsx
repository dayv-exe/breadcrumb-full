import { useCenterOfBottomSheet } from "@/hooks/useCenterOfBottomSheet";
import { StyleSheet, View } from "react-native";
import CustomLabel from "../CustomLabel";

export default function Notifications() {
  const {
    top: centerTop,
    onLayout: onCenterLayout
  } = useCenterOfBottomSheet()

  return (
    <View
      style={styles.container}
    >
      <View
        style={styles.header}
      >
        <CustomLabel adaptToTheme bold fade fontSize={21} labelText="Notifications" />
      </View>

      <View
        style={[styles.empty, {
          top: centerTop,
        }]}
        onLayout={onCenterLayout}
      >
        <CustomLabel adaptToTheme fontSize={32} labelText="👍" />
        <CustomLabel adaptToTheme fontSize={16} labelText="all clear here!" />
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
  },
  empty: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  }
})