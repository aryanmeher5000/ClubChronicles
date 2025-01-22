import { Flex, HStack, Select } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { debounce } from "lodash";
import { Genders, Sports } from "../staticData";
import useGetDepartments from "../Department/Hooks/useGetDepartments";

export interface Query {
  department?: string;
  sport?: string;
  gender?: string;
}

interface Props {
  query: Query;
  setQuery: React.Dispatch<React.SetStateAction<Query>>;
  isDisabled?: boolean;
}

const DebouncedFilter = ({ query, setQuery, isDisabled }: Props) => {
  const { data, isLoading } = useGetDepartments();
  const queryRef = useRef(query); // Use ref to avoid stale closures

  useEffect(() => {
    queryRef.current = query; // Keep the ref updated with the latest query
  }, [query]);

  const debouncedUpdate = debounce((field: keyof Query, value: string) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      [field]: value,
    }));
  }, 2000);

  const handleChange = (field: keyof Query, value: string) => {
    queryRef.current = { ...queryRef.current, [field]: value }; // Update the ref
    debouncedUpdate(field, value); // Trigger debounced update
  };

  useEffect(() => {
    return () => {
      debouncedUpdate.cancel(); // Clean up debounce on unmount
    };
  }, [debouncedUpdate]);

  return (
    <Flex justifyContent="center">
      <HStack justifyContent="space-between" mb={4} gap={4} w={["100%", "100%", "70%"]}>
        <Select
          placeholder="Department"
          onChange={(e) => handleChange("department", e.target.value)}
          isDisabled={isDisabled || isLoading}
        >
          {data?.body && data.body.length > 0 ? (
            data.body.map((dep) => (
              <option key={dep._id} value={dep._id}>
                {dep.name}
              </option>
            ))
          ) : (
            <option disabled>Error Loading Departments</option>
          )}
        </Select>

        <Select placeholder="Gender" onChange={(e) => handleChange("gender", e.target.value)} isDisabled={isDisabled}>
          {Object.entries(Genders).map(([ky, val]) => (
            <option key={ky} value={ky}>
              {val}
            </option>
          ))}
        </Select>

        <Select placeholder="Sport" onChange={(e) => handleChange("sport", e.target.value)} isDisabled={isDisabled}>
          {Object.entries(Sports).map(([ky, val]) => (
            <option key={ky} value={ky}>
              {val}
            </option>
          ))}
        </Select>
      </HStack>
    </Flex>
  );
};

export default DebouncedFilter;
