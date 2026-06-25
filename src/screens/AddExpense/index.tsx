import React, {useState} from 'react';
import {View, Text, ScrollView, Alert} from 'react-native';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import CategorySelect from './CategorySelect';
import OcrScanButton from './OcrScanButton';
import ImageSourcePicker from './ImageSourcePicker';
import ImagePreview from './ImagePreview';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import {useAppSelector} from '../../redux/hooks';
import {useGetCategoriesQuery} from '../../services/api/categoriesApi';
import {
  useCreateExpenseMutation,
  useScanReceiptMutation,
} from '../../services/api/expensesApi';
import useImagePicker, {type CapturedImage} from '../../hooks/useImagePicker';
import type {ExpenseFormValues, ExpenseSource} from '../../types/expense';
import type {OcrScanResult} from '../../types/ocr';
import {toExpenseDraft, todayIso} from '../../utils/ocr';
import {
  validateAmount,
  validateCategory,
  validateExpenseDate,
} from '../../utils/validation';
import {getApiErrorMessage} from '../../utils/apiError';

type Errors = Partial<Record<keyof ExpenseFormValues, string | null>>;

const EMPTY_FORM: ExpenseFormValues = {
  amount: '',
  category_id: '',
  description: '',
  expense_date: '',
};

export default function AddExpense() {
  const userId = useAppSelector(state => state.auth.user?.id);

  const {data: categories = [], isLoading: categoriesLoading} =
    useGetCategoriesQuery();
  const [createExpense, {isLoading: isSaving, error: saveError}] =
    useCreateExpenseMutation();
  const [scanReceipt, {isLoading: isScanning}] = useScanReceiptMutation();
  const {pickFromCamera, pickFromGallery} = useImagePicker();

  const [values, setValues] = useState<ExpenseFormValues>({
    ...EMPTY_FORM,
    expense_date: todayIso(),
  });
  const [source, setSource] = useState<ExpenseSource>('manual');
  const [errors, setErrors] = useState<Errors>({});
  const [saved, setSaved] = useState(false);

  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);

  const setField = <K extends keyof ExpenseFormValues>(key: K, value: string) => {
    setValues(prev => ({...prev, [key]: value}));
    setSaved(false);
  };

  const applyOcrResult = (result: OcrScanResult) => {
    setValues(prev => ({...prev, ...toExpenseDraft(result)}));
    setSource('ocr');
    setErrors({});
    setSaved(false);
  };

  const handleImageCaptured = (image: CapturedImage | null) => {
    setShowSourcePicker(false);
    if (image) {
      setCapturedImage(image);
    }
  };

  const handleCamera = async () => {
    const image = await pickFromCamera();
    handleImageCaptured(image);
  };

  const handleGallery = async () => {
    const image = await pickFromGallery();
    handleImageCaptured(image);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowSourcePicker(true);
  };

  const handleConfirmScan = async () => {
    if (!capturedImage) {
      return;
    }

    setCapturedImage(null);

    try {
      const result = await scanReceipt(capturedImage.request).unwrap();
      applyOcrResult(result);
    } catch {
      Alert.alert('Skaner paragonów', 'Nie udało się odczytać paragonu. Spróbuj ponownie lub wpisz dane ręcznie.');
    }
  };

  const handleSubmit = async () => {
    if (!userId) {
      return;
    }

    const nextErrors: Errors = {
      amount: validateAmount(values.amount),
      category_id: validateCategory(values.category_id),
      expense_date: validateExpenseDate(values.expense_date),
    };
    setErrors(nextErrors);

    if (nextErrors.amount || nextErrors.category_id || nextErrors.expense_date) {
      return;
    }

    try {
      await createExpense({
        user_id: userId,
        category_id: values.category_id,
        amount: Number(values.amount.trim().replace(',', '.')),
        description: values.description.trim() || undefined,
        expense_date: values.expense_date.trim(),
        source,
      }).unwrap();

      setValues({...EMPTY_FORM, expense_date: todayIso()});
      setSource('manual');
      setErrors({});
      setSaved(true);
    } catch {
      // Surfaced via `saveError` below.
    }
  };

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 p-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="gap-1">
          <Text style={[typography.medium, {color: colors.text}]} className="text-xl">
            Nowy wydatek
          </Text>
          <Text
            style={[typography.regular, {color: colors.textMuted}]}
            className="text-sm">
            Dodaj wydatek ręcznie lub zeskanuj paragon
          </Text>
        </View>

        <OcrScanButton
          onPress={() => setShowSourcePicker(true)}
          loading={isScanning}
        />

        <View className="flex-row items-center gap-3">
          <View className="flex-1 border-t border-gray-100" />
          <Text
            style={[typography.regular, {color: colors.textMuted}]}
            className="text-xs">
            lub wpisz ręcznie
          </Text>
          <View className="flex-1 border-t border-gray-100" />
        </View>

        <View className="gap-4">
          <TextField
            label="Kwota"
            value={values.amount}
            onChangeText={text => setField('amount', text)}
            placeholder="0,00"
            icon="cash-outline"
            keyboardType="decimal-pad"
            error={errors.amount}
          />

          <CategorySelect
            label="Kategoria"
            categories={categories}
            selectedId={values.category_id}
            onSelect={id => setField('category_id', id)}
            loading={categoriesLoading}
            error={errors.category_id}
          />

          <TextField
            label="Opis (opcjonalnie)"
            value={values.description}
            onChangeText={text => setField('description', text)}
            placeholder="np. Zakupy spożywcze"
            icon="document-text-outline"
            autoCapitalize="sentences"
          />

          <TextField
            label="Data"
            value={values.expense_date}
            onChangeText={text => setField('expense_date', text)}
            placeholder="RRRR-MM-DD"
            icon="calendar-outline"
            error={errors.expense_date}
          />

          {saveError && (
            <Text
              style={[typography.regular, {color: colors.danger}]}
              className="text-sm text-center">
              {getApiErrorMessage(saveError)}
            </Text>
          )}

          {saved && (
            <Text
              style={[typography.medium, {color: colors.primary}]}
              className="text-sm text-center">
              Wydatek został zapisany
            </Text>
          )}

          <Button
            text="Zapisz wydatek"
            variant="primary"
            icon="checkmark-circle-outline"
            loading={isSaving}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>

      <ImageSourcePicker
        visible={showSourcePicker}
        onCamera={handleCamera}
        onGallery={handleGallery}
        onClose={() => setShowSourcePicker(false)}
      />

      {capturedImage && (
        <ImagePreview
          visible
          uri={capturedImage.uri}
          onConfirm={handleConfirmScan}
          onRetake={handleRetake}
          onClose={() => setCapturedImage(null)}
        />
      )}
    </>
  );
}
