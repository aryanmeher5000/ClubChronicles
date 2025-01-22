import { Box, Divider, Text, Flex, Heading } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import SkeletonPage from "../../Utilities/SkeletonPage";
import { useGetParticularDepartment } from "../Hooks/useGetParticularDepartment";
import ZoomableImage from "../../Utilities/ZoomableImage";
import useClientStateManagement from "../../store";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";

const ParticularDepartment = () => {
  const { id } = useParams();
  const { data, error, isLoading, refetch } = useGetParticularDepartment(id);

  const profile = useClientStateManagement((p) => p.profile);

  if (isLoading) return <SkeletonPage />;
  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Box>
      <Heading textAlign="center">{data?.body?.name}</Heading>
      <Divider mb={4} />
      {profile?.isAdmin && (
        <>
          <Text className="idStyle">Department Id : {data?.body._id}</Text>
          <Divider mb={4} />
        </>
      )}

      <Flex flexDir={["column", "row"]} alignItems={["center", "center", "flex-start"]} gap={6}>
        <ZoomableImage imgSource={data?.body.logo} />

        <Box flex={1}>
          <Text fontSize="2xl" fontWeight="bold">
            GC Won - {data?.body.gcWon || 0}
          </Text>
          <Divider my={2} />

          {data?.body.about && (
            <Text fontWeight={500} fontSize="md">
              About
            </Text>
          )}
          <Text>{data?.body.about}</Text>
          <Divider my={2} />

          <Text fontSize="lg" fontWeight="medium">
            Sports Lead - {data?.body.sportsLead ? data.body.sportsLead : " Yet to be elected."}
          </Text>
        </Box>
      </Flex>
      <Divider my={4} />
    </Box>
  );
};

export default ParticularDepartment;
