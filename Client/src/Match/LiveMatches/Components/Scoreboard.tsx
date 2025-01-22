import { Button, Divider, Flex, Heading, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { LuSwords } from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
import useRoomDataManagement from "../Hooks/useRoomDataManagement";
import { readableDate } from "../../../Utilities/utilFxns";
import { TeamCard } from "../../UpNSumMatches/Components/UpNSumMatchesCard";
import LoadingSpinner from "../../../Utilities/LoadingSpinner";

const Scoreboard = () => {
  const { roomId } = useParams();
  const { data, isLoading, error } = useRoomDataManagement(roomId);
  const nav = useNavigate();
  const border = useColorModeValue("#333", "#999");

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <Text fontWeight={500} textAlign="center" color="red">
        {error}
      </Text>
    );
  }
  if (!data || !data.team1) return null;

  return (
    <Flex flexDir="column" alignItems="center">
      <Heading>Live Match</Heading>
      <Divider mb={4} />

      <Flex
        border={`2px solid ${border}`}
        borderRadius={15}
        p={5}
        w={["100%", "100%", "50%"]}
        justifyContent="space-evenly"
        mb={4}
      >
        <Text fontSize="2xl" fontWeight={700}>
          {data.team1Score}
        </Text>

        <Icon as={LuSwords} fontSize="3xl" color="#f04d50" />

        <Text fontSize="2xl" fontWeight={700}>
          {data.team2Score}
        </Text>
      </Flex>

      <Flex
        border={`2px solid ${border}`}
        borderRadius={15}
        minW={["100%", "100%", "50%"]}
        gap={4}
        mb={4}
        justifyContent="space-evenly"
        alignItems="center"
      >
        <TeamCard teamId={data.team1._id} teamName={data.team1.name} teamLogo={data.team1.logo} />

        <Icon as={LuSwords} fontSize="3xl" color="#f04d50" />

        <TeamCard teamId={data.team2._id} teamName={data.team2.name} teamLogo={data.team2.logo} />
      </Flex>

      <Flex
        flexDir="column"
        border={`2px solid ${border}`}
        w={["100%", "100%", "60%", "50%"]}
        borderRadius={15}
        p={4}
        gap={4}
        alignItems="center"
        textAlign="center"
      >
        <Text>Venue : {data.venue ? data.venue : " No venue provided!"}</Text>
        <Divider />
        <Text>
          ScheduledAt:
          {data.date && readableDate(data.date)} - {data.time} : {" No schedule provided!"}
        </Text>
        <Divider />
        <Text>Room ID : {data.roomId}</Text>
      </Flex>

      <Heading fontSize="3xl" className="blink" my={4}>
        LIVE NOW
      </Heading>

      <Button colorScheme="red" onClick={() => nav(-1)}>
        Leave
      </Button>
    </Flex>
  );
};

export default Scoreboard;
