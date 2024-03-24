import { CategoryViewHorizontal } from '@/components/EventCategory';
import { Championship, EventTeam, Location, Sport } from '@/src/api/model';
import { useGetTeamById } from '@/src/api/ticketerie';
import { Favorites } from '@/src/favs/store';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useGlobalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, List, useTheme } from 'react-native-paper';

export default function Page() {
	const local = useGlobalSearchParams();
	const colors = useTheme().colors;
	const router = useRouter();
	const [favorite, setFavorite] = useState(false);
	let id: number;
	if (!local.id || typeof local.id !== 'string') {
		router.back();
		return null;
	}
	id = Number(local.id);

	useEffect(() => {
		Favorites.Team.Is(id).then((is) => setFavorite(is));
	});

	const resp = useGetTeamById(id.toString());
	if (!resp.data) {
		return null;
	}

	const team = resp.data;
	return (
		<View
			style={{
				flex: 1,
				backgroundColor: colors.background,
			}}>
			<Appbar.Header className="">
				<Appbar.BackAction
					onPress={() => {
						router.back();
					}}
				/>
				<Appbar.Content title={team.name} />

				<Appbar.Action
					icon={favorite ? 'heart' : 'heart-outline'}
					onPress={() => {
						if (favorite) {
							Favorites.Team.Remove(id);
							setFavorite(false);
						} else {
							Favorites.Team.Set(id);
							setFavorite(true);
						}
					}}
					iconColor={colors.primary}
				/>
			</Appbar.Header>

			<ScrollView>
				<View className="px-3">
					<View className="w-full  h-32 px-20 mb-6">
						<View className=" w-full h-32 flex justify-center text-center items-center">
							<Image contentFit="contain" source={team.icon} className="w-full h-full"></Image>
						</View>
					</View>
				</View>
				<InfoSection location={team.location} sport={team.sport} championships={team.championships} />
				<UpComingEventsSection events={[...team.awayEvents, ...team.homeEvents]} locationID={team.locationId} />
			</ScrollView>
		</View>
	);
}

function InfoSection({ championships, sport, location }: { championships: Championship[]; sport: Sport; location: Location }) {
	const colors = useTheme().colors;
	return (
		<List.Section>
			<List.Subheader>Informations</List.Subheader>
			<List.Item
				titleStyle={{ fontSize: 14 }}
				title={sport.name}
				className="pl-2"
				left={(props) => <List.Icon {...props} color={colors.primary} icon="trophy" />}
			/>
			<List.Item
				titleStyle={{ fontSize: 14 }}
				title={location.name}
				className="pl-2"
				left={(props) => <List.Icon {...props} color={colors.primary} icon="map" />}
			/>
			<List.Subheader>Championnats</List.Subheader>
			{championships.map((championship) => (
				<List.Item
					key={championship.id}
					titleStyle={{ fontSize: 14 }}
					title={championship.name}
					className="pl-2"
					left={(props) => <Image contentFit="contain" {...props} source={championship.icon} className=" h-6 w-6 "></Image>}
				/>
			))}
		</List.Section>
	);
}

function UpComingEventsSection({ locationID, events }: { events: EventTeam[]; locationID: number }) {
	if (events.length === 0) {
		return null;
	}
	return (
		<CategoryViewHorizontal
			category={{
				Description: 'Evenements à venir',
				Name: 'Evenements',
				Events: events.map((event) => {
					return {
						description: event.eventDate,
						icon: event.locationId == locationID ? event.awayTeam.icon : event.homeTeam.icon,
						championship: event.championship.name,
						team: event.homeTeam.name,
						date: event.eventDate,
						location: event.location.name,
						min_price: event.tickets.reduce((acc, ticket) => Math.min(acc, ticket.price), Infinity),
						sport: event.sport.name,
						type: 'Team',
						id: event.id,
						name: event.sport.name,
					};
				}),
			}}
		/>
	);
}
