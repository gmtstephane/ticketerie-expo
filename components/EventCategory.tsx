import { EventDescription } from '@/src/api/model';
import { Pressable, RefreshControl, ScrollView, View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { EventCard } from './EventCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface CategoryBuilder {
	Name: string;
	Description: string;
	Events: EventDescription[];
	Condition: (event: EventDescription) => boolean;
}

export interface Category {
	Name: string;
	Description: string;
	Events: EventDescription[];
}

export function CategoryViewHorizontal({ category, onPress }: { category: Category; onPress?: () => void }) {
	const colors = useTheme().colors;
	return (
		<View>
			<Pressable
				onPress={() => {
					if (onPress) {
						onPress();
					}
				}}>
				<Card.Title
					right={(props) =>
						onPress ? (
							<MaterialCommunityIcons name="chevron-right" {...props} className="pr-4" color={colors.primary} size={24} />
						) : null
					}
					titleVariant="titleLarge"
					title={category.Name}
					subtitle={category.Description}
					className="pr-4"
				/>
			</Pressable>

			<ScrollView horizontal className="py-3" showsHorizontalScrollIndicator={false}>
				{category.Events.map((event: EventDescription) => (
					<View className="max-w-xs h-[180px] p-2" key={event.id + 'Container'}>
						<EventCard event={event} key={event.id} />
					</View>
				))}
			</ScrollView>
		</View>
	);
}

export function CategoryViewVertical({ category, onRefresh }: { category: Category; onRefresh?: () => void }) {
	return (
		<View className="flex items-center h-full">
			{/* <Card.Title titleVariant="titleLarge" title={category.Name} subtitle={category.Description} className="" /> */}
			<ScrollView className="py-3" showsHorizontalScrollIndicator={false}>
				{category.Events.map((event: EventDescription) => (
					<View className="max-w-xs h-[180px] p-2" key={event.id + 'Container'}>
						<EventCard event={event} key={event.id} />
					</View>
				))}
			</ScrollView>
		</View>
	);
}
