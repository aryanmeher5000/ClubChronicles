import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

interface InputProps {
  title: string;
  Component: React.FC;
  onClickAction: () => void;
  isOpen: boolean;
  onClose: () => void;
  isDisabled?: boolean;
}

function ModalComponent({ title, Component, onClickAction, isOpen, onClose, isDisabled }: InputProps) {
  const bg = useColorModeValue("gray.100", "gray.800");
  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInBottom" isCentered>
      <ModalOverlay />
      <ModalContent bg={bg}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Component />
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onClickAction} isDisabled={isDisabled}>
            Confirm
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ModalComponent;
