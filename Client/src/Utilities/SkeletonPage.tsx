import { Divider, Flex, Skeleton, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

const SkeletonPage = ({ withImage = true }: { withImage?: boolean }) => {
  return (
    <Flex w="100%" h="100%" justify="center" direction="column">
      <Flex p={2} justify="center">
        <Skeleton height="30px" width="40%" borderRadius={5} />
      </Flex>
      <Divider mb={4} />

      <Flex p={2} justify="center">
        <Skeleton height="10px" width="20%" borderRadius={5} />
      </Flex>
      <Divider mb={4} />

      <Flex flexDir={["column", "row"]} gap={5}>
        {withImage && <SkeletonCircle alignSelf="center" size="250" />}

        <SkeletonText flex={1} noOfLines={8} spacing={4} mt={4} alignSelf={["unset", "unset", "center"]} />
      </Flex>

      <SkeletonText noOfLines={3} spacing={4} mt={8} />
    </Flex>
  );
};

export default SkeletonPage;
