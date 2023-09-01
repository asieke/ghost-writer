import { PUBLIC_OPEN_AI_KEY } from '$env/static/public';

/**
 * Makes a POST request to the OpenAI API to initiate a chat completion.
 *
 * @param {Object} params - Parameters to control the API call.
 * @param {string} params.context - Initial context for the API chat session.
 * @param {string} params.content - Initial content/message from the user.
 * @param {string} [params.MODEL='gpt-4'] - The model to use for the completion.
 * @returns {Promise<Response>} The fetch response.
 */
export const getStream = async ({ context = '', content = '', MODEL = 'gpt-4' }) => {
	console.log('SENDING TO OPENAI~~~~~~~~');
	console.log('context: ', context);
	console.log('content: ', content);

	const messages = [
		{ role: 'system', content: context },
		{ role: 'user', content: content }
	];

	return await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${PUBLIC_OPEN_AI_KEY}`
		},
		body: JSON.stringify({
			model: MODEL,
			stream: true,
			messages: messages
		})
	});
};

interface ConsumeStringProps {
	callback: (s: string) => void;
	response: Response;
}

/**
 * Consumes the provided response stream and invokes a callback with the received string.
 *
 * @param {Object} params - Parameters to control the stream consumption.
 * @param {(s: string) => void} params.callback - Callback function to handle each string chunk.
 * @param {Response} params.response - The response object with a readable stream.
 */
export const consumeString = async ({ callback, response }: ConsumeStringProps) => {
	try {
		if (!response.body) {
			throw new Error('ReadableStream not yet supported in this browser.');
		}
		const reader = response.body.getReader();
		let chunk = await reader.read();
		while (!chunk.done) {
			callback(chunkValueToString(chunk.value));
			chunk = await reader.read();
		}
	} catch (error) {
		console.error('Error reading Streamable: ', error);
	}
};

/**
 * Converts a chunk value into a string.
 *
 * @param {Uint8Array | undefined} value - The chunk value to be converted.
 * @returns {string} The resulting string.
 */
export const chunkValueToString = (value: Uint8Array | undefined) => {
	const temp = [];
	const result = new TextDecoder()
		.decode(value)
		.trim()
		.split('\n')
		.map((line) => parseJSON(line.replace('data: ', '')));
	for (let i = 0; i < result.length; i++) {
		const json = result[i];
		if (json && json.choices[0]?.delta?.content) {
			const chunk = json.choices[0].delta.content;
			temp.push(chunk);
		}
	}
	return temp.join('');
};

/**
 * Attempts to parse a string into a JSON object.
 *
 * @param {string} str - The string to be parsed.
 * @returns {Object | null} The resulting JSON object or null if parsing failed.
 */
export const parseJSON = (str: string) => {
	try {
		const json = JSON.parse(str);
		return json;
	} catch (e) {
		return null;
	}
};
