import fb from 'firebase-admin';
import {FastifyPluginCallback} from 'fastify';

declare module 'fastify' {
	interface FastifyInstance {
		firebase: fb.app.App
	}
}

declare const fastifyFirebase: FastifyPluginCallback<{
	project_id: string;
	private_key: string;
	client_email: string;
} | {
	projectId: string;
	privateKey: string;
	clientEmail: string;
}>;
export default fastifyFirebase;