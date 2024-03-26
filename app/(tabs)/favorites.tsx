import { EventCard } from '@/components/EventCard';
import { CategoryViewVertical } from '@/components/EventCategory';
import { EventDescription } from '@/src/api/model';
import { useGetEvents } from '@/src/api/ticketerie';
import { Favorites } from '@/src/favs/store';
import { useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';

export default function FavPage() {
	const router = useRouter();
	const theme = useTheme();
	const [favorites, setFavorites] = useState<string[]>([]);

	function checkChanges() {
		Favorites.Events.List().then((favs) => {
			if (favs.length !== favorites.length) {
				setFavorites(favs);
			}
		});
	}
	useEffect(() => {
		checkChanges();
		// watch every 5 seconds for changes, if the list is differents, refetch the data
		const interval = setInterval(() => {
			checkChanges();
		}, 5000);
		return () => clearInterval(interval);
	}, [favorites]);

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
		<View className="h-full w-full">
			<Appbar.Header className="">
				<Appbar.Content title={'Favoris'} />
			</Appbar.Header>

			{resp.data && (
				<View className="flex items-center h-full w-full justify-center">
					<ScrollView
						refreshControl={
							<RefreshControl
								colors={[theme.colors.primary]}
								progressBackgroundColor={theme.colors.background}
								onRefresh={refetch}
								refreshing={resp.isLoading}
							/>
						}
						className="h-full w-full "
						showsVerticalScrollIndicator={false}>
						<View className=" flex items-center justify-center">
							{resp.data.map((event: EventDescription) => (
								<View className="max-w-xs h-[180px] py-2 w-full" key={event.id + 'Container'}>
									<EventCard event={event} key={event.id} />
								</View>
							))}
						</View>
						<View className="h-80 w-full " />
					</ScrollView>
				</View>
			)}
		</View>
	);
}
