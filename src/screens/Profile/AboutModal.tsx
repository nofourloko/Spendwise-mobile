import React from 'react';
import {Modal, View, Text, TouchableOpacity, Pressable, ScrollView} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import {IoniconsName} from '../../assets/icons';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const FEATURES: {icon: IoniconsName; text: string}[] = [
  {icon: 'scan-outline', text: 'Skanuj paragony (OCR) — kwota, kategoria i data uzupełniają się same'},
  {icon: 'create-outline', text: 'Dodawaj, edytuj i usuwaj wydatki, z filtrowaniem po kategorii i dacie'},
  {icon: 'wallet-outline', text: 'Ustawiaj budżet ogólny na miesiąc oraz limity dla kategorii'},
  {icon: 'pie-chart-outline', text: 'Śledź podział wydatków na wykresie i saldo na pulpicie'},
];

/**
 * "O aplikacji" bottom sheet: a short SpendWise description and the headline
 * features, opened from the settings list.
 */
export default function AboutModal({visible, onClose}: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable
          className="rounded-t-3xl p-5 gap-4"
          style={{backgroundColor: colors.white}}
          onPress={() => {}}>
          <View className="flex-row justify-between items-center">
            <Text style={[typography.medium, {color: colors.text}]} className="text-lg">
              O aplikacji
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={12} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-4">
            <View className="items-center gap-2">
              <View
                className="w-16 h-16 rounded-2xl items-center justify-center"
                style={{backgroundColor: colors.cardBackground}}>
                <Ionicons name="wallet-outline" size={32} color={colors.primary} />
              </View>
              <Text style={[typography.medium, {color: colors.text}]} className="text-xl">
                SpendWise
              </Text>
              <Text style={[typography.regular, {color: colors.textMuted}]} className="text-xs">
                Wersja 0.0.1
              </Text>
            </View>

            <Text
              style={[typography.regular, {color: colors.text}]}
              className="text-sm leading-5 text-center">
              SpendWise to prosta aplikacja do śledzenia wydatków osobistych.
              Zapisuj wydatki ręcznie lub skanując paragon, panuj nad budżetem
              miesięcznym i zobacz, na co naprawdę idą Twoje pieniądze.
            </Text>

            <View className="gap-3">
              {FEATURES.map(feature => (
                <View key={feature.text} className="flex-row items-start gap-3">
                  <Ionicons name={feature.icon} size={20} color={colors.primary} />
                  <Text
                    style={[typography.regular, {color: colors.text}]}
                    className="text-sm flex-1 leading-5">
                    {feature.text}
                  </Text>
                </View>
              ))}
            </View>

            <Text
              style={[typography.regular, {color: colors.textMuted}]}
              className="text-xs text-center">
              Stworzone z myślą o świadomym zarządzaniu finansami.
            </Text>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
