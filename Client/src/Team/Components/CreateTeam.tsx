import { Divider, Flex, Heading } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import AnnDesc from "../../Utilities/AnnDesc";
import DeptSprtYear from "../../Utilities/DeptSprtYear";
import NameTitle from "../../Utilities/NameTitle";
import useClientStateManagement from "../../store";
import useCreateTeam, { createTeamSchema, CreateTeamZod } from "../Hooks/useCreateTeam";
import SubmitCancelBtnGroup from "../../Utilities/SubmitCancelBtnGroup";
import FileUpload from "../../Utilities/FileUpload";

const CreateTeam = () => {
  const { mutate, isPending } = useCreateTeam();
  const { profile } = useClientStateManagement();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    control,
  } = useForm<CreateTeamZod>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: { department: profile?.department },
  });

  return (
    <Flex align="center" direction="column">
      <Heading>Create Team</Heading>
      <Divider mb={4} />

      <form onSubmit={handleSubmit((data) => mutate(data))}>
        <NameTitle
          label="Team Name"
          placeholder="Team INDIA"
          isReq={true}
          registerFxn={register("name")}
          error={errors.name}
        />
        <FileUpload
          label="Team Logo"
          name="logo"
          fileType="image"
          multiple={false}
          setValue={setValue}
          control={control}
          error={errors.logo}
        />
        <NameTitle
          label="Team Motto"
          placeholder="Satyamev Jayate"
          isReq={false}
          registerFxn={register("motto")}
          error={errors.motto}
        />
        <AnnDesc
          label="About Team"
          placeholder="Tell enthusiasts about the team"
          isReq={false}
          registerFxn={register("about")}
          error={errors.about}
        />
        <DeptSprtYear
          label="Select:"
          isReq={true}
          inclDept={false}
          registerGender={register("gender")}
          errYear={errors.gender}
          inclSport={true}
          registerSport={register("sport")}
          errSport={errors.sport}
        />
        <SubmitCancelBtnGroup type="Create" isPending={isPending} isDisabled={!isValid} />
      </form>
    </Flex>
  );
};

export default CreateTeam;
