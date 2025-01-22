import { Box, Button, Divider, Flex, Heading, HStack, Input, SimpleGrid, Text } from "@chakra-ui/react";
import AnnouncementsCard from "./AnnouncementsCard";
import useGetOwnAnnouncements from "../Hooks/useGetOwnAnnouncements";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { useDeleteAnnouncement } from "../Hooks/useDeleteAnnouncement";
import { widthObj } from "../../staticData";
import { useRef } from "react";
import useShowToast from "../../useShowToast";
import useShowAlert from "../../useShowAlert";
import useClientStateManagement from "../../store";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";
import SkeletonCardsOnly from "../../Utilities/SkeletonCardOnly";

const AnnouncementDashBoard = () => {
  const navigate = useNavigate();
  const { profile } = useClientStateManagement();

  return (
    <Flex alignItems="center" direction="column">
      <Heading textAlign="center">Announcement Dashboard</Heading>
      <Divider mb={4} />

      <Button colorScheme="green" leftIcon={<AddIcon />} onClick={() => navigate("createAnnouncement")}>
        Create an Announcement
      </Button>
      <Divider my={4} />

      {profile?.role === "ADMIN" && <AdminAnnouncementDelete />}

      <OwnAnnouncementsGrid />
    </Flex>
  );
};

function AdminAnnouncementDelete() {
  const inpRef = useRef<HTMLInputElement>(null);
  const showToast = useShowToast();
  const { mutate, isPending, isSuccess } = useDeleteAnnouncement();

  return (
    <Flex w="100%" alignItems="center" direction="column">
      <Text fontWeight={500} mb={2}>
        Delete any announcement
      </Text>
      <Input placeholder="Enter Announcement ID" w={widthObj} my={2} ref={inpRef} textAlign="center" />
      <Button
        colorScheme="red"
        leftIcon={<DeleteIcon />}
        onClick={() => {
          if (inpRef.current?.value && inpRef.current?.value.length == 24) {
            mutate({ id: inpRef.current.value });
            if (isSuccess) inpRef.current.value = "";
          } else {
            showToast("info", "Invalid announcement ID!");
          }
        }}
        isDisabled={isPending}
      >
        Delete
      </Button>

      <Divider my={4} />
    </Flex>
  );
}

function OwnAnnouncementsGrid() {
  const { data, isLoading, error, refetch } = useGetOwnAnnouncements();
  const { mutate, isPending } = useDeleteAnnouncement();

  // Custom AlertDialog hook
  const { open, AlertDialogComponent } = useShowAlert();
  // Function to handle delete confirmation
  const handleDelete = (id: string) => {
    open({
      message: "Are you sure you want to delete this announcement?",
      onConfirm: () => mutate({ id }),
    });
  };

  if (isLoading) return <SkeletonCardsOnly />;
  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Flex w="100%" alignItems="center" direction="column">
      <Text fontWeight="semibold" textAlign="center" mb={4}>
        Announcement's made by you
      </Text>

      {data && data?.body?.length > 0 ? (
        <SimpleGrid columns={[1, 1, 2, 3]} gap={4} w="100%" h="fit-content">
          {data?.body?.map((k) => (
            <Box key={k._id} p={1} borderRadius={20}>
              <AnnouncementsCard
                _id={k._id}
                title={k.title}
                department={k.department}
                sport={k.sport}
                gender={k.gender}
                createdAt={k.createdAt}
              />
              <HStack my={2} justifyContent="center">
                <Button
                  colorScheme="red"
                  leftIcon={<DeleteIcon />}
                  onClick={() => handleDelete(k._id)}
                  isDisabled={isPending}
                >
                  Delete
                </Button>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Text p={4} textAlign="center">
          You haven't made any announcements.
        </Text>
      )}

      <AlertDialogComponent />
    </Flex>
  );
}

export default AnnouncementDashBoard;
