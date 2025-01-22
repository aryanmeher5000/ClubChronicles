import { Divider, Flex, Heading, Text } from "@chakra-ui/react";
import NameTitle from "../../Utilities/NameTitle";
import AnnDesc from "../../Utilities/AnnDesc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAnnounce, createAnnouncementSchema, useCreateAnnouncement } from "../Hooks/useCreateAnnouncement";
import DeptSprtYear from "../../Utilities/DeptSprtYear";
import SubmitCancelBtnGroup from "../../Utilities/SubmitCancelBtnGroup";
import FileUpload from "../../Utilities/FileUpload";

const CreateAnnouncement = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    setValue,
  } = useForm<CreateAnnounce>({
    resolver: zodResolver(createAnnouncementSchema),
  });
  const { mutate, isPending } = useCreateAnnouncement();

  return (
    <Flex direction="column" align="center">
      <Heading textAlign="center">Create Announcement</Heading>
      <Divider mb={4} />

      <form onSubmit={handleSubmit((d) => mutate(d))}>
        <NameTitle
          label="Announcement Title"
          placeholder="Regarding something..."
          isReq={true}
          registerFxn={register("title")}
          error={errors.title}
        />

        <AnnDesc
          label="Announcement Description"
          placeholder="Description of announcement"
          isReq={false}
          registerFxn={register("description")}
          error={errors.description}
        />

        <Text my={1} textAlign="center">
          (Note: If announcement is for everyone leave below fields empty)
        </Text>

        <DeptSprtYear
          label=""
          isReq={false}
          registerDept={register("department")}
          registerGender={register("gender")}
          registerSport={register("sport")}
          errDept={errors.department}
          errYear={errors.gender}
          errSport={errors.sport}
        />

        <Flex my={4} direction={["column", "column", "row"]}>
          <FileUpload
            label="Include images"
            name="images"
            fileType="image"
            setValue={setValue}
            control={control}
            error={errors.images}
            multiple={true}
          />

          <FileUpload
            label="Include a PDF"
            name="pdf"
            setValue={setValue}
            control={control}
            error={errors.pdf}
            fileType="pdf"
          />
        </Flex>

        <NameTitle
          label="Include an URL"
          placeholder="https://example.com"
          type="url"
          registerFxn={register("url")}
          error={errors.url}
          isReq={false}
        />

        <SubmitCancelBtnGroup type="Create" isPending={isPending} isDisabled={!isValid} />
      </form>
    </Flex>
  );
};

export default CreateAnnouncement;
