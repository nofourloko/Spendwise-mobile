import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import AuthLayout from './AuthLayout';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import {useRegisterMutation} from '../../services/api/authApi';
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirm,
} from '../../utils/validation';
import {getApiErrorMessage} from '../../utils/apiError';

type Props = {
  onSwitchToLogin: () => void;
};

type Errors = {
  name?: string | null;
  email?: string | null;
  password?: string | null;
  confirm?: string | null;
};

export default function RegisterScreen({onSwitchToLogin}: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const [register, {isLoading, error}] = useRegisterMutation();

  const handleSubmit = async () => {
    const nextErrors: Errors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: validatePasswordConfirm(password, confirm),
    };
    setErrors(nextErrors);

    if (
      nextErrors.name ||
      nextErrors.email ||
      nextErrors.password ||
      nextErrors.confirm
    ) {
      return;
    }

    await register({name: name.trim(), email: email.trim(), password})
      .unwrap()
      .catch(() => {});
  };

  return (
    <AuthLayout
      title="Utwórz konto"
      subtitle="Zacznij kontrolować swoje finanse już dziś">
      <View className="gap-4">
        <TextField
          label="Imię i nazwisko"
          value={name}
          onChangeText={setName}
          placeholder="Jan Kowalski"
          icon="person-outline"
          autoCapitalize="words"
          autoComplete="name"
          error={errors.name}
        />

        <TextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="twoj@email.com"
          icon="mail-outline"
          keyboardType="email-address"
          autoComplete="email"
          error={errors.email}
        />

        <TextField
          label="Hasło"
          value={password}
          onChangeText={setPassword}
          placeholder="Min. 8 znaków"
          icon="lock-closed-outline"
          secureTextEntry
          autoComplete="password-new"
          error={errors.password}
        />

        <TextField
          label="Powtórz hasło"
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Powtórz hasło"
          icon="lock-closed-outline"
          secureTextEntry
          autoComplete="password-new"
          error={errors.confirm}
        />

        {error && (
          <Text
            style={[typography.regular, {color: colors.danger}]}
            className="text-sm text-center">
            {getApiErrorMessage(error)}
          </Text>
        )}

        <Button
          text="Zarejestruj się"
          variant="primary"
          icon="person-add-outline"
          loading={isLoading}
          onPress={handleSubmit}
        />

        <View className="flex-row items-center justify-center gap-1">
          <Text
            style={[typography.regular, {color: colors.textMuted}]}
            className="text-sm">
            Masz już konto?
          </Text>
          <TouchableOpacity onPress={onSwitchToLogin} hitSlop={8}>
            <Text
              style={[typography.medium, {color: colors.primary}]}
              className="text-sm">
              Zaloguj się
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
}
