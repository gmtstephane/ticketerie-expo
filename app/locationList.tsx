import { Category, CategoryViewVertical } from '@/components/EventCategory';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';

export default function CategoryView() {
	const global = useGlobalSearchParams();
	const theme = useTheme();
	const router = useRouter();
	if (!global.category || typeof global.category !== 'string') {
		return <View className="h-full w-full" style={{ backgroundColor: theme.colors.background }} />;
	}

	const category: Category = JSON.parse(global.category);
	return (
		<View className="h-full w-full p-0" style={{ backgroundColor: theme.colors.background }}>
			<Text variant="headlineSmall" className="flex py-3 items-center justify-center text-center">
				{category.Name}
			</Text>
			<CategoryViewVertical category={category} />
		</View>
	);
}
