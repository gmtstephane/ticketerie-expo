import { EventDescription } from '@/src/api/model';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { Pressable, View, useColorScheme } from 'react-native';
import { Card, Chip, List, MD3Colors, Text, useTheme } from 'react-native-paper';

interface EventCardProps extends React.ComponentProps<typeof View> {
	event: EventDescription;
}

export function EventCard({ event }: EventCardProps) {
	if (!event) {
		return null;
	}
	const colorScheme = useColorScheme();
	const theme = useTheme();
	const router = useRouter();
	let Title = event.name;
	let Subtitle = event.championship;

	//if player vs player, split the name with vs and set Title to the first part and Subtitle to the second part
	if (event.type == 'Individual' && event.name.includes('vs')) {
		const split = event.name.split('vs');
		Title = split[0].trim();
		Subtitle = split[1].trim();
	}

	return (
		<View>
			<Pressable
				onPress={() => {
					if (router.canDismiss()) router.dismissAll();
					setTimeout(() => {
						router.push({
							pathname: '/events/',
							params: {
								id: event.id,
							},
						});
					}, 0);
				}}>
				<Card
					mode={'contained'}
					style={{
						marginTop: 3,
						backgroundColor: theme.colors.elevation.level2,
					}}
					className={'w-full h-full   -z-10 flex flex-col'}>
					<Card.Title
						title={Title}
						subtitle={Subtitle}
						className="absolute"
						left={(props) => (
							<Image
								contentFit="contain"
								style={{ width: '100%', height: '100%' }}
								{...props}
								source={event.icon}
								className="w-full h-full"></Image>
						)}
						// right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
					/>
					<Card.Content className="">
						<View className="w-full  flex-row  h-full flex items-end justify-end">
							<View className="flex-grow ">
								<List.Item
									titleStyle={{ fontSize: 14 }}
									className="p-0"
									title={event.location}
									left={({ color }) => <List.Icon color={color} icon="pin" />}
								/>

								<List.Item
									titleStyle={{ fontSize: 14 }}
									title={frenchDate(event.date)}
									left={({ color }) => <List.Icon color={color} icon="calendar" />}
								/>
							</View>
							<View className=" flex  justify-end pb-3">
								<Chip style={{ backgroundColor: theme.colors.background }}>
									<Text>{event.min_price}€</Text>
								</Chip>
							</View>
						</View>
					</Card.Content>
				</Card>
			</Pressable>
		</View>
	);
}

export function frenchDate(date: string): string {
	const dateObject = new Date(date);
	return dateObject.toLocaleDateString('fr-FR', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}
