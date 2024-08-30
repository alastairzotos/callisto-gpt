import { ListenButton } from "@/components/listen-button";
import { Logo } from "@/components/logo";
import { Results } from "@/components/results";
import { useSpeech } from "@/hooks/use-speech";
import { useEffect } from "react";

export default function Home() {
  const { configure: configureSpeech } = useSpeech();

  useEffect(() => {
    if (typeof window !== undefined) {
      configureSpeech();
    }
  }, [])
  
  return (
    <main className="flex flex-col items-center justify-between w-full h-screen p-10">
      <Logo />

      <Results />

      <ListenButton />
    </main>
  );
}
