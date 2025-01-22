import { Flex, Button, Divider, Heading, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { FaTrashCan } from "react-icons/fa6";
import useShowAlert from "../../useShowAlert";
import FileUpload from "../../Utilities/FileUpload";
import { useDeleteTimeTable } from "../Hooks/useDeleteTimeTable";
import { fileSchema, useUploadTimeTable } from "../Hooks/useUploadTimeTable";
import { useGetTimeTable } from "../Hooks/useGetTImeTable";
import ZoomableImage from "../../Utilities/ZoomableImage";

// Main Component
const TimeTableManagement = () => {
  const { data } = useGetTimeTable();

  return (
    <Flex alignItems="center" direction="column">
      <Heading>Time Table Management</Heading>
      <Divider mb={4} />

      <TimeTableDisplay timeTable={data?.body.timeTable} />
      <Divider my={4} />

      <UploadTimeTableForm hasExistingTimeTable={!!data?.body.timeTable} />
    </Flex>
  );
};

// Display Current Time Table
const TimeTableDisplay = ({ timeTable }: { timeTable?: string }) => (
  <Flex direction="column" alignItems="center">
    <Text fontWeight={600} my={2}>
      Current Time Table
    </Text>
    {timeTable ? (
      <>
        <ZoomableImage imgSource={timeTable} borderRadius={15} />
        <DeleteTimeTableButton />
      </>
    ) : (
      <Text p={4}>No time table declared.</Text>
    )}
  </Flex>
);

// Upload Time Table Form
const UploadTimeTableForm = ({ hasExistingTimeTable }: { hasExistingTimeTable: boolean }) => {
  const {
    formState: { errors, isValid },
    handleSubmit,
    control,
    setValue,
    reset,
  } = useForm({ resolver: zodResolver(fileSchema) });
  const { mutate, isPending, isSuccess } = useUploadTimeTable();

  useEffect(() => {
    if (isSuccess) reset();
  }, [isSuccess, reset]);

  return (
    <Flex direction="column" alignItems="center" my={2}>
      <FileUpload
        label=""
        name="timeTable"
        setValue={setValue}
        control={control}
        fileType="image"
        error={errors.timeTable}
      />
      <Button
        colorScheme="yellow"
        onClick={handleSubmit((data) => mutate(data))}
        isDisabled={isPending || !isValid}
        leftIcon={<AiOutlineCloudUpload />}
        loadingText={`${hasExistingTimeTable ? "Updating" : "Uploading"} Time Table`}
      >
        {hasExistingTimeTable ? "Update Time Table" : "Upload Time Table"}
      </Button>
    </Flex>
  );
};

// Delete Time Table Button
const DeleteTimeTableButton = () => {
  const { mutate, isPending } = useDeleteTimeTable();
  const { open, AlertDialogComponent } = useShowAlert();

  const handleDelete = () =>
    open({
      title: "Are you sure?",
      message: "This action is irreversible. Do you want to delete the time table?",
      onConfirm: () => mutate({ id: undefined }),
      isLoading: isPending,
    });

  return (
    <Flex direction="column" alignItems="center" mt={4}>
      <Button colorScheme="red" onClick={handleDelete} isDisabled={isPending} leftIcon={<FaTrashCan />}>
        {isPending ? "Deleting Time Table..." : "Delete Time Table"}
      </Button>
      <AlertDialogComponent />
    </Flex>
  );
};

export default TimeTableManagement;
