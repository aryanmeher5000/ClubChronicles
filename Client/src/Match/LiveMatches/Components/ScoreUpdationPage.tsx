import { Button, Flex, HStack, Icon, Input, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import useUpdateScore from "../Hooks/useUpdateScore";
import { LuSwords } from "react-icons/lu";
import useRoomDataManagement from "../Hooks/useRoomDataManagement";
import SkeletonPage from "../../../Utilities/SkeletonPage";
import PopupToChooseWinningTeam from "./PopupToChooseWinningTeam";
import useClientStateManagement from "../../../store";
import { UpdateScoreData } from "../../socketService";

const ScoreUpdationPage = () => {
  const inpRef = useRef<HTMLInputElement>(null);
  const profile = useClientStateManagement((p) => p.profile);
  const { roomId } = useParams();
  const { updateScore, isLoading } = useUpdateScore();
  const { data, isLoading: dataLoding, error } = useRoomDataManagement(roomId);

  if (dataLoding) return <SkeletonPage withImage={false} />;
  if (error) {
    return (
      <Text fontWeight={500} textAlign="center" color="red" p={5}>
        {error}
      </Text>
    );
  }

  //Handle update function
  function handleUpdate(team: "TEAM1" | "TEAM2", score: string) {
    const updData: UpdateScoreData = {
      team: team,
      score: score,
      scoreUpdater: profile?._id,
      roomId: roomId,
    };
    updateScore(updData);
  }

  return (
    <Flex justifyContent="center" alignItems="center" direction="column" gap={5}>
      <Flex border="1px solid #f04d50" borderRadius={15} p={5} w={["100%", "100%", "50%"]} justifyContent="space-evenly">
        <Text fontSize="4vh" fontWeight={700}>
          {data?.team1Score}
        </Text>

        <Icon as={LuSwords} fontSize="6vh" color="#f04d50" />

        <Text fontSize="4vh" fontWeight={700}>
          {data?.team2Score}
        </Text>
      </Flex>

      <Flex
        border="1px solid #f04d50"
        borderRadius={15}
        p={5}
        minW={["100%", "100%", "50%"]}
        gap={4}
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Text fontSize="2xl" fontWeight={700}>
          {data?.team1.name}
        </Text>

        <Icon as={LuSwords} fontSize="6vh" color="#f04d50" />

        <Text fontSize="2xl" fontWeight={700}>
          {data?.team2.name}
        </Text>
      </Flex>

      <Input placeholder="Enter Score" w={["100%", "100%", "30%"]} p={6} textAlign="center" isRequired ref={inpRef} />
      <HStack alignItems="center" gap={10}>
        <Button
          colorScheme="green"
          isDisabled={isLoading}
          onClick={() => {
            if (inpRef.current?.value) handleUpdate("TEAM1", inpRef.current.value);
          }}
        >
          Team1
        </Button>

        <Button
          colorScheme="green"
          isDisabled={isLoading}
          onClick={() => {
            if (inpRef.current?.value) handleUpdate("TEAM2", inpRef.current.value);
          }}
        >
          Team2
        </Button>
      </HStack>

      <PopupToChooseWinningTeam roomId={roomId!} />
    </Flex>
  );
};

export default ScoreUpdationPage;
