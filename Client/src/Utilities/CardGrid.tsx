import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import SkeletonCardsOnly from "./SkeletonCardOnly";
import { useMemo } from "react";

interface CardGridProps<T> {
  data: T[] | undefined;
  Card: React.FC<T>;
  isLoading?: boolean;
  message?: string;
  custCol?: number[];
}

function CardGrid<T extends { _id: string | number }>({
  data = [],
  Card,
  isLoading = false,
  custCol,
  message = "No items available at the moment. Please check back later!",
}: CardGridProps<T>) {
  // Memoize the cards to optimize rendering
  const memoisedCardGrid = useMemo(() => {
    return data.map((item) => <Card key={item._id} {...item} />);
  }, [data, Card]);

  // Define default column settings with overrides
  const defaultColumns = { base: 1, sm: 1, md: 2, lg: 3, xl: 3, "2xl": 4 };
  const columns = custCol || defaultColumns;

  // Show skeleton loader while loading
  if (isLoading && data.length === 0) {
    return <SkeletonCardsOnly />;
  }

  // Show message for undefined data
  if (!data) {
    return (
      <SimpleGrid placeItems="center" fontWeight={500} p={10} color="gray.500">
        <Text>Unable to load items. Please try again later.</Text>
      </SimpleGrid>
    );
  }

  if (data.length === 0) {
    return (
      <SimpleGrid placeItems="center" fontWeight={500} p={10} color="gray.500">
        <Text textAlign="center">{message}</Text>
      </SimpleGrid>
    );
  }

  return (
    <Box w="100%" h="100%" mt={6}>
      <SimpleGrid columns={columns} gap={4}>
        {memoisedCardGrid}
      </SimpleGrid>
      {isLoading && <SkeletonCardsOnly />}
    </Box>
  );
}

export default CardGrid;
