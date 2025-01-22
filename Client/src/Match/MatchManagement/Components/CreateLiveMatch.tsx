import { Divider, Flex, Heading, Select, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import NameTitle from "../../../Utilities/NameTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import DeptSprtYear from "../../../Utilities/DeptSprtYear";
import { useGetTeamForCreateMatch } from "../../MatchManagement/Hooks/useGetTeamForCreateMatch";
import SubmitCancelBtnGroup from "../../../Utilities/SubmitCancelBtnGroup";
import useCreateLiveMatchEnteredData, {
  CreateLiveMatchProps,
  createLiveMatchSchema,
} from "../Hooks/useCreateLiveMatchFromData";
import { TeamSelect } from "./CreateUpcomingMatch";
import { MatchTags, widthObj } from "../../../staticData";
import useClientStateManagement from "../../../store";
import { useEffect } from "react";

const CreateLiveMatch = () => {
  const { profile } = useClientStateManagement();
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<CreateLiveMatchProps>({
    resolver: zodResolver(createLiveMatchSchema),
  });

  useEffect(() => {
    if (profile) setValue("scoreUpdater", profile?._id);
  }, [profile, setValue]);

  const sport = watch("sport");
  const gender = watch("gender");

  const { data, isPending, error } = useGetTeamForCreateMatch(sport, gender);
  const { createLiveMatch, isLoading } = useCreateLiveMatchEnteredData();

  return (
    <Flex align="center" direction="column">
      <Heading>Create Live Match</Heading>
      <Divider mb={4} />

      <form onSubmit={handleSubmit((d) => createLiveMatch(d))}>
        <DeptSprtYear
          isReq={true}
          inclDept={false}
          inclGender={true}
          inclSport={true}
          registerSport={register("sport")}
          registerGender={register("gender")}
        />

        <Flex gap={4} mb={4}>
          <TeamSelect
            placeholder="Team 1"
            teams={data?.body}
            registerFxn={register("team1")}
            isLoading={isLoading || isPending || !data}
            error={error}
          />
          <TeamSelect
            placeholder="Team 2"
            teams={data?.body}
            registerFxn={register("team2")}
            isLoading={isLoading || isPending || !data}
            error={error}
          />
        </Flex>

        <NameTitle
          label="Venue"
          isReq={false}
          placeholder="Enter the match venue"
          registerFxn={register("venue")}
          error={errors.venue}
        />

        <Text mb={2} fontWeight={500}>
          Add a tag
        </Text>
        <Select placeholder="Tag" {...register("tag")} w={widthObj} mb={6}>
          {Object.entries(MatchTags).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </Select>

        <SubmitCancelBtnGroup type="Create" isPending={isLoading} isDisabled={!isValid} />
      </form>
    </Flex>
  );
};

export default CreateLiveMatch;
