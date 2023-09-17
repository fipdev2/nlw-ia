import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { api } from "@/lib/axios";

interface PromptSelectProps {
    theme: string,
    onPromptSelected: (template: string) => void
}

interface Prompt {
    id: string,
    title: string,
    template: string,
}

function PromptSelect({ theme, onPromptSelected }: PromptSelectProps) {
    const [prompts, setPrompts] = useState<Prompt[] | null>(null);

    useEffect(() => {
        api.get('/prompts').then((response) => {
            setPrompts(response.data)
        })
    }, [prompts])

    const handlePromptSelected = (promptId: string) => {
        const selectedPrompt = prompts?.find(prompt => prompt.id === promptId)

        if (!selectedPrompt) {
            return
        }
        onPromptSelected(selectedPrompt.template)
    }

    return (
        <Select onValueChange={handlePromptSelected}>
            <SelectTrigger>
                <SelectValue placeholder="Selecione um prompt..." />
            </SelectTrigger>
            <SelectContent className={`${theme == "dark" && "bg-slate-950 text-slate-50 border-slate-100/20"}`}>
                {
                    prompts?.map((prompt) => {
                        return (

                            <SelectItem key={prompt.id} value={prompt.id}>{prompt.title}</SelectItem>
                        )
                    })
                }
            </SelectContent>
        </Select>
    );
}

export default PromptSelect;