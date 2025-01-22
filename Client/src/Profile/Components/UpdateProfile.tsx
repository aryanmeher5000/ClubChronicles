import { Divider, Flex, Heading } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useUpdateProfile, { UpdateProfileProps, updateScehma } from "../Hooks/useUpdateProfile";
import NameTitle from "../../Utilities/NameTitle";
import AnnDesc from "../../Utilities/AnnDesc";
import { useLocation } from "react-router-dom";
import SubmitCancelBtnGroup from "../../Utilities/SubmitCancelBtnGroup";
import FileUpload from "../../Utilities/FileUpload";

const UpdateProfile = () => {
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setValue,
    control,
  } = useForm<UpdateProfileProps>({
    resolver: zodResolver(updateScehma),
    defaultValues: {
      name: location.state?.name,
      about: location.state?.about,
      achievements: location.state?.achievements,
      profilePic: undefined,
    },
  });
  const { mutate, isPending } = useUpdateProfile();

  return (
    <Flex align="center" direction="column">
      <Heading>Update Profile</Heading>
      <Divider mb={4} />

      <form onSubmit={handleSubmit((data) => mutate({ id: " ", data }))}>
        <FileUpload
          label="Upload Profile Pic"
          name="profilePic"
          multiple={false}
          fileType="image"
          setValue={setValue}
          control={control}
          error={errors.profilePic}
        />

        <NameTitle
          label="Update Name"
          placeholder="Enter your name"
          isReq={false}
          registerFxn={register("name")}
          error={errors.name}
        />

        <AnnDesc
          label="About"
          placeholder="Tell others more about you..."
          isReq={false}
          registerFxn={register("about")}
          error={errors.about}
        />

        <AnnDesc
          label="Achievements"
          placeholder="Tell others about your achievements..."
          isReq={false}
          registerFxn={register("achievements")}
          error={errors.achievements}
        />

        <SubmitCancelBtnGroup type="Update" isPending={isPending} isDisabled={!isDirty || !isValid} />
      </form>
    </Flex>
  );
};

export default UpdateProfile;
