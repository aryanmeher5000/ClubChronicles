import { Box, Divider, Flex, Skeleton } from "@chakra-ui/react";
import SkeletonCardsOnly from "./SkeletonCardOnly";

const SkeletonCardsPage = ({ incFilter = true }: { incFilter?: boolean }) => {
  return (
    <Box>
      <Flex justify="center" align="center" direction="column">
        <Box w="40%" p={2} mt={4}>
          <Skeleton noOfLines={1} height="30px" borderRadius={5} />
        </Box>
        <Divider />
        {incFilter && (
          <Skeleton noOfLines={1} width={["90%", "50%"]} height="30px" mt={4}>
            <Box></Box>
          </Skeleton>
        )}
      </Flex>
      <SkeletonCardsOnly />
    </Box>
  );
};

export default SkeletonCardsPage;
