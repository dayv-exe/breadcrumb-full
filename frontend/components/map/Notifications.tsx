import { useCenterOfBottomSheet } from "@/hooks/useCenterOfBottomSheet";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ChevronDownIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import CustomLabel from "../CustomLabel";
import CustomButton from "../buttons/CustomButton";

interface props {
  onHideNotifications: () => void
}

export default function Notifications({ onHideNotifications }: props) {
  const {
    top: centerTop,
    onLayout: onCenterLayout
  } = useCenterOfBottomSheet()
  const textCol = useThemeColor({}, "text")

  return (
    <View
      style={styles.container}
    >
      <View
        style={styles.header}
      >
        <CustomButton
          freed
          type="text"
          customStyle={{
            position: "absolute",
            left: 20,
          }}
          handleClick={onHideNotifications}
        >
          <ChevronDownIcon stroke={textCol} strokeWidth={3.5} size={23} />
        </CustomButton>
        <CustomLabel adaptToTheme bold fontSize={23} labelText="Notifications" />
      </View>

      <View
        style={[styles.empty, {
          top: centerTop,
        }]}
        onLayout={onCenterLayout}
      >
        {/* <CustomLabel adaptToTheme fontSize={32} labelText="👍" /> */}
        <CustomLabel adaptToTheme fontSize={16} fade labelText="Notification will appear here" />
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