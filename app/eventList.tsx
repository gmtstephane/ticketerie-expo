import { Category, CategoryViewVertical } from '@/components/EventCategory';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';

export default function CategoryView() {
	const global = useGlobalSearchParams();
	const theme = useTheme();
	const router = useRouter();
	if (!global.category || typeof global.category !== 'string') return null;

	const category: Category = JSON.parse(global.category);
	return (
		<View className="h-full w-full" style={{ backgroundColor: theme.colors.background }}>
			<Appbar.Header className=" ">
				<Appbar.BackAction
					onPress={() => {
						router.back();
					}}
				/>
				<Appbar.Content title={category.Name} />
			</Appbar.Header>
			<CategoryViewVertical category={category} />
		</View>
	);
}
