import { Box, Button, useDisclosure } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdLockOutline } from "react-icons/md";
import ModalComponent from "../../Utilities/ModalComponent";
import Password from "../../Utilities/Password";
import useUpdatePassword, { passSchema, PasswordSchema } from "../Hooks/useUpdatePassword";

const AlertDialogForUpdatePassword = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<PasswordSchema>({ resolver: zodResolver(passSchema) });
  const { mutate, isPending, isSuccess } = useUpdatePassword();

  useEffect(() => {
    if (isSuccess) onClose();
  }, [isSuccess, onClose]);

  function UpdPassInps() {
    return (
      <Box>
        <Password registerFxn={register("oldPassword")} error={errors.oldPassword} label="New Password" />
        <Password registerFxn={register("newPassword")} error={errors.newPassword} label="Old Password" />
      </Box>
    );
  }

  return (
    <Box>
      <Button colorScheme="yellow" onClick={onOpen} leftIcon={<MdLockOutline />} w="250px">
        Update Password
      </Button>

      <ModalComponent
        title="Update password?"
        Component={UpdPassInps}
        onClickAction={handleSubmit((data) => mutate({ id: " ", data }))}
        isOpen={isOpen}
        onClose={onClose}
        isDisabled={isPending}
      />
    </Box>
  );
};

export default AlertDialogForUpdatePassword;
