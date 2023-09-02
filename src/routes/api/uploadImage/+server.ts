import { writeFileSync } from 'fs';

export const POST = async ({ request }: { request: Request }) => {
	const { data } = await request.json();

	console.log(data);

	const file = data['image'];
	const filename = 'upload/' + generateRandomHash() + '.png';

	writeFileSync(`static/${filename}`, file, 'base64');

	return new Response(JSON.stringify({ bones: 'money', filename }));
};

function generateRandomHash() {
	return Array(32)
		.join()
		.split(',')
		.map(function () {
			return (~~(Math.random() * 36)).toString(36);
		})
		.join('');
}
