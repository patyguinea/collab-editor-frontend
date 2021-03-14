const apis = {
  ces: {
    development: 'https://collab-editor-backend.herokuapp.com',
  },
};

export default async function api(apiName, path, method = undefined, body = undefined, options = []) {
  const url = `${apis[apiName][process.env.NODE_ENV]}/${path}`;
  const res = await fetch(
    url,
    Object.assign(
      {
        method: method || (body ? 'POST' : 'GET'),
        body: typeof body === 'string' ? body : JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      ...options
    )
  );

  if (res.status < 200) {
    throw new Error(`unexpected HTTPS status code ${res.status}`);
  }

  const result = res.json();
  if (res.status >= 400) {
    return result.then(json => Promise.reject(json));
  }

  // res.status >= 200 && res.status < 400
  return result;
}
