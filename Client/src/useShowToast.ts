import { useToast } from "@chakra-ui/react";

const useShowToast = () => {
  const toast = useToast();

  const showToast = (status: "success" | "error" | "info", title: string) => {
    toast({
      title: title,
      status: status,
      duration: 3000,
      isClosable: true,
      position: "top",
      variant: "subtle",
    });
  };

  return showToast;
};

export default useShowToast;
