import { fastify } from 'fastify';
import { prisma } from './lib/prisma';
import { getAllPromptsRoute } from './routes/getAllPrompts';
import { uploadVideoRoute } from './routes/uploadVideo';

const app = fastify();

app.register(getAllPromptsRoute, uploadVideoRoute);

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP Server running');
})