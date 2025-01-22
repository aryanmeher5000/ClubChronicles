import { Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { useCheckAppliStatus } from "../../Team/Hooks/useCheckAppliStatus";
import { AddIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import useStartApplications from "../Hooks/useStartApplications";
import useStopApplications from "../Hooks/useStopApplications";
import { GrUpdate } from "react-icons/gr";
import useClientStateManagement from "../../store";

const DepartmentDashboard = () => {
  const { data, isLoading, error: appliStatErr } = useCheckAppliStatus();
  const { profile } = useClientStateManagement();
  const nav = useNavigate();

  return (
    <Flex direction="column" alignItems="center">
      <Heading textAlign="center">Department Management</Heading>
      <Divider mb={4} />

      <Button
        className="updateButton"
        leftIcon={<GrUpdate />}
        isDisabled={isLoading}
        onClick={() => nav(`updateDepartment/${profile?.department}`)}
      >
        Update Department Details
      </Button>
      <Divider my={4} />

      {appliStatErr && (
        <Text color="red.500" fontWeight={500}>
          Erro fetching application status!
        </Text>
      )}

      {data?.body && <StartApplications appliStatus={data?.body.applicationStatus} isLoading={false} />}

      {data?.body && <StopApplications appliStatus={data?.body.applicationStatus} isLoading={false} />}
    </Flex>
  );
};

function StartApplications({ appliStatus, isLoading }: { appliStatus: string; isLoading: boolean }) {
  const { mutate, isPending } = useStartApplications();
  return (
    <Button
      className="createButton"
      leftIcon={<AddIcon />}
      onClick={() => mutate("OPEN")}
      isDisabled={isPending || appliStatus === "OPEN" || isLoading}
    >
      Start Applications for your Department
    </Button>
  );
}

function StopApplications({ appliStatus, isLoading }: { appliStatus: string; isLoading: boolean }) {
  const { mutate, isPending } = useStopApplications();
  return (
    <Button
      className="deleteButton"
      my={4}
      leftIcon={<SmallCloseIcon />}
      onClick={() => mutate("CLOSED")}
      isDisabled={isPending || appliStatus === "CLOSED" || isLoading}
    >
      Stop Applications for your Department
    </Button>
  );
}

export default DepartmentDashboard;
