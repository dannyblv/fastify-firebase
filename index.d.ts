import fb from 'firebase-admin';
import { FastifyPluginAsync } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    firebase: fb.app.App;
  }
}

type Cert = {
  project_id?: string;
  private_key?: string;
  client_email?: string;
  projectId?: string;
  privateKey?: string;
  clientEmail?: string;
};

declare const fastifyFirebase: FastifyPluginAsync<Cert>;

export default fastifyFirebase;