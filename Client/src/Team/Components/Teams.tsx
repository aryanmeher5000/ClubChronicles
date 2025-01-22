import { Box, Divider, Heading } from "@chakra-ui/react";
import TeamsCard from "./TeamsCard";
import useGetTeams, { TeamsCardProps } from "../Hooks/useGetTeams";
import { useState } from "react";
import DebouncedFilter, { Query } from "../../Utilities/DebouncedFilter";
import CardGrid from "../../Utilities/CardGrid";
import SkeletonCardsOnly from "../../Utilities/SkeletonCardOnly";
import ViewMoreButton from "../../Utilities/ViewMoreButton";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";

const Teams = () => {
  const [query, setQuery] = useState<Query>({});
  const { data, isLoading, error, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetTeams(query);

  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Box>
      <Heading textAlign="center">Teams</Heading>
      <Divider mb={4} />

      <DebouncedFilter query={query} setQuery={setQuery} isDisabled={isLoading} />

      {data?.pages.map(
        (page, index) =>
          Array.isArray(page.body) ? ( // Check if page.body is an array
            <CardGrid<TeamsCardProps>
              key={index} // Use index as key if there's no unique id
              data={page.body} // Pass the whole body array to CardGrid
              Card={TeamsCard} // Pass the component reference
              isLoading={isFetchingNextPage} // Combine loading states
            />
          ) : null // Handle case where page.body is not an array
      )}
      {isLoading && <SkeletonCardsOnly />}

      <ViewMoreButton isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchFxn={fetchNextPage} />
    </Box>
  );
};

export default Teams;
