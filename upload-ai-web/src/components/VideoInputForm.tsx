import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { loadFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from '@ffmpeg/util'
import { api } from "@/lib/axios";
import './custom-loader.css'

interface VideoInputFormProps {
    setVideoId: (id: string) => void
}

function VideoInputForm({ setVideoId }: VideoInputFormProps) {
    const [video, setVideo] = useState<File | null>(null);
    const [status, setStatus] = useState<'waiting' | 'converting' | 'uploading' | 'generating' | 'success'>('waiting')
    const promptInputRef = useRef<HTMLTextAreaElement>(null);

    const statusMsgs = {
        converting: 'Convertendo...',
        generating: 'Transcrevendo...',
        uploading: 'Carregando...',
        success: 'Sucesso!'
    }

    const handleSelectedFile = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.currentTarget;

        if (!files) {
            return;
        }
        const selectedFile = files[0];
        setVideo(selectedFile);

    }

    const convertVideoToAudio = async (video: File) => {
        console.log('Covertion started...');
        const ffmpeg = await loadFFmpeg();
        await ffmpeg.writeFile('input.mp4', await fetchFile(video));

        // ffmpeg.on('log', log => {
        //     console.log(log)
        // })

        ffmpeg.on('progress', progress => {
            console.log('Convertion progress: ' + Math.round(progress.progress * 100))
        })
        await ffmpeg.exec([
            '-i',
            'input.mp4',
            '-map',
            '0:a',
            '-b:a',
            '20k',
            '-acodec',
            'libmp3lame',
            'output.mp3',
        ])

        const data = await ffmpeg.readFile('output.mp3');

        const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
        const audioFile = new File([audioFileBlob], 'audio.mp3', {
            type: 'audio/mpeg'
        })

        console.log('Convertion finished!')
        return audioFile
    }

    const handleUploadVideo = async (event: FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault();

            const prompt = promptInputRef.current?.value

            if (!video) {
                return;
            }
            //converte video em audio
            setStatus('converting');
            const audioFile = await convertVideoToAudio(video);

            //manda o arquivo pro backend
            setStatus('uploading');
            const data = new FormData();
            data.append('file', audioFile);
            const response = await api.post('/videos', data);

            //transcreve o audio
            setStatus('generating')
            const videoId = response.data.video.id
            await api.post(`/videos/${videoId}/transcription`, {
                prompt,
            });

            setStatus('success');
            setVideoId(videoId);
        }
        catch (err) {
            alert('Erro')
            setStatus('waiting')
            console.log(console.error(err))
        }

    }

    const previewURL = useMemo(() => {
        if (!video) {
            return null;
        }
        return URL.createObjectURL(video);
    }, [video]);
    console.log(status)
    return (
        <form onSubmit={handleUploadVideo} className="space-y-6">
            <label
                htmlFor="video"
                className=" border flex rounded-md aspect-video text-sm flex-col gap-2 border-dashed items-center justify-center text-muted-foreground hover:cursor-pointer hover:bg-white/5"
            >
                {previewURL ?
                    <video src={previewURL} controls={false} className="pointer-events-none w-full h-full" />
                    :
                    <>

                        <FileVideo className="w-4 h-4" />
                        Selecione um vídeo
                    </>
                }
            </label>
            <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleSelectedFile} />
            <Separator />
            <div className="space-y-2">
                <Label
                    htmlFor="transcription_prompt"
                >
                    Prompt de transcrição
                </Label>
                <Textarea
                    disabled={status !== 'waiting'}
                    ref={promptInputRef}
                    id='transcription_prompt'
                    className="h-20 leading-relaxed"
                    placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
                />
            </div>
            <Button
                data-success={status === 'success'}
                disabled={status !== 'waiting'}
                type="submit"
                className="w-full data-[success=true]:bg-emerald-500"
            >
                {
                    status == 'waiting' ?
                        <>
                            Carregar vídeo
                            <Upload className="w-4 h-4 ml-2" />
                        </>

                        :

                        <>
                            {statusMsgs[status]}
                            {status !== 'success' && <div className="custom-loader" />}
                        </>

                }

            </Button>
        </form >
    );
}

export default VideoInputForm;