import { EventCard } from '@/components/EventCard';
import { CategoryViewVertical } from '@/components/EventCategory';
import { EventDescription } from '@/src/api/model';
import { useGetEvents } from '@/src/api/ticketerie';
import { Favorites } from '@/src/favs/store';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';

export default function FavPage() {
	const router = useRouter();
	const theme = useTheme();
	const [favorites, setFavorites] = useState<string[]>([]);

	useEffect(() => {
		Favorites.Events.List().then((favs) => {
			console.log(favs);
			setFavorites(favs);
		});
	}, []);

	const resp = useGetEvents({ id: favorites }, { query: { enabled: favorites.length > 0 } });
	if (resp.isError) {
		return null;
	}

	function refetch() {
		Favorites.Events.List().then((favs) => {
			setFavorites(favs);
			resp.refetch();
		});
	}
	return (
		<View>
			<Appbar.Header className="">
				<Appbar.BackAction
					onPress={() => {
						router.back();
					}}
				/>
				<Appbar.Content title={'Favoris'} />
			</Appbar.Header>

			{resp.data && (
				<View className="flex items-center h-full">
					<ScrollView
						refreshControl={
							<RefreshControl
								colors={[theme.colors.primary]}
								progressBackgroundColor={theme.colors.background}
								onRefresh={refetch}
								refreshing={resp.isFetching}
							/>
						}
						className="py-3"
						showsHorizontalScrollIndicator={false}>
						{resp.data.map((event: EventDescription) => (
							<View className="max-w-xs h-[180px] p-2" key={event.id + 'Container'}>
								<EventCard event={event} key={event.id} />
							</View>
						))}
					</ScrollView>
				</View>
			)}
		</View>
	);
}
