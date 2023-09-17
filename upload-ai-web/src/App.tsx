import { useState } from "react"
import { Button } from "./components/ui/button"
import { FileVideo, Github, Moon, Sun, Upload, Wand2 } from 'lucide-react'
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";


function App() {

  const [theme, setTheme] = useState("dark");

  const Icon = () => {
    if (theme == "dark")
      return <Moon className="w-4 " />
    else return <Sun className="w-4" />
  }

  return (
    <body className={theme} style={{ minHeight: '100vh', minWidth:'100vw', display: 'flex', flexDirection: 'column' }}>

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
            />
            <Textarea
              placeholder="Resultado gerado pela IA..."
              className="resize-none p-4 leading-relaxed"
              readOnly
            />
          </div>
          <p>Lembre-se: você pode utilizar a variável <code className="text-violet-400">transcription</code> no seu prompt para adicionar o conteúdo da transcrição do vídeo selecionado.</p>
        </div>
        <aside className="w-80 space-y-6">
          <form className="space-y-6">
            <label
              htmlFor="video"
              className="border flex rounded-md aspect-video text-sm flex-col gap-2 border-dashed items-center justify-center text-muted-foreground hover:cursor-pointer hover:bg-white/5"
            >
              <FileVideo className="w-4 h-4" />
              Selecione um vídeo
            </label>
            <input type="file" id="video" accept="video/mp4" className="sr-only" />
            <Separator />
            <div className="space-y-2">
              <Label
                htmlFor="transcription_prompt"
              >
                Prompt de transcrição
              </Label>
              <Textarea
                id='transcription_prompt'
                className="h-20 leading-relaxed"
                placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula (,)"
              />
            </div>
            <Button type="submit" className="w-full">Carregar vídeo <Upload className="w-4 h-4 ml-2" /></Button>
          </form>
          <Separator />
          <form className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um prompt..." />
                </SelectTrigger>
                <SelectContent className={`${theme == "dark" && "bg-slate-950 text-slate-50 border-slate-100/20"}`}>
                  <SelectItem value="title">Título do YouTube</SelectItem>
                  <SelectItem value="description">Descrição do YouTube</SelectItem>
                </SelectContent>
              </Select>
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
              />
              <span className="block text-xs text-muted-foreground italic ">
                Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros.
              </span>
              <Separator />
              <Button type="submit" className="w-full">
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
