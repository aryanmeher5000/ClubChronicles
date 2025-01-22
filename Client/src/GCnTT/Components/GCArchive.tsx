import { Box, Divider, Flex, Heading, Tag, Text } from "@chakra-ui/react";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";
import CardGrid from "../../Utilities/CardGrid";
import SkeletonCardsPage from "../../Utilities/SkeletonCardsPage";
import ZoomableImage from "../../Utilities/ZoomableImage";
import { GCData, useGetGCRecords } from "../Hooks/useGetGCSRecords";

const GCArchive = () => {
  const { data, isLoading, refetch, error } = useGetGCRecords();

  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;
  if (isLoading) return <SkeletonCardsPage incFilter={false} />;

  return (
    <Box>
      <Heading textAlign="center">GC Archive</Heading>
      <Divider mb={4} />

      <CardGrid<GCData> data={data?.body} Card={GCCard} message="No records found" custCol={[1, 1, 1, 2]} />
    </Box>
  );
};

export const GCCard = ({ year, wonBy, teamPic }: GCData) => {
  return (
    <Flex
      direction={["column", "column", "row"]}
      border="2px solid #f04d50"
      p={4}
      gap={4}
      borderRadius={20}
      w="100%"
      align="center"
    >
      {teamPic && (
        <ZoomableImage
          imgSource={teamPic}
          borderRadius={20}
          width={"200"}
          height={"180"}
          zoomedWidth={["90vw", "90vw", "70vw"]}
          zoomedHeight={["50vh", "50vh", "80vh"]}
        />
      )}
      <Flex flexDir="column" alignItems="flex-start" justifyContent="center">
        <Text fontSize="3.5vh" fontWeight={700}>
          General Championship - {year}
        </Text>
        <Flex alignItems="center" gap={2} mt={2}>
          <Text>Won By: </Text>
          <Tag colorScheme="green" size="lg">
            {wonBy.name}
          </Tag>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default GCArchive;
