import { useState } from "react"
import { Button } from "./components/ui/button"
import { Github, Moon, Sun, Wand2 } from 'lucide-react'
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { useCompletion } from 'ai/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import VideoInputForm from "./components/VideoInputForm";
import PromptSelect from "./components/PromptSelect";


function App() {
  const [temperature, setTemperature] = useState(0.5);
  const [theme, setTheme] = useState("dark");
  const [videoId, setVideoId] = useState<string | null>(null)

  const Icon = () => {
    if (theme == "dark")
      return <Moon className="w-4 " />
    else return <Sun className="w-4" />
  }

  const { input, setInput, handleInputChange, handleSubmit, completion, isLoading } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,

    },
    headers: {
      'Content-type': 'application/json'
    }
  })


  return (
    <body className={theme} style={{ minHeight: '100vh', minWidth: '100vw', display: 'flex', flexDirection: 'column' }}>

      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold"> upload.ai {"</>"}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Desenvolvido durante NLW-IA 🚀</span>
          <Separator orientation='vertical' className="h-6" />
          <Button
            variant={"outline"}>
            <Github className="w-4 mr-1" />
            Github
          </Button>
          <Separator orientation='vertical' className="h-6" />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant={"outline"}
              >
                <Icon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={` ${theme == "dark" && "bg-slate-950 text-slate-50 border-slate-100/20"} `}>
              <DropdownMenuItem
                onClick={() => setTheme("dark")}
                className="hover:cursor-pointer"
              >
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme("light")}
                className="hover:cursor-pointer"
              >
                Light
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <main className="flex-1 p-6 flex gap-6">
        <div className="flex flex-col flex-1 gap-4">
          <div className="grid grid-rows-2 gap-4 flex-1">
            <Textarea
              placeholder="Inclua o prompt para a IA..."
              className="resize-none p-4 leading-relaxed"
              value={input}
              onChange={handleInputChange}
            />
            <Textarea
              placeholder="Resultado gerado pela IA..."
              className="resize-none p-4 leading-relaxed"
              value={completion}
              readOnly
            />
          </div>
          <p>Lembre-se: você pode utilizar a variável <code className="text-violet-400">transcription</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado.</p>
        </div>
        <aside className="w-80 space-y-6">
          <VideoInputForm setVideoId={setVideoId} />
          <Separator />
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Prompt</Label>
              <PromptSelect onPromptSelected={setInput} theme={theme} />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Modelo</Label>
              <Select defaultValue="gpt3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">Você poderá customizar essa opção em breve</span>
            </div>
            <Separator />
            <div className="space-y-4">
              <Label>Temperatura</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={temperature => setTemperature(temperature[0])}
              />
              <span className="block text-xs text-muted-foreground italic ">
                Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros.
              </span>
              <Separator />
              <Button type="submit" className="w-full" disabled={isLoading}>
                Executar
                <Wand2 className="w-4 ml-2" />
              </Button>
            </div>
          </form>
        </aside>
      </main>
    </body>

  )
}

export default App
