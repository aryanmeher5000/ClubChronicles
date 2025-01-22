import { Box, Divider, Flex, Heading, Input, Select, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useCreateGCSession, { CreateGCRecord, gcRecordSchema } from "../Hooks/useCreateGCSession";
import SubmitCancelBtnGroup from "../../Utilities/SubmitCancelBtnGroup";
import FileUpload from "../../Utilities/FileUpload";
import useGetDepartments from "../../Department/Hooks/useGetDepartments";

const CreateGCSession = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    control,
  } = useForm<CreateGCRecord>({
    resolver: zodResolver(gcRecordSchema),
  });
  const { mutate, isPending } = useCreateGCSession();
  const { data, isLoading } = useGetDepartments();

  return (
    <Flex align="center" direction="column">
      <Heading>Create a GC Archive Record</Heading>
      <Divider mb={4} />
      <form onSubmit={handleSubmit((d) => mutate(d))} className="selectedForm">
        <Flex align="center" direction="column">
          <Text fontWeight={500} mb={2}>
            Enter Year
          </Text>
          <Input
            type="number"
            min={1980}
            isRequired={true}
            {...register("year", { valueAsNumber: true })}
            placeholder="Enter year"
            mb={4}
            textAlign="center"
            w="200px"
          />
          {errors.year && <Text color="red">{errors.year.message}</Text>}
          <Text fontWeight={500} my={2}>
            Select the winning department
          </Text>
          <Select mb={6} w="fit-content" placeholder="GC Won By" {...register("wonBy")}>
            {data?.body.map((k) => (
              <option key={k._id} value={k._id} disabled={isLoading}>
                {k.name}
              </option>
            ))}
          </Select>
          <Box mb={4}>
            <FileUpload
              label="Upload team photo"
              name="teamPic"
              fileType="image"
              multiple={false}
              error={errors.teamPic}
              setValue={setValue}
              control={control}
            />
          </Box>
          <SubmitCancelBtnGroup type="Create" isPending={isPending} isDisabled={!isValid} />{" "}
        </Flex>
      </form>
    </Flex>
  );
};

export default CreateGCSession;
