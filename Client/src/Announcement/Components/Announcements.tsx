import { Box, Divider, Heading } from "@chakra-ui/react";
import AnnouncementsCard from "./AnnouncementsCard";
import useGetAnnouncements, { MultipleAnnouncements } from "../Hooks/useGetAnnouncements";
import { useState } from "react";
import DebouncedFilter, { Query } from "../../Utilities/DebouncedFilter";
import CardGrid from "../../Utilities/CardGrid";
import SkeletonCardsOnly from "../../Utilities/SkeletonCardOnly";
import ViewMoreButton from "../../Utilities/ViewMoreButton";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";

const Announcements = () => {
  const [query, setQuery] = useState<Query>({});
  const { data, error, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } = useGetAnnouncements(query);

  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Box>
      <Heading textAlign="center">Announcements</Heading>
      <Divider mb={4} />

      <DebouncedFilter query={query} setQuery={setQuery} isDisabled={isLoading} />

      {data?.pages.map((page, index) => (
        <CardGrid<MultipleAnnouncements>
          key={index}
          data={page.body}
          Card={AnnouncementsCard}
          isLoading={isFetchingNextPage}
        />
      ))}
      {isLoading && <SkeletonCardsOnly />}

      <ViewMoreButton isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchFxn={fetchNextPage} />
    </Box>
  );
};

export default Announcements;
