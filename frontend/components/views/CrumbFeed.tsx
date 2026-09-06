import { useCrumbFeed } from "@/hooks/queries/useCrumbDbQueries";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useRouter } from "expo-router";
import { SearchIcon } from "lucide-react-native";
import { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import CustomButton from "../buttons/CustomButton";
import CustomLabel from "../CustomLabel";
import Spacer from "../Spacer";

interface props {
  onSearchPress: () => void
}

export default function CrumbFeed({ onSearchPress }: props) {
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
        <CustomLabel adaptToTheme bold fontSize={21} labelText="Crumbs" />
        <CustomButton
          handleClick={onSearchPress}
          freed
          type="theme-faded"
          customStyle={{
            position: "absolute",
            right: 20,
            padding: 10
          }}
        >
          <SearchIcon stroke={textCol} strokeWidth={3.5} size={18} />
        </CustomButton>
      </View>
      <View
        style={styles.feed}
      >
        {(feed?.size ?? 0) > 0 && <View>
          {feed &&
            Array.from(feed).map(([friend_id, crumbs]) => (
              <CustomLabel adaptToTheme key={friend_id} labelText={friend_id} />
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
    minHeight: 80,
  },
  feed: {
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