import { FeedItem } from "@/api/db/crumbsDb";
import { UserSharedPageDetails } from "@/api/models/userDetails";
import { Colors } from "@/constants/Colors";
import { useGetUser } from "@/hooks/queries/useUserApi";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { CameraIcon } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomButton from "../buttons/CustomButton";
import CustomLabel from "../CustomLabel";
import CustomProfilePictureCircle from "../profile/CustomProfilePictureCircle";

interface props {
  friendId: string
  feedItem: FeedItem
  simplified?: boolean
}

export default function CrumbFeedFriend({ feedItem, friendId, simplified }: props) {
  const {
    data: friend,
    error: friendError,
    isPending: friendPending,
  } = useGetUser(friendId)

  const router = useRouter()

  const getName = () => {
    if (!friend) return "<Unknown user>"
    else if (friend.name) return friend.name
    else return friend.nickname || "<Unknown user>"
  }

  const [hasCrumb, setHasCrumb] = useState(feedItem.crumbs.length > 0)
  const textCol = useThemeColor({}, "text")

  const handleShowShared = () => {
    if (!friend) return
    setHasCrumb(false)
    const userSharedDetails: UserSharedPageDetails = {
      displayName: getName(),
      userid: friend.userId,
    }
    router.push(
      {
        pathname: "/(protected)/(main)/shared",
        params: userSharedDetails,
      }
    )
  }

  return (
    <TouchableOpacity
      style={[styles.container, {
        width: simplified ? "auto" : "100%",
      }]}
      onPress={handleShowShared}
      onLongPress={() => { }}
    >
      <View>
        <CustomProfilePictureCircle
          size={52}
          flat={!simplified}
          userId={friendId}
          customStyle={{
            outlineWidth: 0,
            borderWidth: 1,
            borderColor: "rgba(0, 0, 0, .1)"
          }}
        />

        {simplified && hasCrumb &&
          <View
            style={{
              position: "absolute",
              width: 13,
              height: 13,
              backgroundColor: "red",
              borderRadius: 10000,
              top: 0,
              right: 0,
            }}
          />
        }
      </View>
      {!simplified && <>
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
              marginTop: 2,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <View style={{
              width: 12,
              height: 12,
              backgroundColor: hasCrumb ? "red" : "transparent",
              borderRadius: 3,
              marginRight: 4,
              borderWidth: 2,
              borderColor: hasCrumb ? "red" : Colors.light.vibrantButton,
            }} />
            <CustomLabel allowTruncate adaptToTheme bold={hasCrumb} fontSize={13} labelText={
              hasCrumb ? `Tap to view` : feedItem.action
            }
              fade={!hasCrumb}
              customStyle={{
                color: hasCrumb ? "red" : textCol
              }}
            />
          </View>
        </View>

        <CustomButton
          freed
          type="text"
        >
          <CameraIcon stroke={textCol} strokeWidth={2.5} size={23} />
        </CustomButton>
      </>}
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