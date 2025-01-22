import { Box, Button, Divider, Heading, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import { FaWpforms } from "react-icons/fa6";
import { LuUndo2 } from "react-icons/lu";
import TeamsCard from "../../Team/Components/TeamsCard";
import SkeletonCardsPage from "../../Utilities/SkeletonCardsPage";
import { useApplyForTeam } from "../Hooks/useApplyForTeam";
import { Application, useGetApplications } from "../Hooks/useGetApplicationsForTeam";
import { useUnapplyForTeam } from "../Hooks/useUnapplyForTeam";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";

const Applications = () => {
  const { data, isLoading, error, refetch } = useGetApplications();
  const { mutate: apply, isPending: isApplying } = useApplyForTeam();
  const { mutate: unapply, isPending: isUnapplying } = useUnapplyForTeam();

  const eligibleTeams = data?.body?.filter((team) => team.status === "ELIGIBLE") || [];
  const appliedTeams = data?.body?.filter((team) => team.status === "APPLIED") || [];
  const acceptedTeams = data?.body?.filter((team) => team.status === "ACCEPTED") || [];

  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;
  if (isLoading) return <SkeletonCardsPage incFilter={false} />;

  return (
    <Box>
      <Heading textAlign="center">Applications</Heading>

      <Divider mb={4} />

      <Heading textAlign="center" fontSize="x-large" mb={4}>
        Apply For
      </Heading>
      {eligibleTeams.length > 0 ? (
        <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap="2vh" mb={5}>
          {eligibleTeams.map((team) =>
            renderTeamCard(
              team,
              "Apply",
              () => apply({ teamId: team._id }),
              isApplying || appliedTeams.length + acceptedTeams.length >= 3
            )
          )}
        </SimpleGrid>
      ) : (
        <Text textAlign="center" fontSize="small">
          No applicable teams at this moment.
        </Text>
      )}

      <Divider my={4} />

      <Heading textAlign="center" fontSize="x-large" mb={4}>
        Applied To
      </Heading>
      {appliedTeams.length > 0 ? (
        <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap="2vh" mb={6}>
          {appliedTeams.map((team) =>
            renderTeamCard(team, "Unapply", () => unapply({ applicationId: team.applicationId! }), isUnapplying)
          )}
        </SimpleGrid>
      ) : (
        <Text textAlign="center" fontSize="small">
          You haven't applied to any team yet
        </Text>
      )}

      <Divider my={4} />

      <Heading textAlign="center" fontSize="x-large" mb={4}>
        Accepted In
      </Heading>
      {acceptedTeams.length > 0 ? (
        <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap="2vh" mt={6}>
          {acceptedTeams.map((team) => (
            <TeamsCard
              key={team._id}
              _id={team._id}
              name={team.name}
              department={team.department}
              sport={team.sport}
              gender={team.gender}
              logo={team.logo}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Text textAlign="center" fontSize="small">
          You haven't been accpeted in any team yet
        </Text>
      )}
    </Box>
  );
};

const renderTeamCard = (team: Application, buttonText: string, onClickAction: () => void, disabled: boolean) => (
  <Box key={team._id} border="2px solid #f04d50" p={1} borderRadius={20}>
    <TeamsCard
      _id={team._id}
      name={team.name}
      department={team.department}
      sport={team.sport}
      gender={team.gender}
      logo={team.logo}
    />
    <HStack w="100%" justifyContent="center">
      <Button
        border="2px solid #e5e5e5"
        bg={buttonText === "Apply" ? "#03b57b" : "red.500"}
        color="whitesmoke"
        borderRadius={15}
        px={4}
        py={2}
        mb={2}
        h="fit-content"
        mt={2}
        leftIcon={buttonText === "Apply" ? <FaWpforms /> : <LuUndo2 />}
        isDisabled={disabled}
        onClick={onClickAction}
        aria-label={`${buttonText} to ${team.name}`}
      >
        {buttonText}
      </Button>
    </HStack>
  </Box>
);

export default Applications;
