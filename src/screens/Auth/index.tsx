import React, {useState} from 'react';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

type Mode = 'login' | 'register';

/**
 * Unauthenticated flow. Login and register are mutually exclusive, so a simple
 * local toggle keeps things dependency-free (no extra stack navigator needed)
 * while the root navigator decides when this flow is shown at all.
 */
export default function AuthNavigator() {
  const [mode, setMode] = useState<Mode>('login');

  if (mode === 'register') {
    return <RegisterScreen onSwitchToLogin={() => setMode('login')} />;
  }

  return <LoginScreen onSwitchToRegister={() => setMode('register')} />;
}
