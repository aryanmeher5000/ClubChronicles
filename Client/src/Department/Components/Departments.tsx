import { Avatar, Box, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import SkeletonCardsPage from "../../Utilities/SkeletonCardsPage";
import CardGrid from "../../Utilities/CardGrid";
import useGetDepartments, { DepartmentCardProps } from "../Hooks/useGetDepartments";
import { useNavigate } from "react-router-dom";
import { createImageUrlFromId } from "../../Utilities/utilFxns";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";

const Departments = () => {
  const { data, isLoading, error, refetch } = useGetDepartments();

  if (isLoading) return <SkeletonCardsPage incFilter={false} />;
  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Box>
      <Heading textAlign="center">Departments</Heading>
      <Divider mb={4} />

      <CardGrid<DepartmentCardProps> data={data?.body} Card={DepartmentsCard} isLoading={isLoading} />
    </Box>
  );
};

export const DepartmentsCard = ({ _id, name, logo }: DepartmentCardProps) => {
  const navigate = useNavigate();
  return (
    <Flex key={_id} className="card" gap={2} onClick={() => navigate(`/departments/${_id}`)}>
      <Avatar name={name} src={logo && createImageUrlFromId(logo)} size="lg" border="2px solid #c5c5c5" />
      <Text fontSize="2xl" fontWeight={700} textAlign="center">
        {name}
      </Text>
    </Flex>
  );
};

export default Departments;
