import { SimpleGrid, Spinner } from "@chakra-ui/react";

const LoadingSpinner = () => {
  return (
    <SimpleGrid w="100%" h="80vh" placeItems="center">
      <Spinner size="xl" thickness="1vh" color="#f04d50" />
    </SimpleGrid>
  );
};

export default LoadingSpinner;
