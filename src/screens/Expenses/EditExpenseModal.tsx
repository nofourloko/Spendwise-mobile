import React, {useEffect, useState} from 'react';
import {Modal, View, Text, TouchableOpacity, Pressable, Alert, ScrollView} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import CategorySelect from '../AddExpense/CategorySelect';
import {Category} from '../../types/category';
import {ExpenseInDb} from '../../types/expense';
import {
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} from '../../services/api/expensesApi';
import {
  validateAmount,
  validateCategory,
  validateExpenseDate,
} from '../../utils/validation';
import {getApiErrorMessage} from '../../utils/apiError';

type Errors = {
  amount?: string | null;
  category_id?: string | null;
  expense_date?: string | null;
};

type Props = {
  /** The expense being edited, or null when the modal is closed. */
  expense: ExpenseInDb | null;
  categories: Category[];
  categoriesLoading?: boolean;
  onClose: () => void;
};

/**
 * Bottom-sheet form to edit or delete a single expense. Prefilled from the
 * tapped row; saving patches via `updateExpense` and deleting (with a confirm)
 * via `deleteExpense`. Both endpoints invalidate the list so it refreshes.
 */
export default function EditExpenseModal({
  expense,
  categories,
  categoriesLoading = false,
  onClose,
}: Props) {
  const [updateExpense, {isLoading: isSaving, error: saveError}] =
    useUpdateExpenseMutation();
  const [deleteExpense, {isLoading: isDeleting}] = useDeleteExpenseMutation();

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  // Seed the form whenever a new expense is opened.
  useEffect(() => {
    if (expense) {
      setAmount(String(Number(expense.amount) || 0));
      setCategoryId(expense.category_id);
      setDescription(expense.description ?? '');
      setExpenseDate((expense.expense_date ?? '').slice(0, 10));
      setErrors({});
    }
  }, [expense]);

  const handleSave = async () => {
    if (!expense) {
      return;
    }

    const nextErrors: Errors = {
      amount: validateAmount(amount),
      category_id: validateCategory(categoryId),
      expense_date: validateExpenseDate(expenseDate),
    };
    setErrors(nextErrors);
    if (nextErrors.amount || nextErrors.category_id || nextErrors.expense_date) {
      return;
    }

    try {
      await updateExpense({
        id: expense.id,
        body: {
          category_id: categoryId,
          amount: Number(amount.trim().replace(',', '.')),
          description: description.trim() || undefined,
          expense_date: expenseDate.trim(),
        },
      }).unwrap();
      onClose();
    } catch {
      // Surfaced via `saveError` below.
    }
  };

  const handleDelete = () => {
    if (!expense) {
      return;
    }
    Alert.alert(
      'Usuń wydatek',
      'Czy na pewno chcesz usunąć ten wydatek? Tej operacji nie można cofnąć.',
      [
        {text: 'Anuluj', style: 'cancel'},
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expense.id).unwrap();
              onClose();
            } catch {
              Alert.alert('Błąd', 'Nie udało się usunąć wydatku. Spróbuj ponownie.');
            }
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={expense !== null}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/40" onPress={onClose}>
        <Pressable
          className="rounded-t-3xl p-5 gap-4"
          style={{backgroundColor: colors.white}}
          onPress={() => {}}>
          <View className="flex-row justify-between items-center">
            <Text style={[typography.medium, {color: colors.text}]} className="text-lg">
              Edytuj wydatek
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={12} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="gap-4">
            <TextField
              label="Kwota"
              value={amount}
              onChangeText={setAmount}
              placeholder="0,00"
              icon="cash-outline"
              keyboardType="decimal-pad"
              error={errors.amount}
            />

            <CategorySelect
              label="Kategoria"
              categories={categories}
              selectedId={categoryId}
              onSelect={setCategoryId}
              loading={categoriesLoading}
              error={errors.category_id}
            />

            <TextField
              label="Opis (opcjonalnie)"
              value={description}
              onChangeText={setDescription}
              placeholder="np. Zakupy spożywcze"
              icon="document-text-outline"
              autoCapitalize="sentences"
            />

            <TextField
              label="Data"
              value={expenseDate}
              onChangeText={setExpenseDate}
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

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Button
                  text="Usuń"
                  variant="outline"
                  icon="trash-outline"
                  loading={isDeleting}
                  onPress={handleDelete}
                />
              </View>
              <View className="flex-1">
                <Button
                  text="Zapisz"
                  variant="primary"
                  icon="checkmark-circle-outline"
                  loading={isSaving}
                  onPress={handleSave}
                />
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
