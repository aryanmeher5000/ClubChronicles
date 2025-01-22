import { Box, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { GrUpdate } from "react-icons/gr";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useNavigate, useParams } from "react-router-dom";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";
import SkeletonPage from "../../Utilities/SkeletonPage";
import TagStack from "../../Utilities/TagStack";
import ZoomableImage from "../../Utilities/ZoomableImage";
import { ProfileData, useGetProfile } from "../Hooks/useGetProfile";
import PopOverForDeletePassword from "./PopOverForDeleteProfile";
import PopOverToUpdatePassword from "./PopOverToUpdatePass";

const Profile = () => {
  const { id } = useParams();
  const { data, error, isLoading, refetch } = useGetProfile(id);

  if (isLoading) return <SkeletonPage />;
  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Box>
      <Heading textAlign="center">{data?.body.name}</Heading>
      <Divider mb={4} />

      <Text className="idStyle">Profile ID: {data?.body._id}</Text>
      <Divider mb={4} />

      <Flex flexDir={["column", "row"]} alignItems="center" gap={6}>
        <ZoomableImage imgSource={data?.body.profilePic} />

        <Flex flex={1} alignItems={["center", "center", "flex-start"]} direction="column">
          <TagStack department={data?.body.department?.name} gender={data?.body.gender} size="lg" />
          <Divider my={2} />

          {data?.body.about && (
            <Text fontWeight={500} fontSize="md">
              About
            </Text>
          )}
          <Text>{data?.body.about}</Text>
          <Divider my={2} />

          {data?.body.achievements && (
            <Text fontWeight={500} fontSize="md">
              Achievements
            </Text>
          )}
          <Text>{data?.body?.achievements}</Text>
        </Flex>
      </Flex>

      <Divider my={4} />

      {id === "ownProfile" && <DisplayButtons data={data?.body} />}
    </Box>
  );
};

function DisplayButtons({ data }: { data?: ProfileData }) {
  const nav = useNavigate();
  return (
    <Flex
      flexDir={["column", "column", "row"]}
      fontWeight={500}
      p={2}
      justifyContent="space-evenly"
      alignItems="center"
      my={4}
      gap={3}
      w="100%"
    >
      <Button colorScheme="green" leftIcon={<GrUpdate />} onClick={() => nav("updateProfile", { state: data })} w="250px">
        Update Profile
      </Button>

      <PopOverToUpdatePassword />

      <Button colorScheme="red" leftIcon={<RiLogoutCircleLine />} onClick={() => nav("/logout")} w="250px">
        Logout
      </Button>

      <PopOverForDeletePassword />
    </Flex>
  );
}

export default Profile;
