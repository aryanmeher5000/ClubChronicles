import { useState, useCallback, useRef } from "react";
import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";

const useShowAlert = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("Are you sure?");
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<() => void>(() => () => {});
  const [confirmText, setConfirmText] = useState("Confirm");
  const [cancelText, setCancelText] = useState("Cancel");
  const [isLoading, setIsLoading] = useState(false);

  const cancelRef = useRef<HTMLButtonElement>(null);

  const open = useCallback(
    (params: {
      title?: string;
      message: string;
      onConfirm: () => void;
      confirmText?: string;
      cancelText?: string;
      isLoading?: boolean;
    }) => {
      setTitle(params.title || "Are you sure?");
      setMessage(params.message);
      setOnConfirm(() => params.onConfirm);
      setConfirmText(params.confirmText || "Confirm");
      setCancelText(params.cancelText || "Cancel");
      setIsLoading(params.isLoading || false);
      onOpen(); // Automatically trigger the dialog
    },
    [onOpen]
  );

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  // Renders the alert dialog within the hook itself
  const AlertDialogComponent = () => {
    return (
      <AlertDialog motionPreset="slideInBottom" isCentered isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={close}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>

            <AlertDialogBody>{message}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={close} isDisabled={isLoading}>
                {cancelText}
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  onConfirm();
                  close();
                }}
                ml={3}
                isLoading={isLoading}
              >
                {confirmText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    );
  };

  return { open, AlertDialogComponent };
};

export default useShowAlert;
