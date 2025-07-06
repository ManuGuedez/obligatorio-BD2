import origin_url from './origin';

const default_url = origin_url;

const ApiService = {
    get: async (resource) => {
        const request = {
        };

        const api_response = await fetch(`${default_url}/${resource}`, request);
        const response = { code: api_response.status, data: null };

        if (api_response.ok)
            response.data = await api_response.json();

        return response;
    },

    post: async (resource, data, content_type) => {

        const request = {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": `${content_type}`,
            },
        };

        const api_response = await fetch(`${default_url}/${resource}`, request);

        const response = { code: api_response.status, data: null };

        const responseBody = await api_response.json();

        response.data = responseBody;

        return response;
    },
};

export default ApiService;