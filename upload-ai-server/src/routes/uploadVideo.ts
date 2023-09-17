import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import path from 'node:path';
import fs from 'node:fs';
import { pipeline } from 'node:stream'
import { randomUUID } from 'node:crypto';
import { fastifyMultipart } from '@fastify/multipart'
import { promisify } from "node:util";

const pump = promisify(pipeline)

export async function uploadVideoRoute(app: FastifyInstance) {
    app.register(fastifyMultipart, {
        limits: {
            fileSize: 1_048_576 * 32 //32mb
        }
    })

    app.post('/videos', async (req, res) => {
        const data = await req.file();

        if (!data) {
            return res.status(400).send({ error: 'Missing file input!' })
        }

        const extension = path.extname(data.filename);

        if (extension !== '.mp3') {
            return res.status(500).send({ error: 'Invalid input type. Please upload an MP3 file.' })
        }

        const fileBaseName = path.basename(data.filename, extension)
        const fileUploadName = `${fileBaseName}-${randomUUID()}${extension}`
        const uploadDestination = path.resolve(__dirname, '../../tmp', fileUploadName)

        await pump(data.file, fs.createWriteStream(uploadDestination))
        const video = prisma.video.create({
            data: {
                name: data.filename,
                path: uploadDestination
            }
        })
        return res.status(200).send({ video })
    })

}