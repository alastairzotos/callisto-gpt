import { useCallisto } from "@/hooks/use-callisto";
import React from "react";
import Spinner from 'react-spinners/CircleLoader';

export const Results: React.FC = () => {
  const { responseText, pending } = useCallisto();

  return (
    <div className="max-w-[450px] flex flex-col items-center">
      <Spinner
        loading={pending}
        size={50}
        color="#16b897"
      />

      <span>
        {
          responseText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))
        }
      </span>
    </div>
  )
}
