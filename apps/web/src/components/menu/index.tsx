import { EditIcon, IconMenu } from "../icons"
import {
  Accordion,
  AccordionItem,
  Button,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';

import { useCallisto } from "@/hooks/use-callisto";
import { ServerItem } from "./server-item";

export const Menu: React.FC = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    knownServers,
    currentServer,
    setCurrentServer,
    updateKnownServers,
  } = useCallisto();

  console.log(currentServer);

  return (
    <>
      <div className="w-full flex justify-end mb-5">
        <a
          href="javascript:void(0)"
          onClick={onOpen}
        >
          <IconMenu />
        </a>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Settings</ModalHeader>
              <ModalBody>
                <Accordion variant="bordered" defaultExpandedKeys={["servers"]}>
                  <AccordionItem key="servers" title="Servers">
                    <Listbox
                      selectionMode="single"
                      variant="flat"
                      disallowEmptySelection
                      defaultSelectedKeys={[currentServer].filter(i => !!i) as string[]}
                      onSelectionChange={(e: any) => setCurrentServer(e.values().next().value)}
                      bottomContent={(
                        <div className="flex justify-end">
                          <Button variant="flat" color="secondary">
                            + Server
                          </Button>
                        </div>
                      )}
                    >
                      {knownServers.map((server, index) => (
                        <ListboxItem key={server}>
                          <ServerItem
                            url={server}
                            onChange={newUrl => {
                              updateKnownServers(
                                knownServers.map((curUrl, idx) => idx === index ? newUrl : curUrl)
                              );

                              if (server === currentServer) {
                                setCurrentServer(newUrl);
                              }
                            }}
                          />
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </AccordionItem>

                  <AccordionItem key="plugins" title="Plugins">
                    <h2>Todo</h2>
                  </AccordionItem>
                </Accordion>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" onClick={onClose}>Close</Button>
              </ModalFooter>
            </>
          )}

        </ModalContent>
      </Modal>
    </>
  )
}
