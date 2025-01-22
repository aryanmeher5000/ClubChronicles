import { Box, Flex, List, ListItem, Text } from "@chakra-ui/react";
import useGetDepartments from "../Department/Hooks/useGetDepartments";
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";

const SelectDepartment = () => {
  const { data, isLoading, error } = useGetDepartments();
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState("Select Department");

  return (
    <Box>
      <Flex
        borderRadius={20}
        p={2}
        px={4}
        alignItems="center"
        justifyContent="space-between"
        bg="#222"
        _hover={{ bg: "#333" }}
        cursor="pointer"
        gap={2}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <Text>{current}</Text>
        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </Flex>
      {isOpen && (
        <List
          borderRadius={5}
          bg="#181818"
          maxH="250px"
          overflow="auto"
          zIndex={1000}
          position="fixed"
          role="menu"
          className="scrollBarHidden"
        >
          {isLoading ? (
            <ListItem>Loading departments...</ListItem>
          ) : error ? (
            <ListItem>Failed to load departments. Please try again.</ListItem>
          ) : data?.body && data.body.length > 0 ? (
            data.body.map((dep) => (
              <ListItem
                key={dep._id}
                borderBottom="1px solid #222"
                p={2}
                cursor="pointer"
                role="menuitem"
                onClick={() => {
                  setCurrent(dep.name);
                  setIsOpen(false);
                }}
              >
                {dep.name}
              </ListItem>
            ))
          ) : (
            <ListItem>Departments are yet to be declared.</ListItem>
          )}
        </List>
      )}
    </Box>
  );
};

export default SelectDepartment;
