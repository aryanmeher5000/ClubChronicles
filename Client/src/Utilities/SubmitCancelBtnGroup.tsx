import { AddIcon, SmallCloseIcon, RepeatClockIcon } from "@chakra-ui/icons";
import { HStack, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface BtnGroupInput {
  type: "Create" | "Update";
  isPending: boolean;
  isDisabled?: boolean;
}

const SubmitCancelBtnGroup = ({ type, isPending, isDisabled }: BtnGroupInput) => {
  const nav = useNavigate();

  return (
    <HStack alignItems="center" justifyContent="center" gap={5}>
      <Button
        type="submit"
        colorScheme="green"
        leftIcon={type === "Create" ? <AddIcon /> : <RepeatClockIcon />}
        isDisabled={isPending || isDisabled}
      >
        {isPending ? "Processing..." : type}
      </Button>
      <Button colorScheme="red" leftIcon={<SmallCloseIcon />} isDisabled={isPending} onClick={() => nav(-1)}>
        Cancel
      </Button>
    </HStack>
  );
};

export default SubmitCancelBtnGroup;
