import { Divider, Flex, Heading } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NameTitle from "../../Utilities/NameTitle";
import AnnDesc from "../../Utilities/AnnDesc";
import useUpdateDepartment, {
  updateDepartmentSchema,
  UpdateDepartmentZod,
} from "../Hooks/useUpdateDepartment";
import SubmitCancelBtnGroup from "../../Utilities/SubmitCancelBtnGroup";
import { useGetParticularDepartment } from "../Hooks/useGetParticularDepartment";
import FormLoadingSkeleton from "../../Utilities/FormLoadingSkeleton";
import { useParams } from "react-router-dom";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";
import FileUpload from "../../Utilities/FileUpload";
import { ResetForm } from "../../Utilities/ResetForm";

const UpdateDepartment = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetParticularDepartment(id);
  const { mutate, isPending } = useUpdateDepartment();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid, isDirty },
    reset,
    control,
  } = useForm<UpdateDepartmentZod>({
    resolver: zodResolver(updateDepartmentSchema),
  });

  ResetForm(data, reset);

  if (isLoading) return <FormLoadingSkeleton />;
  if (error) return <ErrorDisplay errorObj={error} />;

  return (
    <Flex align="center" direction="column">
      <Heading>Update Department</Heading>
      <Divider mb={4} />
      <form onSubmit={handleSubmit((d) => mutate({ id, data: d }))}>
        <NameTitle
          label="Name of the Deparment"
          placeholder="Computer, IT, etc"
          isReq={true}
          registerFxn={register("name")}
          error={errors.name}
        />
        <FileUpload
          label="Department Logo"
          control={control}
          fileType="image"
          error={errors.logo}
          name="logo"
          setValue={setValue}
        />
        <AnnDesc
          label="About Department"
          placeholder="Add a description about the department..."
          isReq={false}
          registerFxn={register("about")}
          error={errors.about}
        />
        <SubmitCancelBtnGroup
          type={"Update"}
          isPending={isPending}
          isDisabled={!isValid || !isDirty}
        />
      </form>
    </Flex>
  );
};

export default UpdateDepartment;
