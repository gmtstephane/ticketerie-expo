import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
	// baseURL: 'http://localhost:4321/',
	baseURL: 'https://clownfish-app-pqu24.ondigitalocean.app/',
}); // use your own URL here or environment variable
export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
	const source = Axios.CancelToken.source();

	// Wrap token retrieval and request in a new Promise
	return new Promise((resolve, reject) => {
		AsyncStorage.getItem('bearerToken')
			.then((token) => {
				// Setup the config with the token
				const finalConfig = {
					...config,
					headers: {
						...config.headers,
						Authorization: `Bearer ${token}`,
						Accept: 'application/json',
					},
					cancelToken: source.token,
					...options,
				};

				// Execute the Axios request with the final config
				AXIOS_INSTANCE(finalConfig)
					.then((response) => resolve(response.data))
					.catch((error) => reject(error));
			})
			.catch((error) => reject(error));

		// // Extend the promise with a cancel method
		// // @ts-ignore
		// promise.cancel = () => {
		// 	source.cancel('Query was cancelled');
		// };
	});
};
// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;

// // Or, in case you want to wrap the body type (optional)
// // (if the custom instance is processing data before sending it, like changing the case for example)
// export type BodyType<BodyData> = CamelCase<BodyData>;
