import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { MdOutlineManageAccounts } from "react-icons/md";
import TeamsCard from "./TeamsCard";
import { useDeleteTeam } from "../Hooks/useDeleteTeam";
import useGetTeamUpdNDel from "../Hooks/useGetTeamsForUpdate";
import SkeletonCardsOnly from "../../Utilities/SkeletonCardOnly";
import useShowAlert from "../../useShowAlert";
import CardGrid from "../../Utilities/CardGrid";
import { GrUpdate } from "react-icons/gr";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";
import { TeamsCardProps } from "../Hooks/useGetTeams";

const TeamDashboard = () => {
  const navigate = useNavigate();

  return (
    <Flex alignItems="center" direction="column">
      <Heading>Team Management</Heading>
      <Divider mb={4} />

      <Button className="createButton" leftIcon={<AddIcon />} onClick={() => navigate("createTeam")}>
        Create New Team
      </Button>
      <Divider my={4} />

      <Text fontWeight={500}>Update team details</Text>
      <ManageTeams />
    </Flex>
  );
};

const ManageTeams = () => {
  const nav = useNavigate();
  const { mutate, isPending } = useDeleteTeam();
  const { open, AlertDialogComponent } = useShowAlert();
  const { data, error, isLoading, refetch } = useGetTeamUpdNDel();

  function handleDelete(id: string) {
    open({
      message: "Are yousure you want to delete this team? This action is irreversible.",
      onConfirm: () => mutate({ id }),
      isLoading: isPending,
    });
  }

  if (isLoading) return <SkeletonCardsOnly />;
  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  function cardsMapper(data: TeamsCardProps) {
    return (
      <Box border="2px solid #333" borderRadius={20} p={1} w="100%" key={data._id}>
        <TeamsCard
          _id={data._id}
          name={data.name}
          department={data.department}
          sport={data.sport}
          logo={data.logo}
          gender={data.gender}
        />
        <HStack mt={2} gap={2} justifyContent="space-evenly">
          <Button
            className="updateButton"
            leftIcon={<GrUpdate />}
            onClick={() => nav(`updateTeam/${data._id}`)}
            isDisabled={isPending || isLoading}
          >
            Update
          </Button>
          <Button
            className="deleteButton"
            leftIcon={<DeleteIcon />}
            onClick={() => handleDelete(data._id)}
            isDisabled={isPending || isLoading}
          >
            Delete
          </Button>
          <Button
            className="createButton"
            leftIcon={<MdOutlineManageAccounts />}
            onClick={() => nav(`manageTeam/${data._id}`)}
            isDisabled={isPending || isLoading}
          >
            Manage
          </Button>
        </HStack>
      </Box>
    );
  }
  return (
    <Box w="100%">
      <CardGrid data={data?.body} Card={cardsMapper} isLoading={isLoading} />
      <AlertDialogComponent />
    </Box>
  );
};

export default TeamDashboard;
