import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { TickIcon } from "../icons";
import { useCallisto } from "@/hooks/use-callisto";

const isValidHttpUrl = (urlString: string) => {
  try {
    const url = new URL(urlString);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

export const AddServer: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isValid, setIsValid] = useState(true);

  const { knownServers, updateKnownServers } = useCallisto();

  const handleAddServer = () => {
    if (isValid) {
      setCurrentUrl('');
      setEditing(false);

      updateKnownServers([...knownServers, currentUrl]);
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleAddServer();
    }
  }

  const handleUpdateUrl = (url: string) => {
    setCurrentUrl(url);
    setIsValid(isValidHttpUrl(url));
  }

  return (
    <div className="flex justify-end">
      {!editing && (
        <Button
          variant="flat"
          color="secondary"
          onClick={() => setEditing(true)}
        >
          + Server
        </Button>
      )}

      {editing && (
        <div className="flex gap-3">
          <Input
            value={currentUrl}
            onChange={e => handleUpdateUrl(e.target.value)}
            onKeyUp={handleKeyUp}
            isInvalid={!isValid}
            errorMessage="Please enter a valid URL"
          />

          <Button
            isIconOnly
            variant="solid"
            disabled={!isValid}
            onClick={handleAddServer}
          >
            <TickIcon />
          </Button>
        </div>
      )}
    </div>
  )
}
