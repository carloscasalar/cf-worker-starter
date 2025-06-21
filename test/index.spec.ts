// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('User API', () => {
	it('health check returns ok', async () => {
		const request = new IncomingRequest('http://example.com/health');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		const data = await response.json() as { status: string; timestamp: string };
		expect(data.status).toBe('ok');
		expect(data.timestamp).toBeDefined();
	});

	it.skip('validates user data correctly', async () => {
		// Skip: This test requires a database connection which is not set up in the template
		// Remove .skip() after setting up your database or replace with your own implementation
		const userData = {
			name: 'John Doe',
			email: 'john@example.com'
		};

		const request = new IncomingRequest('http://example.com/api/v1/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		});

		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(201);
		const data = await response.json() as { id: string; name: string; email: string; createdAt: string };
		expect(data.id).toBeDefined();
		expect(data.name).toBe(userData.name);
		expect(data.email).toBe(userData.email);
		expect(data.createdAt).toBeDefined();
	});

	it('returns error for invalid user data', async () => {
		const invalidUserData = {
			name: '', // Empty name
			email: 'invalid-email' // Invalid email
		};

		const request = new IncomingRequest('http://example.com/api/v1/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(invalidUserData),
		});

		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(400);
		const data = await response.json() as { error: string };
		expect(data.error).toBeDefined();
	});

	it.skip('handles user listing', async () => {
		// Skip: This test requires a database connection which is not set up in the template
		// Remove .skip() after setting up your database or replace with your own implementation
		const request = new IncomingRequest('http://example.com/api/v1/users');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		const data = await response.json() as unknown[];
		expect(Array.isArray(data)).toBe(true);
	});

	it.skip('handles user retrieval by ID', async () => {
		// Skip: This test requires a database connection which is not set up in the template
		// Remove .skip() after setting up your database or replace with your own implementation
		const request = new IncomingRequest('http://example.com/api/v1/users/test-id');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		// This should return 404 for a non-existent user, or 200 if the user exists
		expect([200, 404]).toContain(response.status);

		if (response.status === 200) {
			const data = await response.json() as { id: string; name: string; email: string; createdAt: string };
			expect(data.id).toBeDefined();
			expect(data.name).toBeDefined();
			expect(data.email).toBeDefined();
			expect(data.createdAt).toBeDefined();
		} else {
			const data = await response.json() as { error: string };
			expect(data.error).toBeDefined();
		}
	});
});
