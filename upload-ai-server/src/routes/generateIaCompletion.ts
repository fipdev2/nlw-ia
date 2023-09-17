import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod';
import { streamToResponse, OpenAIStream } from 'ai'
import { openai } from "../lib/openai";

export async function generateIaCompletionRoute(app: FastifyInstance) {
    app.post('/ia/complete', async (req, res) => {

        const bodySchema = z.object({
            videoId: z.string().uuid(),
            prompt: z.string(),
            temperature: z.number().min(0).max(1).default(0.5),
        })
        const { videoId, prompt, temperature } = bodySchema.parse(req.body);

        const video = await prisma.video.findUniqueOrThrow({
            where: {
                id: videoId,
            }
        })

        if (!video.transcription) {
            return res.status(400).send({ error: 'Video transcription has not been generated yet.' })
        }

        const promptMessage = prompt.replace('{transcription}', video.transcription)

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            temperature,
            stream: true,
            messages: [{ role: "user", content: promptMessage }]
        })

        const stream = OpenAIStream(response);

        streamToResponse(stream, res.raw,{
            headers:{
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Methos':'GET, POST, PUT, DELETE, OPTIONS'
            }
        })
        // return response;
    })
}