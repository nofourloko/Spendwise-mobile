import React, {useRef, useState} from 'react';
import {View, PanResponder, type LayoutChangeEvent} from 'react-native';
import colors from '../assets/colors';

type Props = {
  value: number;
  /** Upper bound of the track (e.g. the overall budget). */
  max: number;
  step?: number;
  color?: string;
  onChange: (next: number) => void;
};

const THUMB = 16;

/**
 * Dependency-free slider built on PanResponder + onLayout, so it works without a
 * native module / rebuild. Maps a horizontal drag (or tap) on the track to a
 * value in `[0, max]`, snapped to `step`. Latest `onChange`/`max` are read via
 * refs because the PanResponder is created once.
 */
export default function BudgetSlider({
  value,
  max,
  step = 50,
  color = colors.primary,
  onChange,
}: Props) {
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const maxRef = useRef(max);
  const onChangeRef = useRef(onChange);
  maxRef.current = max;
  onChangeRef.current = onChange;

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    widthRef.current = w;
    setWidth(w);
  };

  const valueFromX = (x: number) => {
    const w = widthRef.current || 1;
    const ratio = Math.min(Math.max(x / w, 0), 1);
    const stepped = Math.round((ratio * maxRef.current) / step) * step;
    return Math.min(Math.max(stepped, 0), maxRef.current);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: e =>
        onChangeRef.current(valueFromX(e.nativeEvent.locationX)),
      onPanResponderMove: e =>
        onChangeRef.current(valueFromX(e.nativeEvent.locationX)),
    }),
  ).current;

  const ratio = max > 0 ? Math.min(value / max, 1) : 0;
  const fillWidth = ratio * width;

  return (
    <View
      onLayout={onLayout}
      {...panResponder.panHandlers}
      className="justify-center"
      style={{height: 28}}>
      <View
        className="h-1.5 rounded-full"
        style={{backgroundColor: colors.neutral}}>
        <View
          className="h-full rounded-full"
          style={{width: fillWidth, backgroundColor: color}}
        />
      </View>
      <View
        className="absolute rounded-full"
        style={{
          width: THUMB,
          height: THUMB,
          top: (28 - THUMB) / 2,
          left: Math.max(0, Math.min(fillWidth - THUMB / 2, width - THUMB)),
          backgroundColor: color,
        }}
      />
    </View>
  );
}
