import { writeFileSync } from 'fs';
import { generateRandomHash } from '$lib/utils';

export const POST = async ({ request }: { request: Request }) => {
	const { data } = await request.json();

	console.log(data);

	const file = data['image'];
	const filename = 'upload/' + generateRandomHash() + '.png';

	writeFileSync(`static/${filename}`, file, 'base64');

	return new Response(JSON.stringify({ bones: 'money', filename }));
};
