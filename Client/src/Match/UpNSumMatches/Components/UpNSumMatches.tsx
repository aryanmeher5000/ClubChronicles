import { Box, Divider, Heading } from "@chakra-ui/react";
import { useState } from "react";
import DebouncedFilter, { Query } from "../../../Utilities/DebouncedFilter";
import useGetMatches, { UpNSumMatchesCardProps } from "../Hooks/useGetMatches";
import { useParams } from "react-router-dom";
import CardGrid from "../../../Utilities/CardGrid";
import UpNSumMatchesCard from "./UpNSumMatchesCard";
import SkeletonCardsOnly from "../../../Utilities/SkeletonCardOnly";
import ViewMoreButton from "../../../Utilities/ViewMoreButton";
import ErrorDisplay from "../../../ErrorPages/ErrorDisplay";

const UpNSumMatches = () => {
  const { endPoint } = useParams();
  const [query, setQuery] = useState<Query>({});

  const { data, isLoading, error, hasNextPage, fetchNextPage, refetch, isFetchingNextPage } = useGetMatches(
    endPoint === "upcoming" ? "UPCOMING" : "SUMMARY",
    12,
    query
  );

  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Box>
      <Heading textAlign="center">{endPoint === "upcoming" ? "Upcoming Matches" : "Matches Summary"}</Heading>
      <Divider mb={4} />

      <DebouncedFilter query={query} setQuery={setQuery} isDisabled={isLoading} />

      {data?.pages.map((page, index) => (
        <CardGrid<UpNSumMatchesCardProps>
          key={index}
          data={page.body}
          Card={UpNSumMatchesCard}
          isLoading={isFetchingNextPage}
          custCol={[1, 1, 1, 2]}
        />
      ))}
      {isLoading && <SkeletonCardsOnly />}

      <ViewMoreButton isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchFxn={fetchNextPage} />
    </Box>
  );
};

export default UpNSumMatches;
