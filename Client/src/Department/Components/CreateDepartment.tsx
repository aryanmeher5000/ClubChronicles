import { Divider, Flex, Heading } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NameTitle from "../../Utilities/NameTitle";
import AnnDesc from "../../Utilities/AnnDesc";
import useCreateDepartment, { createDepartmentSchema, CreateDepartmentZod } from "../Hooks/useCreateDepartment";
import SubmitCancelBtnGroup from "../../Utilities/SubmitCancelBtnGroup";
import FileUpload from "../../Utilities/FileUpload";

const CreateDepartment = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    control,
  } = useForm<CreateDepartmentZod>({
    resolver: zodResolver(createDepartmentSchema),
  });

  const { mutate, isPending } = useCreateDepartment();

  return (
    <Flex align="center" direction="column">
      <Heading>Create Department</Heading>
      <Divider mb={4} />

      <form onSubmit={handleSubmit((d) => mutate(d))}>
        <NameTitle
          label="Name of the Deparment"
          placeholder="Computer, IT, etc"
          isReq={true}
          registerFxn={register("name")}
          error={errors.name}
        />
        <FileUpload
          label="Team Logo"
          name="logo"
          setValue={setValue}
          control={control}
          multiple={false}
          error={errors.logo}
          fileType="image"
        />
        <AnnDesc
          label="About Department"
          placeholder="Tell enthusiasts about the team"
          isReq={false}
          registerFxn={register("about")}
          error={errors.about}
        />
        <SubmitCancelBtnGroup type="Create" isPending={isPending} isDisabled={!isValid} />
      </form>
    </Flex>
  );
};

export default CreateDepartment;
