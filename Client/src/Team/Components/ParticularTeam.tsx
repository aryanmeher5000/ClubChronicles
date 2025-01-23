import { Box, Divider, Text, Flex, Heading, Avatar } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileCardData, useGetParticularTeam } from "../Hooks/useGetParticularTeam";
import useClientStateManagement from "../../store";
import SkeletonPage from "../../Utilities/SkeletonPage";
import ZoomableImage from "../../Utilities/ZoomableImage";
import TagStack from "../../Utilities/TagStack";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";
import { createImageUrlFromId } from "../../Utilities/utilFxns";

const ParticularTeam = () => {
  const { id } = useParams();
  const { data, error, isLoading, refetch } = useGetParticularTeam(id);
  const { profile } = useClientStateManagement();

  if (isLoading) return <SkeletonPage />;
  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Box>
      <Heading textAlign="center">{data?.body?.name}</Heading>
      <Divider mb={4} />

      {data?.body?.motto && (
        <>
          <Text fontSize="2.2vh" fontStyle="italic" p={1} textAlign="center">
            {data?.body?.motto && data?.body?.motto}
          </Text>
          <Divider mb={4} />
        </>
      )}

      {profile?.isAdmin && (
        <>
          <Text className="idStyle">Team ID : {data?.body?._id}</Text>
          <Divider mb={4} />
        </>
      )}

      <Flex direction={["column", "column", "row"]} alignItems="center" w="100%" gap={6}>
        <ZoomableImage imgSource={data?.body?.logo} />

        <Box flex={1}>
          <TagStack
            department={data?.body?.department.name}
            sport={data?.body?.sport}
            gender={data?.body?.gender}
            size="md"
          />
          <Divider my={2} />

          {data?.body.description && (
            <>
              <Text>{data?.body?.description}</Text>
              <Divider my={2} />
            </>
          )}

          <Text fontWeight="bold" fontSize="lg">
            Captain - {data?.body?.captain ? data.body?.captain.name : " Yet to be elected."}
          </Text>
          <Divider my={2} />

          <Text fontWeight="bold" fontSize="lg">
            Vice Captain - {data?.body?.viceCaptain ? data.body?.viceCaptain.name : " Yet to be elected."}
          </Text>
        </Box>
      </Flex>

      <Divider my={4} />

      <Text fontSize="lg" fontWeight="bold" textAlign="center">
        Players
      </Text>
      {(data?.body?.players && data?.body?.players.length > 0) || data?.body?.captain || data?.body?.viceCaptain ? (
        <Flex w="calc(100vw-32px)" gap={5} className="customScrollbar" justifyContent="center" alignItems="center" mt={2}>
          {data?.body?.captain && (
            <ProfileCard
              _id={data.body?.captain._id}
              name={data.body?.captain.name}
              profilePic={data.body?.captain.profilePic}
              role="CAPTAIN"
            />
          )}
          {data?.body?.viceCaptain && (
            <ProfileCard
              _id={data.body?.viceCaptain._id}
              name={data.body?.viceCaptain.name}
              profilePic={data.body?.viceCaptain.profilePic}
              role="VICE_CAPTAIN"
            />
          )}
          {data?.body?.players.map(
            (k) =>
              !(k._id === data.body?.captain._id || k._id === data.body?.viceCaptain._id) && (
                <ProfileCard key={k._id} _id={k._id} name={k.name} profilePic={k.profilePic} />
              )
          )}
        </Flex>
      ) : (
        <Text textAlign="center">Team Players are yet to be declared!</Text>
      )}
    </Box>
  );
};

const ProfileCard = ({ _id, name, profilePic, role }: ProfileCardData) => {
  const nav = useNavigate();
  return (
    <Flex key={_id} className="card" maxW="30vh" gap={3} onClick={() => nav(`/profile/${_id}`)}>
      <Avatar src={profilePic && createImageUrlFromId(profilePic)} size={["lg", "lg", "xl"]} variant="subtle" name={name} />
      <Text fontWeight="500" fontSize={["lg", "lg", "xl"]}>
        {name.slice(0, name.indexOf(" "))}
      </Text>

      {role && (
        <Text color="green.300" fontWeight={500}>
          {role === "CAPTAIN" ? "Captain" : "Vice Captain"}
        </Text>
      )}
    </Flex>
  );
};

export default ParticularTeam;
