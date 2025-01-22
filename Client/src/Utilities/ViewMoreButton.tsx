import { Button, Flex } from "@chakra-ui/react";

interface InpProps {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchFxn: () => void;
}

const ViewMoreButton = ({ isFetchingNextPage, hasNextPage, fetchFxn }: InpProps) => {
  return (
    <Flex mt={4} justifyContent="center">
      <Button onClick={fetchFxn} isDisabled={isFetchingNextPage || !hasNextPage}>
        {isFetchingNextPage ? "Loading..." : "View More"}
      </Button>
    </Flex>
  );
};

export default ViewMoreButton;
