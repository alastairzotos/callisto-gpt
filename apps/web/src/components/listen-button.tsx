import { useCallisto } from "@/hooks/use-callisto";
import { useSpeech } from "@/hooks/use-speech";
import React from "react";
import { ShinyButton } from "./shiny-button";

const firstUppercase = (text: string) =>
  (text && text.length) ? text[0].toLocaleUpperCase() + text.slice(1) : ''

export const ListenButton: React.FC = () => {
  const {
    listening,
    speaking,
    input,
    cancelSpeech,
  } = useSpeech();

  const {
    interimText,
    speechResultText,
    isPending,
  } = useCallisto();

  const handleClick = () => {
    if (speaking) {
      cancelSpeech();
    } else {
      input?.startRecognition();
    }
  }

  return (
    <ShinyButton onClick={handleClick} disabled={listening || isPending}>
      {
        !listening && !isPending
          ? "Talk"
          : firstUppercase(speechResultText || interimText)
      }
    </ShinyButton>
  )
}
