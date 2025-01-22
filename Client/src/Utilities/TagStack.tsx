import { Text, HStack, Tag } from "@chakra-ui/react";

const TagStack = ({
  title,
  department,
  sport,
  gender,
  size,
}: {
  title?: string;
  department?: string;
  sport?: string;
  gender?: string;
  size?: "sm" | "md" | "lg";
}) => {
  return (
    <HStack gap={2} my={2}>
      {title && <Text fontWeight={500}>{title} </Text>}
      {department && (
        <Tag size={size || "md"} key="department" variant="subtle" colorScheme="orange">
          {department || "ALL"}
        </Tag>
      )}
      {gender && (
        <Tag size={size || "md"} key="gender" variant="subtle" colorScheme="blue">
          {gender || "ALL"}
        </Tag>
      )}
      {sport && (
        <Tag size={size || "md"} key="sport" variant="subtle" colorScheme="green">
          {sport || "ALL"}
        </Tag>
      )}
    </HStack>
  );
};

export default TagStack;
