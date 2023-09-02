import localforage from 'localforage';

export const setItem = async <T>(key: string, value: T): Promise<T> => {
	if (typeof value === 'string') {
		await localforage.setItem(key, value);
	} else {
		await localforage.setItem(key, 'JSON::' + JSON.stringify(value));
	}
	return value;
};

export const getItem = async <T>(key: string): Promise<T | string | null> => {
	const value = await localforage.getItem<string>(key);
	if (!value) return null;

	if (value.startsWith('JSON::')) {
		try {
			return JSON.parse(value.substring(6)) as T;
		} catch (e) {
			console.error(`Error parsing JSON for key "${key}" with value: "${value}"`, e);
			return null;
		}
	} else {
		return value;
	}
};

export const removeItem = async (key: string): Promise<void> => {
	await localforage.removeItem(key);
};
