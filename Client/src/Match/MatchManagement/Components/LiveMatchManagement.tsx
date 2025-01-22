import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import ErrorDisplay from "../../../ErrorPages/ErrorDisplay";
import CardGrid from "../../../Utilities/CardGrid";
import SkeletonCardsOnly from "../../../Utilities/SkeletonCardOnly";
import TagStack from "../../../Utilities/TagStack";
import { LiveMatchData } from "../../LiveMatches/Hooks/useGetLiveMatches";
import useCreateLiveMatchFromUpcoming from "../Hooks/useCreateLiveMatchFromUpcoming";
import { useGetActiveLiveMatches } from "../Hooks/useGetActiveLiveMatches";

const LiveMatchManagement = () => {
  const navigate = useNavigate();

  return (
    <Flex direction="column" alignItems="center">
      <Heading textAlign="center">Live Matches Management</Heading>
      <Divider mb={4} />

      <Button colorScheme="green" leftIcon={<AddIcon />} onClick={() => navigate("createLiveMatch")}>
        Create New Live Match
      </Button>

      <Divider my={4} />

      <LiveFromUpcoming />

      <Divider my={4} />

      <ActiveLiveMatches />
    </Flex>
  );
};

function ActiveLiveMatches() {
  const { data, error, isLoading, refetch } = useGetActiveLiveMatches();

  if (isLoading) return <SkeletonCardsOnly />;
  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Box w="100%">
      <Text fontWeight={500} textAlign="center">
        Your Active Live Matches
      </Text>
      <Text color="#f04d50" fontWeight={500} textAlign="center">
        (If these matches are over please enter the room and close the room)
      </Text>

      {data?.body && <CardGrid data={data.body} Card={LiveMatchesCard} isLoading={isLoading} />}
    </Box>
  );
}

function LiveFromUpcoming() {
  const upCmingMatchId = useRef<HTMLInputElement>(null);
  const crtLivMatch = useCreateLiveMatchFromUpcoming();

  return (
    <Flex w="100%" alignItems="center" direction="column">
      <Text fontWeight="500" mb={2} textAlign="center">
        GO LIVE using upcoming match's ID
      </Text>
      <Input w="250px" placeholder="Enter an upcoming match's ID" ref={upCmingMatchId} textAlign="center" />
      <Button
        mt={2}
        colorScheme="green"
        leftIcon={<AddIcon />}
        onClick={() => {
          if (upCmingMatchId.current?.value) crtLivMatch.createLiveMatch(upCmingMatchId.current.value);
        }}
      >
        Go Live
      </Button>
    </Flex>
  );
}

const LiveMatchesCard = ({ _id, team1, team2, gender, sport, tag, team1Score, team2Score, roomId }: LiveMatchData) => {
  const navigate = useNavigate();
  return (
    <Box
      key={_id}
      className="card"
      minW={["85%", "85%", "65%", "45%", "33%"]}
      maxW="100%"
      onClick={() => navigate(`/adminDashboard/liveMatchManagement/scoreUpdation/${roomId}`)}
    >
      <Text fontWeight={700} fontSize="xl" my={2}>
        {team1Score} - {team2Score}
      </Text>

      <Text fontWeight={700} fontSize="xl">
        {team1.name} VS {team2.name}
      </Text>

      <TagStack department={tag} gender={gender} sport={sport} />
    </Box>
  );
};

export default LiveMatchManagement;
