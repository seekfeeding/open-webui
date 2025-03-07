import { DEEPSEEK_API_BASE_URL } from '$lib/constants';
import { promptTemplate } from '$lib/utils';

export const getDeepSeekConfig = async (token: string = '') => {
	let error = null;

	const res = await fetch(`${DEEPSEEK_API_BASE_URL}/config`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(token && { authorization: `Bearer ${token}` })
		}
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			console.log(err);
			if ('detail' in err) {
				error = err.detail;
			} else {
				error = 'Server connection failed';
			}
			return null;
		});

	if (error) {
		throw error;
	}

	return res;
};

export const updateDeepSeekConfig = async (token: string = '', enable_deepseek_api: boolean) => {
	let error = null;

	const res = await fetch(`${DEEPSEEK_API_BASE_URL}/config/update`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(token && { authorization: `Bearer ${token}` })
		},
		body: JSON.stringify({
			enable_deepseek_api: enable_deepseek_api
		})
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			console.log(err);
			if ('detail' in err) {
				error = err.detail;
			} else {
				error = 'Server connection failed';
			}
			return null;
		});

	if (error) {
		throw error;
	}

	return res;
};

export const getDeepSeekUrls = async (token: string = '') => {
	let error = null;

	const res = await fetch(`${DEEPSEEK_API_BASE_URL}/urls`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(token && { authorization: `Bearer ${token}` })
		}
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			console.log(err);
			if ('detail' in err) {
				error = err.detail;
			} else {
				error = 'Server connection failed';
			}
			return null;
		});

	if (error) {
		throw error;
	}

	return res.DeepSeek_API_BASE_URLS;
};

export const updateDeepSeekUrls = async (token: string = '', urls: string[]) => {
	let error = null;

	const res = await fetch(`${DEEPSEEK_API_BASE_URL}/urls/update`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(token && { authorization: `Bearer ${token}` })
		},
		body: JSON.stringify({
			urls: urls
		})
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			console.log(err);
			if ('detail' in err) {
				error = err.detail;
			} else {
				error = 'Server connection failed';
			}
			return null;
		});

	if (error) {
		throw error;
	}

	return res.DeepSeek_API_BASE_URLS;
};

export const getDeepSeekKeys = async (token: string = '') => {
	let error = null;

	const res = await fetch(`${DEEPSEEK_API_BASE_URL}/keys`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(token && { authorization: `Bearer ${token}` })
		}
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			console.log(err);
			if ('detail' in err) {
				error = err.detail;
			} else {
				error = 'Server connection failed';
			}
			return null;
		});

	if (error) {
		throw error;
	}

	return res.DeepSeek_API_KEYS;
};

export const updateDeepSeekKeys = async (token: string = '', keys: string[]) => {
	let error = null;

	const res = await fetch(`${DEEPSEEK_API_BASE_URL}/keys/update`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(token && { authorization: `Bearer ${token}` })
		},
		body: JSON.stringify({
			keys: keys
		})
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			console.log(err);
			if ('detail' in err) {
				error = err.detail;
			} else {
				error = 'Server connection failed';
			}
			return null;
		});

	if (error) {
		throw error;
	}

	return res.DeepSeek_API_KEYS;
};

export const getDeepSeekModels = async (token: string = '') => {
	let error = null;

	const res = await fetch(`${DEEPSEEK_API_BASE_URL}/models`, {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(token && { authorization: `Bearer ${token}` })
		}
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			error = `DeepSeek: ${err?.error?.message ?? 'Network Problem'}`;
			return [];
		});

	if (error) {
		throw error;
	}

	const models = Array.isArray(res) ? res : res?.data ?? null;

	return models
		? models
				.map((model) => ({ id: model.id, name: model.name ?? model.id, external: true ,type:'deepseek'}))
				.sort((a, b) => {
					return a.name.localeCompare(b.name);
				})
		: models;
};

export const getDeepSeekModelsDirect = async (
	base_url: string = 'https://api.siliconflow.cn/v1',
	api_key: string = ''
) => {
	let error = null;

	const res = await fetch(`${base_url}/models`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${api_key}`
		}
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			console.log(err);
			error = `DeepSeek: ${err?.error?.message ?? 'Network Problem'}`;
			return null;
		});

	if (error) {
		throw error;
	}

	const models = Array.isArray(res) ? res : res?.data ?? null;

	return models
		.map((model) => ({ id: model.id, name: model.name ?? model.id, external: true }))
		.filter((model) => (base_url.includes('siliconflow') ? model.name.includes('gpt') : true))
		.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
};

export const generateDeepSeekChatCompletion = async (
	token: string = '',
	body: object,
	url: string = DEEPSEEK_API_BASE_URL
): Promise<[Response | null, AbortController]> => {
	const controller = new AbortController();
	let error = null;

	const res = await fetch(`${url}/chat/completions`, {
		signal: controller.signal,
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	}).catch((err) => {
		console.log(err);
		error = err;
		return null;
	});

	if (error) {
		throw error;
	}

	return [res, controller];
};

export const synthesizeDeepSeekSpeech = async (
	token: string = '',
	speaker: string = 'alloy',
	text: string = '',
	model: string = 'tts-1'
) => {
	let error = null;

	const res = await fetch(`${DEEPSEEK_API_BASE_URL}/audio/speech`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: model,
			input: text,
			voice: speaker
		})
	}).catch((err) => {
		console.log(err);
		error = err;
		return null;
	});

	if (error) {
		throw error;
	}

	return res;
};

// 暂时用openai的方法，
export const generateDSTitle = async (
	token: string = '',
	template: string,
	model: string,
	prompt: string,
	url: string = DEEPSEEK_API_BASE_URL
) => {
	let error = null;

	template = promptTemplate(template, prompt);

	console.log(template);

	const res = await fetch(`${url}/chat/completions`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			model: model,
			messages: [
				{
					role: 'user',
					content: template
				}
			],
			stream: false,
			// Restricting the max tokens to 50 to avoid long titles
			max_tokens: 50
		})
	})
		.then(async (res) => {
			if (!res.ok) throw await res.json();
			return res.json();
		})
		.catch((err) => {
			console.log(err);
			if ('detail' in err) {
				error = err.detail;
			}
			return null;
		});

	if (error) {
		throw error;
	}

	return res?.choices[0]?.message?.content.replace(/["']/g, '') ?? 'New Chat';
};
