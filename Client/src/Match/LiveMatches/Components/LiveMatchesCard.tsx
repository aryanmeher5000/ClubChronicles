import { Flex, HStack, Tag, TagLabel, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LiveMatchData } from "../Hooks/useGetLiveMatches";

const LiveMatchesCard = ({ _id, team1, team2, gender, sport, tag, team1Score, team2Score, roomId }: LiveMatchData) => {
  const navigate = useNavigate();
  return (
    <Flex
      key={_id}
      className="card"
      minW={["85%", "85%", "65%", "45%", "33%"]}
      maxW="100%"
      onClick={() => navigate(`/matches/liveMatches/${roomId}`)}
    >
      <Text fontWeight={700} fontSize="xl" my={2}>
        {team1Score} - {team2Score}
      </Text>

      <Text fontWeight={700} fontSize="xl">
        {team1.name} VS {team2.name}
      </Text>

      <HStack my={3}>
        {tag && (
          <Tag size="sm" colorScheme="red">
            <TagLabel>{tag?.toUpperCase()}</TagLabel>
          </Tag>
        )}
        <Tag size="sm" colorScheme="blue">
          <TagLabel>{gender}</TagLabel>
        </Tag>
        <Tag size="sm" colorScheme="green">
          <TagLabel>{sport}</TagLabel>
        </Tag>
      </HStack>
    </Flex>
  );
};

export default LiveMatchesCard;
