/**
 * TODO The idea is to expose functions to configure the http client
 * - all get, post, ... functions use this common configuration
 * - all get, post, ... functions accept a configuration arg to merge with common conf
 * @param url
 */

function get(url) {
	return fetch(url).then(resp => {
		if (resp.ok) {
			return resp.json(); // TODO only if content type contains 'json'
		}
		throw new Error(`${resp.status} - ${resp.statusText}`);
	});
}

export default { get };
