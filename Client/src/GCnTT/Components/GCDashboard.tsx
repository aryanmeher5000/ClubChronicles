import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Flex, Heading, Input, Select, SimpleGrid, Text } from "@chakra-ui/react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import useGetDepartments from "../../Department/Hooks/useGetDepartments";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";
import useShowAlert from "../../useShowAlert";
import SkeletonCardsOnly from "../../Utilities/SkeletonCardOnly";
import useCreateCurrentGCSession from "../Hooks/useCreateCurrentGCSession";
import { useDeleteGCSession } from "../Hooks/useDeleteGCSession";
import { useGetGCRecords } from "../Hooks/useGetGCSRecords";
import usePointTableUpdate from "../Hooks/usePointTableUpdate";
import { GCCard } from "./GCArchive";

const GCDashboard = () => {
  return (
    <Box>
      <Heading textAlign="center">GC & Point Table Management</Heading>
      <Divider mb={4} />

      <UpdatePT />

      <ManageCurrentGC />

      <ManageGCRecords />
    </Box>
  );
};

function ManageCurrentGC() {
  const { mutate, isPending } = useCreateCurrentGCSession();
  return (
    <Flex direction="column" alignItems="center">
      <Button colorScheme="green" leftIcon={<AddIcon />} onClick={() => mutate({})} isDisabled={isPending}>
        Create Current GC
      </Button>

      <Divider my={4} />

      <Button colorScheme="teal" border="2px solid #e5e5e5" fontWeight={500} borderRadius={20} isDisabled={isPending}>
        Settle Current GC
      </Button>

      <Divider my={4} />
    </Flex>
  );
}

function UpdatePT() {
  const { mutate, isPending } = usePointTableUpdate();
  const { data, isLoading } = useGetDepartments();
  const dptRef = useRef<HTMLSelectElement>(null);
  const inpRef = useRef<HTMLInputElement>(null);

  function handlePointTableUpdate() {
    if (dptRef.current?.value && inpRef.current?.value) {
      mutate({
        id: dptRef?.current?.value,
        data: {
          points: inpRef.current?.value,
        },
      });
    }
  }
  return (
    <Flex direction="column" alignItems="center">
      <Text fontWeight={700} fontSize="2xl">
        Manage Point Table
      </Text>
      <Select placeholder="Select Department" w="fit-content" textAlign="center" my={2} ref={dptRef} disabled={isLoading}>
        {data?.body.map((k) => (
          <option key={k._id} value={k._id}>
            {k.name}
          </option>
        ))}
      </Select>
      <Input placeholder="New Score" textAlign="center" my={2} width="150px" type="number" min={0} max={500} ref={inpRef} />
      <Button colorScheme="yellow" onClick={handlePointTableUpdate} isDisabled={isPending}>
        {isPending ? "Updating" : "Update"}
      </Button>

      <Divider my={4} />
    </Flex>
  );
}

function ManageGCRecords() {
  const { data, isLoading, error, refetch } = useGetGCRecords();
  const { open, AlertDialogComponent } = useShowAlert();
  const { mutate, isPending } = useDeleteGCSession();
  const nav = useNavigate();
  function handleDelete(id: string) {
    open({
      title: "Are you sure?",
      message: "Are you sure you want to delete this record? This action is irreversible.",
      onConfirm: () => mutate({ id }),
      isLoading: isPending,
    });
  }

  if (isLoading) return <SkeletonCardsOnly />;
  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Flex alignItems="center" direction="column">
      <Button colorScheme="green" w="300px" leftIcon={<AddIcon />} onClick={() => nav("createGCRecord")}>
        Create GC Archive Record
      </Button>
      <Divider my={4} />

      <Heading fontSize="xl" mb={4}>
        Manage GC Archive
      </Heading>
      {data?.body && data?.body.length > 0 ? (
        <SimpleGrid columns={[1, 1, 1, 2]} gap={4}>
          {data?.body.map((k) => (
            <Flex key={k._id} flexDir="column" alignItems="center">
              <GCCard key={k._id} _id={k._id} year={k.year} wonBy={k.wonBy} teamPic={k.teamPic} isCurrent={k.isCurrent} />
              <Button className="deleteButton" mt={2} onClick={() => handleDelete(k._id)} isDisabled={isPending}>
                Delete
              </Button>
            </Flex>
          ))}
        </SimpleGrid>
      ) : (
        <Text p={4} textAlign="center">
          No records currently available.
        </Text>
      )}
      <AlertDialogComponent />
    </Flex>
  );
}

export default GCDashboard;
