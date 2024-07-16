import { WEBUI_API_BASE_URL } from '$lib/constants';

export const refreshConfluences = async (token: string) => {
	let error = null;
	console.log("to refresh")
	const res = await fetch(`${WEBUI_API_BASE_URL}/confluences/refresh`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`
		}
	})
		.then(async (res) => {
			return res.json();
		})
		.then((json) => {
			return json;
		})
		.catch((err) => {
			error = err.detail;

			console.log(err);
			return null;
		});

	if (error) {
		throw error;
	}

	return res;
};
