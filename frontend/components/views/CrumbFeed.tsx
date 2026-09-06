import { useCrumbFeed } from "@/hooks/queries/useCrumbDbQueries";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { BellIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import CustomButton from "../buttons/CustomButton";
import CustomLabel from "../CustomLabel";
import Spacer from "../Spacer";
import CrumbFeedFriend from "./CrumbFeedFriend";

interface props {
  sheetIsOpened: boolean
  toggleSheet: () => void
}

export default function CrumbFeed({ sheetIsOpened, toggleSheet }: props) {
  const {
    data: feed,
    error,
    isPending
  } = useCrumbFeed()

  const nav = useRouter()
  const dimensions = useWindowDimensions()
  const [emptyFeedTop, setEmptyFeedTop] = useState(0)
  const handleFindFriends = () => {
    nav.push("/find-friends")
  }
  const textCol = useThemeColor({}, "text")

  return (
    <View
      style={styles.container}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CustomButton
          freed
          type="text"
          customStyle={{
            position: "absolute",
            left: 20,
            padding: 10
          }}
          handleClick={() => {
            toggleSheet()
          }}
        >
          {sheetIsOpened && <ChevronDownIcon stroke={textCol} strokeWidth={3.5} size={21} />}
          {!sheetIsOpened && <ChevronUpIcon stroke={textCol} strokeWidth={3.5} size={21} />}
        </CustomButton>
        <CustomLabel adaptToTheme bold fade fontSize={21} labelText="Crumbs" />
        <CustomButton
          freed
          type="theme-faded"
          customStyle={{
            position: "absolute",
            right: 20,
            padding: 10
          }}
        >
          <BellIcon stroke={textCol} strokeWidth={3.5} size={18} />
        </CustomButton>
      </View>
      <View
        style={styles.feed}
      >
        {(feed?.size ?? 0) > 0 && <View>
          {feed &&
            Array.from(feed).map(([friend_id, item]) => (
              <CrumbFeedFriend key={friend_id} friendId={friend_id} feedItem={item} />
            ))
          }
        </View>}
        {(feed?.size ?? 0) === 0 && <View
          onLayout={(e) => {
            setEmptyFeedTop((dimensions.height / 2) - e.nativeEvent.layout.height - 100)
          }}
          style={[styles.emptyFeed, {
            top: emptyFeedTop
          }]}
        >
          <CustomLabel adaptToTheme fontSize={27} labelText="👀" />
          <Spacer size="tiny" />
          <CustomLabel fontSize={17} bold adaptToTheme labelText="No crumbs here yet" />
          <Spacer size="tiny" />
          <CustomLabel fontSize={13} fade adaptToTheme labelText="Add your friends to get started" />
          <Spacer />
          <CustomButton handleClick={handleFindFriends} slim type="less-prominent" paddingHorizontal={20} labelText="Find Friends" />
        </View>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 25,
  },
  feed: {
    paddingTop: 20,
    paddingHorizontal: 25,
    width: "100%",
  },
  emptyFeed: {
    position: "absolute",
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 15,
  }
})