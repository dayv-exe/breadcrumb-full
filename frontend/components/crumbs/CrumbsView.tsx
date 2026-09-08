import { MediaData } from "@/constants/media";
import { BlurView } from "expo-blur";
import { useEffect, useRef, useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import CrumbView from "./CrumbView";

interface CrumbStackProps {
  media: MediaData[];
  visible: boolean;
  onClose: () => void;
  initialIndex?: number;
  cardSize?: number;
}

const ROT = 14; // max drag tilt 

const BEHIND = [
  null,
  { translateX: 8, translateY: 14, rotate: "6deg", scale: 0.94, opacity: 0.96 },
  { translateX: -10, translateY: 26, rotate: "-7deg", scale: 0.88, opacity: 0.9 },
] as const;

export default function CrumbStack({
  media,
  visible,
  onClose,
  initialIndex = 0,
  cardSize = 320,
}: CrumbStackProps) {
  const [index, setIndex] = useState(initialIndex);

  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const enter = useSharedValue(0);
  const enterX = useSharedValue(0);

  const THRESH = cardSize * 0.55;

  useEffect(() => {
    if (!visible) return;
    setIndex(Math.min(initialIndex, Math.max(0, media.length - 1)));
    tx.value = 0;
    ty.value = 0;
    enter.value = 0;
    enterX.value = 0;
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    if (media.length === 0) {
      onClose();
      return;
    }
    if (index > media.length - 1) setIndex(media.length - 1);
  }, [media.length, index, visible, onClose]);

  const commitNext = () => {
    setIndex((i) => i + 1);
    tx.value = 0;
    ty.value = 0;
    enterX.value = 0;
    enter.value = 1;
    enter.value = withSpring(0, { damping: 15, stiffness: 140 });
  };

  const commitPrev = () => {
    setIndex((i) => i - 1);
    ty.value = 0;
    enter.value = 0;
    tx.value = 0;
    enterX.value = -cardSize * 2.2;
    enterX.value = withSpring(0, { damping: 16, stiffness: 140 });
  };

  const goNextOrClose = () => {
    const last = indexRef.current >= media.length - 1;
    tx.value = withTiming(-cardSize * 2.2, { duration: 240 }, (fin) => {
      if (!fin) return;
      if (last) runOnJS(onClose)();
      else runOnJS(commitNext)();
    });
    ty.value = withTiming(0, { duration: 240 });
  };

  const goPrev = () => {
    if (indexRef.current <= 0) {
      tx.value = withSpring(0);
      ty.value = withSpring(0);
      return;
    }
    tx.value = withTiming(cardSize * 2.2, { duration: 240 }, (fin) => {
      if (fin) runOnJS(commitPrev)();
    });
    ty.value = withTiming(0, { duration: 240 });
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-24, 24])
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY * 0.12;
    })
    .onEnd((e) => {
      const next = e.translationX < -THRESH || e.velocityX < -900;
      const prev = e.translationX > THRESH || e.velocityX > 900;
      if (next) runOnJS(goNextOrClose)();
      else if (prev) runOnJS(goPrev)();
      else {
        tx.value = withSpring(0);
        ty.value = withSpring(0);
      }
    });

  const topStyle = useAnimatedStyle(() => {
    const dragRot = interpolate(
      tx.value,
      [-cardSize * 2, 0, cardSize * 2],
      [-ROT, 0, ROT],
      Extrapolation.CLAMP,
    );
    const eTX = interpolate(enter.value, [0, 1], [0, 8]);
    const eTY = interpolate(enter.value, [0, 1], [0, 14]);
    const eRot = interpolate(enter.value, [0, 1], [0, 6]);
    const scale = interpolate(enter.value, [0, 1], [1, 0.94]);
    return {
      transform: [
        { translateX: tx.value + enterX.value + eTX },
        { translateY: ty.value + eTY },
        { rotate: `${dragRot + eRot}deg` },
        { scale },
      ],
    };
  });

  if (!visible || media.length === 0) return null;

  const cardH = cardSize * 1.25;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GestureDetector gesture={pan}>
          <View style={StyleSheet.absoluteFill}>
            <BlurView
              intensity={40}
              tint="dark"
              style={StyleSheet.absoluteFill}
              experimentalBlurMethod="dimezisBlurView"
            />
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.35)" }]}
              pointerEvents="none"
            />
            <Pressable style={StyleSheet.absoluteFill} onPress={goNextOrClose} />

            <View style={styles.center} pointerEvents="box-none">
              <View style={{ width: cardSize, height: cardH }} pointerEvents="box-none">
                {[2, 1].map((d) => {
                  const m = media[index + d];
                  if (!m) return null;
                  const c = BEHIND[d]!;
                  return (
                    <View
                      key={m.id}
                      pointerEvents="none"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: cardSize,
                        opacity: c.opacity,
                        transform: [
                          { translateX: c.translateX },
                          { translateY: c.translateY },
                          { rotate: c.rotate },
                          { scale: c.scale },
                        ],
                      }}
                    >
                      <CrumbView mediaData={m} size={cardSize} />
                    </View>
                  );
                })}

                <Animated.View
                  style={[{ position: "absolute", top: 0, left: 0, width: cardSize }, topStyle]}
                >
                  <Pressable onPress={goNextOrClose}>
                    <CrumbView mediaData={media[index]} size={cardSize} />
                  </Pressable>
                </Animated.View>
              </View>
            </View>

            <View style={styles.dots} pointerEvents="none">
              {media.map((m, i) => (
                <View key={m.id} style={[styles.dot, i === index && styles.dotActive]} />
              ))}
            </View>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  dots: {
    position: "absolute",
    bottom: 48,
    width,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.35)" },
  dotActive: { backgroundColor: "#FFFFFF", width: 18 },
});