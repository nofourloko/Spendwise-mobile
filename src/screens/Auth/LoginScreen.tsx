import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import AuthLayout from './AuthLayout';
import typography from '../../assets/typography';
import colors from '../../assets/colors';
import {useLoginMutation} from '../../services/api/authApi';
import {validateEmail, validatePassword} from '../../utils/validation';
import {getApiErrorMessage} from '../../utils/apiError';

type Props = {
  onSwitchToRegister: () => void;
};

type Errors = {
  email?: string | null;
  password?: string | null;
};

export default function LoginScreen({onSwitchToRegister}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const [login, {isLoading, error}] = useLoginMutation();

  const handleSubmit = async () => {
    const nextErrors: Errors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    // Navigation switches automatically once the auth status becomes
    // `authenticated`; on failure we surface the server error below.
    await login({email: email.trim(), password}).unwrap().catch(() => {});
  };

  return (
    <AuthLayout
      title="Witaj ponownie"
      subtitle="Zaloguj się, aby zarządzać swoimi wydatkami">
      <View className="gap-4">
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
          placeholder="Twoje hasło"
          icon="lock-closed-outline"
          secureTextEntry
          autoComplete="password"
          error={errors.password}
        />

        {error && (
          <Text
            style={[typography.regular, {color: colors.danger}]}
            className="text-sm text-center">
            {getApiErrorMessage(error)}
          </Text>
        )}

        <Button
          text="Zaloguj się"
          variant="primary"
          icon="log-in-outline"
          loading={isLoading}
          onPress={handleSubmit}
        />

        <View className="flex-row items-center justify-center gap-1">
          <Text
            style={[typography.regular, {color: colors.textMuted}]}
            className="text-sm">
            Nie masz konta?
          </Text>
          <TouchableOpacity onPress={onSwitchToRegister} hitSlop={8}>
            <Text
              style={[typography.medium, {color: colors.primary}]}
              className="text-sm">
              Zarejestruj się
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
}
