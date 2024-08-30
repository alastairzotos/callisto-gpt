import { ListenButton } from "@/components/listen-button";
import { Logo } from "@/components/logo";
import { Menu } from "@/components/menu";
import { Results } from "@/components/results";
import { useCallisto } from "@/hooks/use-callisto";
import { useSpeech } from "@/hooks/use-speech";
import { useEffect } from "react";

export default function Home() {
  const { configure: configureCallisto } = useCallisto();
  const { configure: configureSpeech } = useSpeech();

  useEffect(() => {
    if (typeof window !== undefined) {
      configureCallisto();
      configureSpeech();
    }
  }, [])

  return (
    <>
      <div className="w-[350px] flex flex-col items-center">
        <Menu />
        <Logo />
      </div>
      <Results />
      <ListenButton />
    </>
  );
}
