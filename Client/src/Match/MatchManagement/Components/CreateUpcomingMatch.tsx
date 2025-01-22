import { Box, Divider, Flex, Heading, Input, Select, Text } from "@chakra-ui/react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUpcomingMatchProps,
  createUpcomingMatchSchema,
  useCreateUpcomingMatch,
} from "../Hooks/useCreateUpcomingMatch";
import DeptSprtYear from "../../../Utilities/DeptSprtYear";
import NameTitle from "../../../Utilities/NameTitle";
import { Team, useGetTeamForCreateMatch } from "../Hooks/useGetTeamForCreateMatch";
import SubmitCancelBtnGroup from "../../../Utilities/SubmitCancelBtnGroup";
import { AxiosError } from "axios";
import { MatchTags } from "../../../staticData";

const CreateUpcomingMatch = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateUpcomingMatchProps>({
    resolver: zodResolver(createUpcomingMatchSchema),
  });
  const sport = watch("sport");
  const gender = watch("gender");

  const { data: teams, isLoading, error } = useGetTeamForCreateMatch(sport, gender);
  const { mutate, isPending } = useCreateUpcomingMatch();

  return (
    <Flex align="center" direction="column">
      <Heading>Create Upcoming Match</Heading>
      <Divider mb={4} />

      <form onSubmit={handleSubmit((data) => mutate(data))}>
        <DeptSprtYear
          label=""
          isReq={true}
          inclDept={false}
          inclGender={true}
          inclSport={true}
          registerSport={register("sport")}
          registerGender={register("gender")}
          errSport={errors?.sport}
        />

        <Flex gap={4} alignItems="center" my={8}>
          <TeamSelect
            placeholder="Team 1"
            registerFxn={register("team1")}
            isLoading={isLoading || isPending || !teams}
            teams={teams?.body}
            error={error}
          />
          <TeamSelect
            placeholder="Team 2"
            registerFxn={register("team2")}
            isLoading={isLoading || isPending || !teams}
            teams={teams?.body}
            error={error}
          />
        </Flex>

        <NameTitle placeholder="Enter the match venue" registerFxn={register("venue")} isReq={false} />

        <Flex alignItems="center" gap={4} my={8} w="100%">
          <Box w="50%">
            <Text mb={2} fontWeight={500}>
              Add a tag
            </Text>
            <Select placeholder="Tag" {...register("tag")}>
              {Object.entries(MatchTags).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>
          </Box>
          <Box w="25%">
            <Text mb={2} fontWeight={500}>
              Add a date
            </Text>
            <Input placeholder="Enter Schedule" type="date" {...register("date")} />
          </Box>
          <Box w="25%">
            <Text mb={2} fontWeight={500}>
              Add time
            </Text>
            <Input placeholder="Enter Schedule" type="time" {...register("time")} />
          </Box>
        </Flex>

        <SubmitCancelBtnGroup type="Create" isPending={isPending} isDisabled={!isValid} />
      </form>
    </Flex>
  );
};

export const TeamSelect = ({
  placeholder,
  registerFxn,
  isLoading,
  teams,
  error,
}: {
  placeholder: string;
  registerFxn: UseFormRegisterReturn<string>;
  isLoading: boolean;
  teams?: Team[];
  error: AxiosError<string> | null;
}) => {
  return (
    <Select placeholder={placeholder} {...registerFxn} isDisabled={isLoading} required>
      {error && <option style={{ color: "red" }}>Couldn't fetch teams!</option>}
      {teams?.map((team) => (
        <option key={team._id} value={team._id}>
          {team.name}
        </option>
      ))}
    </Select>
  );
};

export default CreateUpcomingMatch;
