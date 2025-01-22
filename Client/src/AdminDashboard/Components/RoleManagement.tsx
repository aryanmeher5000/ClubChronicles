import { Box, Text, Input, Heading, Divider, Select, Button, Flex } from "@chakra-ui/react";
import { Roles } from "../../staticData";
import { useEffect, useRef } from "react";
import { useAssignRole } from "../Hooks/useAssignRole";
import { useDeassignRole } from "../Hooks/useDeassignRole";

const RoleManagement = () => {
  return (
    <Box>
      <Heading textAlign="center">Role Management</Heading>
      <Divider mb={4} />

      <AssignRole />

      <Divider my={4} />

      <DeassignRole />
    </Box>
  );
};

function AssignRole() {
  const assignRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);
  const { mutate, isPending, isSuccess } = useAssignRole();

  useEffect(() => {
    if (isSuccess) assignRef.current!.value = "";
  }, [isSuccess]);

  return (
    <Box>
      <Text fontWeight={500} textAlign="center">
        Assign Role
      </Text>
      <form
        className="selectedForm"
        onSubmit={(e) => {
          e.preventDefault();
          if (assignRef.current?.value && roleRef.current?.value) {
            mutate({
              role: roleRef.current?.value,
              userId: assignRef.current?.value,
            });
          }
        }}
      >
        <Flex direction="column" alignItems="center">
          <Input placeholder="Enter userID" textAlign="center" my={2} w="250px" isRequired={true} ref={assignRef} />

          <Select placeholder="Select a role" my={2} isRequired={true} ref={roleRef} w="fit-content">
            {Object.entries(Roles).map(([ky, val]) => (
              <option key={ky} value={ky}>
                {val}
              </option>
            ))}
          </Select>

          <Button colorScheme="green" borderRadius={15} border="2px solid #e5e5e5" type="submit" isDisabled={isPending}>
            Assign
          </Button>
        </Flex>
      </form>
    </Box>
  );
}

function DeassignRole() {
  const deAssignRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending, isSuccess } = useDeassignRole();

  useEffect(() => {
    if (isSuccess) deAssignRef.current!.value = "";
  }, [isSuccess]);

  return (
    <Box>
      <Text fontWeight={500} textAlign="center">
        Deassign Role
      </Text>
      <form
        className="selectedForm"
        onSubmit={(e) => {
          e.preventDefault();
          if (deAssignRef.current?.value) {
            mutate({ userId: deAssignRef.current?.value });
          }
        }}
      >
        <Flex direction="column" alignItems="center">
          <Input placeholder="Enter userID" textAlign="center" my={2} w="250px" isRequired={true} ref={deAssignRef} />

          <Button colorScheme="red" borderRadius={15} border="2px solid #e5e5e5" m={2} type="submit" isDisabled={isPending}>
            Deassign
          </Button>
        </Flex>
      </form>
    </Box>
  );
}

export default RoleManagement;
