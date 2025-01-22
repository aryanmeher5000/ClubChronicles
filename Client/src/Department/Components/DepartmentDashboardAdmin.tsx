import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Button, Divider, Heading, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDeleteDepartment } from "../Hooks/useDeleteDepartment";
import useShowAlert from "../../useShowAlert";
import { GrUpdate } from "react-icons/gr";
import { DepartmentsCard } from "./Departments";
import useGetDepartments, { DepartmentCardProps } from "../Hooks/useGetDepartments";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";
import SkeletonCardsOnly from "../../Utilities/SkeletonCardOnly";

const DepartmentDashboardAdmin = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Heading textAlign="center">Department Management</Heading>
      <Divider mb={4} />

      <HStack justifyContent="center">
        <Button colorScheme="green" leftIcon={<AddIcon />} onClick={() => navigate("createDepartment")}>
          Create New Department
        </Button>
      </HStack>
      <Divider my={4} />

      <RenderDepartments />
    </Box>
  );
};

function RenderDepartments() {
  const { data, isLoading, error, refetch } = useGetDepartments();
  const { mutate, isPending } = useDeleteDepartment();

  const { open, AlertDialogComponent } = useShowAlert();

  const handleDeleteDepartment = (id: string) => {
    open({
      title: "Delete Department?",
      message:
        "Are you sure you want to delete this item? This action cannot be undone. Also, all teams and announcements related to this department will be deleted.",
      onConfirm: () => mutate({ id }),
      confirmText: "Yes, Delete",
      cancelText: "No, Cancel",
      isLoading: isPending,
    });
  };

  if (isLoading) return <SkeletonCardsOnly />;
  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;
  return (
    <Box>
      <Text fontWeight={500} mb={4} textAlign="center">
        Manage Departments
      </Text>
      {data?.body && data?.body.length > 0 ? (
        <SimpleGrid columns={[1, 1, 2, 3]} gap={4}>
          {data.body.map((dept) => (
            <DepartmentUpdateDeleteCard
              key={dept._id}
              isDisabled={isPending}
              handleDeleteFxn={handleDeleteDepartment}
              _id={dept._id}
              name={dept.name}
              logo={dept.logo}
            />
          ))}
        </SimpleGrid>
      ) : (
        <SimpleGrid p={8} placeItems="center">
          <Text>Departments are yet to be declared.</Text>
        </SimpleGrid>
      )}
      <AlertDialogComponent />
    </Box>
  );
}

interface DepUpdDelCard extends DepartmentCardProps {
  isDisabled: boolean;
  handleDeleteFxn: (id: string) => void;
}

function DepartmentUpdateDeleteCard({ _id, name, logo, isDisabled, handleDeleteFxn }: DepUpdDelCard) {
  const nav = useNavigate();

  return (
    <Box key={_id} borderRadius={15} p={1}>
      <DepartmentsCard _id={_id} name={name} logo={logo} />
      <HStack justifyContent="center" alignItems="center" my={2} gap={5}>
        <Button
          colorScheme="yellow"
          leftIcon={<GrUpdate />}
          isDisabled={isDisabled}
          onClick={() => nav(`updateDepartment/${_id}`)}
        >
          Update
        </Button>
        <Button colorScheme="red" leftIcon={<DeleteIcon />} onClick={() => handleDeleteFxn(_id)} isDisabled={isDisabled}>
          Delete
        </Button>
      </HStack>
    </Box>
  );
}

export default DepartmentDashboardAdmin;
