import { useCallisto } from "@/hooks/use-callisto";
import { useSpeech } from "@/hooks/use-speech";
import React from "react";
import { ShinyButton } from "./shiny-button";

const firstUppercase = (text: string) =>
  (text && text.length) ? text[0].toLocaleUpperCase() + text.slice(1) : ''

export const ListenButton: React.FC = () => {
  const {
    listening,
    interimText,
    speechResultText,
    speaking,
    listen,
    cancelSpeech,
  } = useSpeech();

  const {
    pending,
  } = useCallisto();

  const handleClick = () => {
    if (speaking) {
      cancelSpeech();
    }
    
    listen();
  }

  return (
    <ShinyButton onClick={handleClick} disabled={listening || pending}>
      {
        !listening && !pending
          ? "Talk"
          : firstUppercase(speechResultText || interimText)
      }
    </ShinyButton>
  )
}
