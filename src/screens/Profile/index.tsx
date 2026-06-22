import React from 'react';
import {ScrollView, View, ActivityIndicator} from 'react-native';
import colors from '../../assets/colors';
import {useGetUserByIdQuery} from '../../services/api/usersApi';
import ProfileHeader from './ProfileHeader';
import Settings from './Settings';

export default function Profile() {
  const userId = 'b1000000-0000-0000-0000-000000000001';
  const {data: user, isLoading} = useGetUserByIdQuery(userId);

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
    </ScrollView>
  );
}
