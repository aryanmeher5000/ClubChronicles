import { Flex, FormControl, FormErrorMessage, FormLabel, Select } from "@chakra-ui/react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";
import useGetDepartments from "../Department/Hooks/useGetDepartments";
import { Genders, Sports } from "../staticData";

interface Props {
  label?: string;
  isReq: boolean;
  registerDept?: UseFormRegisterReturn<string>;
  registerGender?: UseFormRegisterReturn<string>;
  registerSport?: UseFormRegisterReturn<string>;
  errDept?: FieldError;
  errYear?: FieldError;
  errSport?: FieldError;
  inclSport?: boolean;
  inclDept?: boolean;
  inclGender?: boolean;
  width?: string | string[];
  disableDept?: boolean;
  disableGender?: boolean;
  deptValue?: string;
}

const DeptSprtYear = ({
  label,
  registerDept,
  registerGender,
  errDept,
  errYear,
  isReq,
  inclDept = true,
  inclGender = true,
  inclSport = true,
  registerSport,
  errSport,
  disableGender,
  disableDept,
  deptValue,
}: Props) => {
  const { data, isLoading } = useGetDepartments();
  return (
    <Flex flex={1} alignItems="center" justifyContent="space-between" mb={4} gap={4}>
      {label && <FormLabel>{label}</FormLabel>}

      {inclDept && (
        <FormControl isRequired={isReq} isInvalid={!!errDept} isDisabled={disableDept}>
          <Select placeholder="Department" fontWeight={500} {...registerDept} value={deptValue} disabled={isLoading}>
            {data?.body ? (
              data.body.map((dep) => (
                <option key={dep._id} value={dep._id}>
                  {dep.name}
                </option>
              ))
            ) : (
              <option disabled>Error Loading Departments</option>
            )}
          </Select>
          <FormErrorMessage>{errDept?.message}</FormErrorMessage>
        </FormControl>
      )}

      {inclGender && (
        <FormControl isRequired={isReq} isInvalid={!!errYear} isDisabled={disableGender}>
          <Select placeholder="Gender" {...registerGender}>
            {Object.entries(Genders).map(([ky, val]) => (
              <option key={ky} value={ky}>
                {val}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errYear?.message}</FormErrorMessage>
        </FormControl>
      )}

      {inclSport && (
        <FormControl isRequired={isReq} isInvalid={!!errSport}>
          <Select placeholder="Sport" {...registerSport}>
            {Object.entries(Sports).map(([ky, val]) => (
              <option key={ky} value={ky}>
                {val}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errSport?.message}</FormErrorMessage>
        </FormControl>
      )}
    </Flex>
  );
};

export default DeptSprtYear;
