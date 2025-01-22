import { Avatar, Box, Divider, Grid, Heading, HStack, List, ListItem, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import { createImageUrlFromId } from "../../Utilities/utilFxns";
import { useGetPointsTable } from "../Hooks/useGetPointsTable";

const PointTable = () => {
  const { data, error, isLoading, refetch } = useGetPointsTable();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Box>
      <Heading textAlign="center">Point Table</Heading>
      <Divider mb={4} />

      <Grid placeItems="center" w="100%" h="100%">
        <List border={`2px solid #f04d50`} borderRadius={15} w={["100%", "100%", "60%"]} p={5}>
          <ListItem color="#f04d50" fontSize="3vh" fontWeight={700}>
            <HStack justifyContent="space-between" gap={10}>
              <Text>Departments</Text>
              <Text>Points</Text>
            </HStack>
            <Divider />
          </ListItem>

          {data?.body?.map((k) => (
            <ListItem key={k._id} fontSize="lg" fontWeight={500} py={4}>
              <HStack justifyContent="space-between" alignItems="center">
                <HStack>
                  <Avatar src={k.logo && createImageUrlFromId(k.logo)} size="sm" name={k.name} />
                  <NavLink to={k._id}>
                    <Text>{k.name}</Text>
                  </NavLink>
                </HStack>
                <Text px={4}>{k.points}</Text>
              </HStack>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Box>
  );
};

export default PointTable;
