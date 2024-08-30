import { Button, Input, Modal, ModalBody, ModalHeader, Popover, PopoverContent, PopoverTrigger, useDisclosure } from "@nextui-org/react";
import { EditIcon, TickIcon } from "../icons";
import { useState } from "react";

interface Props {
  url: string;
  onChange: (url: string) => void;
}

export const ServerItem: React.FC<Props> = ({ url, onChange }) => {
  const [currentUrl, setCurrentUrl] = useState(url);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUpdateUrl = () => {
    onClose();
    onChange(currentUrl);
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement> | KeyboardEvent) => {
    if (e.code === 'Enter') {
      handleUpdateUrl();
    }
  }

  return (
    <>
      {url}

      <Popover placement="right" isOpen={isOpen}>
        <PopoverTrigger>
          <Button
            size="sm"
            isIconOnly
            variant="ghost"
            className="ml-3"
            onClick={onOpen}
          >
            <EditIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <div className="flex gap-3">
          <Input
            value={currentUrl}
            onChange={e => setCurrentUrl(e.target.value)}
            onKeyUp={handleKeyUp}
          />

          <Button
            isIconOnly
            variant="solid"
            color="primary"
            onClick={handleUpdateUrl}
          >
            <TickIcon />
          </Button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
