import { Box, Divider, Heading } from "@chakra-ui/react";
import { useState } from "react";
import DebouncedFilter, { Query } from "../../../Utilities/DebouncedFilter";
import LiveMatchesCard from "./LiveMatchesCard";
import ViewMoreButton from "../../../Utilities/ViewMoreButton";
import SkeletonCardsOnly from "../../../Utilities/SkeletonCardOnly";
import CardGrid from "../../../Utilities/CardGrid";
import useGetLiveMatches from "../Hooks/useGetLiveMatches";
import ErrorDisplay from "../../../ErrorPages/ErrorDisplay";

const HighlightMatches = () => {
  const [query, setQuery] = useState<Query>({});

  const { data, isLoading, error, refetch, isFetchingNextPage, fetchNextPage, hasNextPage } = useGetLiveMatches(query);

  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Box>
      <Heading textAlign="center">Live Matches</Heading>
      <Divider mb={4} />

      <DebouncedFilter query={query} setQuery={setQuery} isDisabled={isLoading} />

      {data?.pages.map((page, index) => (
        <CardGrid key={index} data={page.body} Card={LiveMatchesCard} isLoading={isFetchingNextPage} />
      ))}
      {isLoading && <SkeletonCardsOnly />}

      <ViewMoreButton isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchFxn={fetchNextPage} />
    </Box>
  );
};

export default HighlightMatches;
