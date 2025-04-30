export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const target = request.headers.get('x-target') || '';
		if (!target) {
			return new Response('请求头中缺少 x-target', {
				status: 500,
			});
		}
		const cookie = request.headers.get('x-cookie') || '';
		return fetch(new URL(`${url.pathname}${url.search}`, target), {
			method: request.method,
			body: request.body,
			headers: [...request.headers, ['cookie', cookie], ['referer', target]]
				.filter(([key, value]) => {
					return !/^origin$/i.test(key);
				})
				.reduce<Record<string, string>>((a, [key, value]) => {
					a[key] = value;
					return a;
				}, {}),
		});
	},
} satisfies ExportedHandler<Env>;
