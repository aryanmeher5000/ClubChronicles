import { DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Input, Text, useDisclosure } from "@chakra-ui/react";
import { useRef } from "react";
import ModalComponent from "../../Utilities/ModalComponent";
import useDeleteProfile from "../Hooks/useDeleteProfile";

const AlertDialogForDeletePassword = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const passRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useDeleteProfile();

  const handleUpdatePassword = () => {
    const password = passRef.current?.value;

    if (password) {
      mutate({ password: password });
    }
  };

  function DelPassInp() {
    return (
      <Box>
        <Text mb={2}>
          This proccess is irreversible and account once deleted cannot be recovered. If you wish to procceed
        </Text>
        <Text mb={2}>Enter your password to confirm</Text>
        <Input placeholder="Password" ref={passRef} />
      </Box>
    );
  }

  return (
    <Box>
      <Button colorScheme="red" onClick={onOpen} leftIcon={<DeleteIcon />} w="250px">
        Delete Profile
      </Button>

      <ModalComponent
        title="Delete Profile?"
        Component={DelPassInp}
        onClickAction={handleUpdatePassword}
        isOpen={isOpen}
        onClose={onClose}
        isDisabled={isPending}
      />
    </Box>
  );
};

export default AlertDialogForDeletePassword;
