import { Box, Button, Divider, Flex, Heading, HStack } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import LiveMatchesCard from "./LiveMatches/Components/LiveMatchesCard";
import { Link, useNavigate } from "react-router-dom";
import useGetLiveMatches from "./LiveMatches/Hooks/useGetLiveMatches";
import CardGrid from "../Utilities/CardGrid";
import UpNSumMatchesCard from "./UpNSumMatches/Components/UpNSumMatchesCard";
import useGetMatches from "./UpNSumMatches/Hooks/useGetMatches";
import ErrorDisplay from "../ErrorPages/ErrorDisplay";

const Matches = () => {
  return (
    <Box>
      <Heading textAlign="center">Matches</Heading>
      <Divider mb={4} />

      <DisplayLiveMatches />

      <DisplayUpcomingMatches />

      <DisplayMatchesSummary />
    </Box>
  );
};

function ViewMoreBtn({ linkTo, isLoading }: { linkTo: string; isLoading: boolean }) {
  const nav = useNavigate();

  return (
    <HStack justifyContent="center">
      <Button rightIcon={<ChevronRightIcon />} mt={2} isDisabled={isLoading} onClick={() => nav(linkTo)}>
        View More
      </Button>
    </HStack>
  );
}

function DisplayUpcomingMatches() {
  const { data, isLoading, error, refetch } = useGetMatches("UPCOMING", 6);

  if (error) <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Box>
      <Link to="upcoming" className="linkClass">
        Upcoming Matches <ChevronRightIcon />
      </Link>
      <CardGrid data={data?.pages[0].body} Card={UpNSumMatchesCard} isLoading={isLoading} custCol={[1, 1, 1, 2]} />
      <ViewMoreBtn linkTo="upcoming" isLoading={isLoading} />
    </Box>
  );
}

function DisplayMatchesSummary() {
  const { data, isLoading, error, refetch } = useGetMatches("SUMMARY", 6);

  if (error) <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Box>
      <Link to="summary" className="linkClass">
        Matches Summary <ChevronRightIcon />
      </Link>
      <CardGrid data={data?.pages[0].body} Card={UpNSumMatchesCard} isLoading={isLoading} custCol={[1, 1, 1, 2]} />
      <ViewMoreBtn linkTo="summary" isLoading={isLoading} />
    </Box>
  );
}

function DisplayLiveMatches() {
  const { data, isLoading, error, refetch } = useGetLiveMatches();

  if (isLoading) return;
  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Box>
      <Link to="live" className="linkClass colorClass">
        Live Matches <ChevronRightIcon />
      </Link>
      <Box
        w={["calc(100vw - 16px)", "calc(100vw - 32px)"]}
        maxW="100%"
        overflowX="auto"
        borderRadius={15}
        className="customScrollbar"
        mb={10}
        mt={4}
      >
        <Flex gap={3} pb={2} alignItems="center">
          {data?.pages &&
            data?.pages.length > 0 &&
            data?.pages.map((page) => page.body?.map((k) => <LiveMatchesCard {...k} />))}
        </Flex>
      </Box>
    </Box>
  );
}

export default Matches;
