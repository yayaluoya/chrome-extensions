export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.jsonc
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		try {
			const url = new URL(request.url);
			const target = request.headers.get('x-target');
			if (!target) {
				return new Response('请求头中缺少 x-target', { status: 500 });
			}

			// 构建目标 URL
			const targetUrl = new URL(`${url.pathname}${url.search}`, target);

			// 构建新的 headers
			const newHeaders: Record<string, string> = {};
			request.headers.forEach((value, key) => {
				if (!/^origin$/i.test(key) && key !== 'cookie' && key !== 'referer') {
					newHeaders[key] = value;
				}
			});
			// 覆盖 cookie 和 referer
			newHeaders['cookie'] = request.headers.get('x-cookie') || '';
			newHeaders['referer'] = target;

			// 只在允许有 body 的方法上传递 body
			const hasBody = !['GET', 'HEAD'].includes(request.method.toUpperCase());
			const fetchInit: RequestInit = {
				method: request.method,
				headers: newHeaders,
				body: hasBody ? request.body : undefined,
			};

			return await fetch(targetUrl.toString(), fetchInit);
		} catch (err: any) {
			return new Response('服务端错误: ' + (err?.message || err), { status: 500 });
		}
	},
} satisfies ExportedHandler<Env>;
