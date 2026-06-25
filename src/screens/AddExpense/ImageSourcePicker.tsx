import React from 'react';
import {Modal, View, Text, TouchableOpacity, Pressable} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {IoniconsName} from '../../assets/icons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';

type Props = {
  visible: boolean;
  onCamera: () => void;
  onGallery: () => void;
  onClose: () => void;
};

type OptionProps = {
  icon: IoniconsName;
  label: string;
  subtitle: string;
  onPress: () => void;
};

function SourceOption({icon, label, subtitle, onPress}: OptionProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-3 p-4 rounded-2xl"
      style={{backgroundColor: colors.cardBackground}}>
      <View
        className="w-11 h-11 rounded-full items-center justify-center"
        style={{backgroundColor: colors.primary}}>
        <Ionicons name={icon} size={22} color={colors.white} />
      </View>
      <View className="flex-1">
        <Text style={[typography.medium, {color: colors.text}]} className="text-sm">
          {label}
        </Text>
        <Text style={[typography.regular, {color: colors.textMuted}]} className="text-xs">
          {subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function ImageSourcePicker({
  visible,
  onCamera,
  onGallery,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable
          className="rounded-t-3xl p-5 gap-3"
          style={{backgroundColor: colors.white}}
          onPress={() => {}}>
          <View className="w-10 h-1 rounded-full self-center mb-2" style={{backgroundColor: colors.neutral}} />

          <Text style={[typography.medium, {color: colors.text}]} className="text-base mb-1">
            Wybierz źródło zdjęcia
          </Text>

          <SourceOption
            icon="camera-outline"
            label="Zrób zdjęcie"
            subtitle="Użyj aparatu, aby sfotografować paragon"
            onPress={onCamera}
          />

          <SourceOption
            icon="images-outline"
            label="Wybierz z galerii"
            subtitle="Wybierz istniejące zdjęcie paragonu"
            onPress={onGallery}
          />

          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.7}
            className="items-center py-3 mt-1">
            <Text style={[typography.medium, {color: colors.textMuted}]} className="text-sm">
              Anuluj
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
