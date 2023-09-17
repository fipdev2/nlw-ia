import { fastify } from 'fastify';
import { fastifyCors } from '@fastify/cors';

//routes
import { getAllPromptsRoute } from './routes/getAllPrompts';
import { uploadVideoRoute } from './routes/uploadVideo';
import { createTranscriptionRoute } from './routes/createTranscription';
import { generateIaCompletionRoute } from './routes/generateIaCompletion';
const app = fastify();

app.register(fastifyCors, {
    origin:'*',
})
app.register(getAllPromptsRoute);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoute);
app.register(generateIaCompletionRoute);

app.listen({
    port: 3333,
}).then(() => {
    console.log('HTTP Server running');
})