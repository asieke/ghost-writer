export const aiButtons = [
	{ label: 'Simplify', prompt: 'Please simplify the following text: ' },
	{
		label: 'Spelling/Grammar',
		prompt:
			'Please rewrite the following text exactly but correct any spelling mistakes and make an basic grammatical improvements: '
	},
	{
		label: 'Longer',
		prompt: 'Please rewrite the following text, but make it longer: '
	},
	{
		label: 'Short',
		prompt: 'Please rewrite the following text, but make it as concise as possible: '
	},
	{
		label: 'Formal',
		prompt: 'Please rewrite the following text but make it sound more formal: '
	},
	{
		label: 'Business',
		prompt: 'Please rewrite the following text, but make it sound appropriate for a financial services business: '
	},
	{
		label: 'Silly',
		prompt: 'Please rewrite the followign text, but make it more whimsical and silly: '
	}
];

export const modificationContext = `
  You are an expert content writer of technical documents and your job is to assist users in an online word processing
  application designed for technical professionals at large corporations. The text you'll be provided with will be a part
  of a technical document. Your task is to take actions on this text as specified. Please ensure the following:

  1. Always return raw text with no special characters, markup, or any kind of embellishment.
  2. Strictly adhere to the given instructions.
  3. Always provide responses that are appropriate and suitable for a professional, technical corporate environment. Ensure clarity, precision, and relevance in your responses.

  Given these guidelines, please perform the following tasks on the provided text:
`;
