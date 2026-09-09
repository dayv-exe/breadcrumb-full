import { UserSharedPageDetails } from "@/api/models/userDetails";
import CustomButton from "@/components/buttons/CustomButton";
import CustomLabel from "@/components/CustomLabel";
import CustomProfilePictureCircle from "@/components/profile/CustomProfilePictureCircle";
import Spacer from "@/components/Spacer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { colorForUserId } from "@/utils/userColor";
import { useLocalSearchParams } from "expo-router";
import { ChevronLeftIcon, MoreHorizontalIcon } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Shared() {
  const textCol = useThemeColor({}, "text")
  const bgCol = useThemeColor({}, "background")
  const crumbBorderCol = useThemeColor({}, "fadedBackground")
  const insets = useSafeAreaInsets()
  const { userid, displayName } = useLocalSearchParams<UserSharedPageDetails>()
  const userCol = colorForUserId(userid)
  const topPadding = insets.top

  const [headerHeight, setHeaderHeight] = useState(0)

  return (
    <View
      style={[styles.container, {
        backgroundColor: bgCol
      }]}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: headerHeight + 15,
        }}
      >
        <CustomLabel labelText="nearby" bold adaptToTheme fontSize={12} textAlign="center" customStyle={{
          opacity: .35,
        }} />
        <Spacer size="small" />
        <CustomButton
          freed
          type="theme-faded"
          customStyle={{
            marginHorizontal: 15,
            borderRadius: 10,
            justifyContent: "flex-start",
            padding: 20,
          }}
        >
          <View
            style={{
              width: 15,
              height: 15,
              backgroundColor: userCol,
              borderRadius: 2.5,
            }}
          />
          <Spacer size="small" />
          <CustomLabel adaptToTheme width="auto" labelText="Tap to view" />
        </CustomButton>
      </ScrollView>
      <View
        style={[styles.header, {
          top: 0,
          paddingTop: topPadding,
          paddingBottom: 5,
          backgroundColor: bgCol,
          elevation: 5,
          shadowOffset: { height: 0, width: 0 },
          shadowOpacity: .1,
          shadowRadius: 5,
        }]}
        onLayout={e => {
          setHeaderHeight(e.nativeEvent.layout.height)
        }}
      >
        <CustomButton
          freed
          type="text"
          customStyle={{
            width: 50,
            height: 50,
          }}
        >
          <ChevronLeftIcon stroke={textCol} strokeWidth={3.5} size={23} />
        </CustomButton>
        <View
          style={[styles.userDetails, {

          }]}
        >
          <CustomProfilePictureCircle useUserColor userId={userid} size={40} />
          <Spacer size="small" />
          <CustomLabel allowTruncate bold fontSize={18} adaptToTheme labelText={displayName} />
        </View>

        <CustomButton
          freed
          type="text"
          customStyle={{
            width: 50,
            height: 50,
          }}
        >
          <MoreHorizontalIcon stroke={textCol} strokeWidth={2} size={27} />
        </CustomButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  userDetails: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    flexGrow: 1,
    flexShrink: 1,
  }
})