import { Heading, Divider, Flex } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import AnnDesc from "../../Utilities/AnnDesc";
import NameTitle from "../../Utilities/NameTitle";
import { useParams } from "react-router-dom";
import useUpdateTeam, { updateTeamSchema, UpdateTeamZod } from "../Hooks/useUpdateTeam";
import SubmitCancelBtnGroup from "../../Utilities/SubmitCancelBtnGroup";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "../../Utilities/FileUpload";
import { useGetParticularTeam } from "../Hooks/useGetParticularTeam";
import { ResetForm } from "../../Utilities/ResetForm";
import FormLoadingSkeleton from "../../Utilities/FormLoadingSkeleton";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";

const UpdateTeam = () => {
  const { id } = useParams();
  const { mutate, isPending } = useUpdateTeam();
  const { data, isLoading, error, refetch } = useGetParticularTeam(id);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    control,
    reset,
  } = useForm<UpdateTeamZod>({ resolver: zodResolver(updateTeamSchema) });

  ResetForm(data, reset);

  if (isLoading) return <FormLoadingSkeleton />;
  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Flex align="center" direction="column">
      <Heading>Update Team</Heading>
      <Divider mb={4} />

      <form onSubmit={handleSubmit((data) => mutate({ id, data }))}>
        <NameTitle
          label="Update Team Name"
          placeholder="Team INDIA"
          isReq={false}
          registerFxn={register("name")}
          error={errors.name}
        />

        <NameTitle
          label="Team Motto"
          placeholder="Satyamev Jayate"
          isReq={false}
          registerFxn={register("motto")}
          error={errors.motto}
        />

        <FileUpload
          label="Update Team Logo"
          name="logo"
          error={errors.logo}
          setValue={setValue}
          control={control}
          fileType="image"
          multiple={false}
        />

        <AnnDesc
          label="About Team"
          placeholder="Tell enthusiasts about the team"
          isReq={false}
          registerFxn={register("description")}
          error={errors.description}
        />
        <SubmitCancelBtnGroup type="Update" isPending={isPending} isDisabled={!isValid || !isDirty} />
      </form>
    </Flex>
  );
};

export default UpdateTeam;
