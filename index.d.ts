import fb from 'firebase-admin';

declare module 'fastify' {
	interface FastifyInstance {
		firebase: fb.app.App
	}
}