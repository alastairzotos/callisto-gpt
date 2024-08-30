import { useCallisto } from "@/hooks/use-callisto";
import React from "react";

export const Results: React.FC = () => {
  const { responseText } = useCallisto();

  return (
    <div className="max-w-[450px]">
      <span>{responseText}</span>
    </div>
  )
}
