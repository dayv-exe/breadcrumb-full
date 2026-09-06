import { useState } from "react"
import { LayoutChangeEvent, useWindowDimensions } from "react-native"

interface CenterOfBottomSheetState {
  top: number
  onLayout: (e: LayoutChangeEvent) => void
}

export function useCenterOfBottomSheet(): CenterOfBottomSheetState {
  const dimensions = useWindowDimensions()
  const [top, setTop] = useState(0)

  const onLayout = (event: LayoutChangeEvent) => {
    setTop((dimensions.height / 2) - event.nativeEvent.layout.height - 100)
  }

  return {
    top,
    onLayout
  }
}