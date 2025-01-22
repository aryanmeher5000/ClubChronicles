import { Box, Flex, SimpleGrid, Skeleton, useColorModeValue } from "@chakra-ui/react";

const SkeletonCardsOnly = () => {
  const arrayMap = [1, 2, 3, 4, 5, 6];

  return (
    <Box w="100%">
      <SimpleGrid columns={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3, "2xl": 3 }} gap="2vh" mt={6}>
        {arrayMap.map((k) => CardsMapper(k))}
      </SimpleGrid>
    </Box>
  );
};

const CardsMapper = (id: number) => {
  const bg = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
  return (
    <Flex key={id} w="100%" bg={bg} p={4} borderRadius={15} direction="column" gap={4}>
      <Skeleton width="100%" h="50px" borderRadius={20} />
      <Skeleton width="100%" h="20px" borderRadius={20} />
      <Skeleton width="100%" h="20px" borderRadius={20} />
    </Flex>
  );
};

export default SkeletonCardsOnly;
