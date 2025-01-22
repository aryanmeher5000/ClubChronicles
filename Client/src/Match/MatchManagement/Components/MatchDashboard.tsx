import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Button, Divider, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteMatch } from "../Hooks/useDeleteMatch";

const MatchDashboard = () => {
  const dltMatchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dltMatch = useDeleteMatch();

  useEffect(() => {
    if (dltMatch.isSuccess && dltMatchRef.current?.value) dltMatchRef.current.value = "";
  }, [dltMatch.isSuccess]);

  return (
    <Flex direction="column" alignItems="center">
      <Heading>Matches Dashboard</Heading>
      <Divider mb={4} />

      <Button colorScheme="green" leftIcon={<AddIcon />} onClick={() => navigate("createUpcomingMatch")}>
        Create New Upcoming Match
      </Button>

      <Divider my={4} />

      <Button colorScheme="green" leftIcon={<AddIcon />} onClick={() => navigate("createMatchSummary")}>
        Create New Match Summary
      </Button>

      <Divider my={4} />

      <Text py={2} fontWeight="500">
        Delete a Upcoming Match or Match Summary
      </Text>
      <Input w="250px" textAlign="center" placeholder="Enter an match's ID" ref={dltMatchRef} />
      <Button
        my={2}
        colorScheme="red"
        leftIcon={<DeleteIcon />}
        onClick={() => {
          if (dltMatchRef.current?.value.length === 24) dltMatch.mutate({ id: dltMatchRef?.current?.value });
        }}
      >
        Delete
      </Button>
    </Flex>
  );
};

export default MatchDashboard;
