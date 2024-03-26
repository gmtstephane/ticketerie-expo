import { User } from '@/src/api/model';
import { Auth } from '@/src/auth/auth';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Appbar, Button, Text, useTheme } from 'react-native-paper';

export default function Profile() {
	const colors = useTheme().colors;
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	useEffect(() => {
		Auth.User.Get().then((u) => setUser(u));
	}, []);
	return (
		<View className="h-full w-full flex justify-between " style={{ backgroundColor: colors.background }}>
			<View>
				<Appbar.Header className=" ">
					<Appbar.BackAction
						onPress={() => {
							router.back();
						}}
					/>
					<Appbar.Content title={'Profil'} />
				</Appbar.Header>
				<View className="pt-10">
					<View className="px-3">
						<View className="w-full  h-32 px-20 mb-6 flex items-center">
							<View className=" aspect-square h-32 flex justify-center text-center items-center rounded-full">
								<Image contentFit="cover" source={user?.picture} className="w-full h-full rounded-full"></Image>
								<Text className="mt-5" variant="headlineSmall">
									{user?.givenName}
								</Text>
							</View>
						</View>
					</View>
				</View>
			</View>
			<View className="mb-16">
				<Button
					onPress={() => {
						Auth.Logout()
							.then(() => {
								router.push({ pathname: '/login' });
							})
							.catch((e) => {
								console.error(e);
							});
					}}>
					Logout
				</Button>
			</View>
		</View>
	);
}
