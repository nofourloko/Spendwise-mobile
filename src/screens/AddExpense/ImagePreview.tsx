import React from 'react';
import {Modal, View, Image, Text, TouchableOpacity, Pressable} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';

type Props = {
  visible: boolean;
  uri: string;
  onConfirm: () => void;
  onRetake: () => void;
  onClose: () => void;
};

export default function ImagePreview({
  visible,
  uri,
  onConfirm,
  onRetake,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View className="flex-1" style={{backgroundColor: colors.text}}>
        <View className="flex-row justify-between items-center px-4 pt-14 pb-3">
          <Text style={[typography.medium, {color: colors.white}]} className="text-base">
            Podgląd paragonu
          </Text>
          <TouchableOpacity onPress={onClose} hitSlop={12}>
            <Ionicons name="close" size={26} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View className="flex-1 mx-4 rounded-2xl overflow-hidden">
          <Image
            source={{uri}}
            className="flex-1"
            resizeMode="contain"
          />
        </View>

        <View className="flex-row gap-3 p-4 pb-10">
          <TouchableOpacity
            onPress={onRetake}
            activeOpacity={0.7}
            className="flex-1 flex-row items-center justify-center gap-2 py-4 rounded-2xl border"
            style={{borderColor: colors.white}}>
            <Ionicons name="refresh-outline" size={20} color={colors.white} />
            <Text style={[typography.medium, {color: colors.white}]} className="text-sm">
              Ponów
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onConfirm}
            activeOpacity={0.7}
            className="flex-1 flex-row items-center justify-center gap-2 py-4 rounded-2xl"
            style={{backgroundColor: colors.primary}}>
            <Ionicons name="scan-outline" size={20} color={colors.white} />
            <Text style={[typography.medium, {color: colors.white}]} className="text-sm">
              Skanuj
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
