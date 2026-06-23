import React from 'react';
import {ScrollView, View, ActivityIndicator} from 'react-native';
import colors from '../../assets/colors';
import {useAppSelector} from '../../redux/hooks';
import {useGetUserByIdQuery} from '../../services/api/usersApi';
import {useLogoutMutation} from '../../services/api/authApi';
import Button from '../../components/Button';
import ProfileHeader from './ProfileHeader';
import Settings from './Settings';

export default function Profile() {
  const userId = useAppSelector(state => state.auth.user?.id);
  const {data: user, isLoading} = useGetUserByIdQuery(userId!, {skip: !userId});
  const [logout, {isLoading: isLoggingOut}] = useLogoutMutation();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const [firstName = '', ...rest] = (user?.name ?? '').split(' ');
  const surname = rest.join(' ');

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-6 p-4"
      showsVerticalScrollIndicator={false}>
      <ProfileHeader
        name={firstName}
        surname={surname}
        email={user?.email ?? ''}
      />
      <Settings />
      <Button loading={isLoggingOut} onPress={() => logout()} />
    </ScrollView>
  );
}
