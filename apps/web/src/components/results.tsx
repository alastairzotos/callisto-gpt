import { useCallisto } from "@/hooks/use-callisto";
import { useFadeIn } from "@/hooks/use-fade-in";
import React from "react";
import Spinner from 'react-spinners/CircleLoader';

const ResponseToken: React.FC<{ text: string }> = ({ text }) => {
  const fadeIn = useFadeIn();

  if (text === '\n') {
    return <br style={fadeIn} />;
  }

  return (
    <span style={fadeIn}>
      {text}
    </span>
  );
}

export const Results: React.FC = () => {
  const { response, pending } = useCallisto();

  return (
    <div className="max-w-[450px] flex flex-col items-center">
      <Spinner
        loading={pending}
        size={50}
        color="#16b897"
      />

      <p>
        {
          response.map((text, idx) => (
            <ResponseToken key={idx} text={text} />
          ))
        }
      </p>
    </div>
  )
}
