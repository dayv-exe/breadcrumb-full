import { FeedItem } from "@/api/db/crumbsDb";
import { Colors } from "@/constants/Colors";
import { useGetUser } from "@/hooks/queries/useUserApi";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CameraIcon } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomButton from "../buttons/CustomButton";
import CustomLabel from "../CustomLabel";
import CustomProfilePictureCircle from "../profile/CustomProfilePictureCircle";

interface props {
  friendId: string
  feedItem: FeedItem
}

export default function CrumbFeedFriend({ feedItem, friendId }: props) {
  const {
    data: friend,
    error: friendError,
    isPending: friendPending,
  } = useGetUser(friendId)

  const getName = () => {
    if (!friend) return "<Unknown user>"
    else if (friend.name) return friend.name
    else return friend.nickname || "<Unknown user>"
  }

  const hasCrumb = feedItem.crumbs.length > 0
  const textCol = useThemeColor({}, "text")

  return (
    <TouchableOpacity
      style={styles.container}
    >
      <CustomProfilePictureCircle size={52} flat userId={friendId} />
      <View
        style={{
          marginLeft: 15,
          flexGrow: 1,
          flexShrink: 1,
        }}
      >
        <CustomLabel allowTruncate adaptToTheme bold={hasCrumb} fontSize={18} labelText={getName()} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <View style={{
            width: 12,
            height: 12,
            backgroundColor: hasCrumb ? Colors.light.vibrantButton : "transparent",
            borderRadius: 3,
            marginRight: 4,
            borderWidth: 2,
            borderColor: Colors.light.vibrantButton,
          }} />
          <CustomLabel allowTruncate adaptToTheme textColor={hasCrumb ? Colors.light.vibrantButton : undefined} bold={hasCrumb} fontSize={14} labelText={
            hasCrumb ? "Tap to view" : feedItem.action
          } />
        </View>
      </View>

      <CustomButton
        freed
        type="text"
      >
        <CameraIcon stroke={textCol} strokeWidth={2.5} size={23} />
      </CustomButton>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  }
})