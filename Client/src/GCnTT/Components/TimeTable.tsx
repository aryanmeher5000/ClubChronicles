import { Divider, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import ZoomableImage from "../../Utilities/ZoomableImage";
import { useGetTimeTable } from "../Hooks/useGetTImeTable";

const TimeTable = () => {
  const { data, isLoading, error } = useGetTimeTable();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay errorObj={error} message="Error fetching data!" />;

  return (
    <Flex direction="column" alignItems="center">
      <Heading>Time Table</Heading>
      <Divider mb={4} />
      {data?.body?.timeTable ? (
        <Grid placeItems="center" w="100%">
          <ZoomableImage imgSource={data.body.timeTable} borderRadius={15} />
        </Grid>
      ) : (
        <Text p={5}>Time Table not declared yet!</Text>
      )}
    </Flex>
  );
};

export default TimeTable;
