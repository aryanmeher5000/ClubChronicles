import { Heading, Divider, Select, Text, Flex, Box, Input } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useGetTeamForCreateMatch } from "../Hooks/useGetTeamForCreateMatch";
import { MatchTags } from "../../../staticData";
import DeptSprtYear from "../../../Utilities/DeptSprtYear";
import { createMatchSummary, CreateMatchSummaryProps, useCreateMatchSummary } from "../Hooks/useCreateMatchSummary";
import SubmitCancelBtnGroup from "../../../Utilities/SubmitCancelBtnGroup";
import { TeamSelect } from "./CreateUpcomingMatch";

const CreateMatchSummary = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateMatchSummaryProps>({
    resolver: zodResolver(createMatchSummary),
  });
  console.log(errors);
  const sport = watch("sport");
  const gender = watch("gender");

  const { data: teams, isLoading, error } = useGetTeamForCreateMatch(sport, gender);
  const { mutate, isPending } = useCreateMatchSummary();

  return (
    <Flex align="center" direction="column">
      <Heading>Create Match Summary</Heading>
      <Divider mb={4} />

      <Text mb={4} fontSize="lg">
        (Points will be automatically added to winning department and won't if it's an tie)
      </Text>

      <form onSubmit={handleSubmit((d) => mutate(d))}>
        <DeptSprtYear
          isReq={true}
          inclDept={false}
          inclGender={true}
          inclSport={true}
          registerSport={register("sport")}
          registerGender={register("gender")}
        />

        <Flex gap={4} my={8}>
          <TeamSelect
            placeholder="Team 1"
            registerFxn={register("team1")}
            teams={teams?.body}
            isLoading={isLoading || isPending || !teams}
            error={error}
          />
          <TeamSelect
            placeholder="Team 2"
            registerFxn={register("team2")}
            teams={teams?.body}
            isLoading={isLoading || isPending || !teams}
            error={error}
          />
        </Flex>

        <Flex gap={4} my={8}>
          <Input
            type="number"
            variant="filled"
            bg="#222"
            placeholder="Team1 Score"
            {...register("team1Score", {
              setValueAs: (val) => (val === "" ? undefined : parseInt(val, 10)),
            })}
          />

          <Input
            type="number"
            variant="filled"
            bg="#222"
            placeholder="Team2 Score"
            {...register("team2Score", {
              setValueAs: (val) => (val === "" ? undefined : parseInt(val, 10)),
            })}
          />
        </Flex>

        <Flex justifyContent="center" gap={4} my={8}>
          <Box w="50%">
            <Select
              placeholder="Winning Team"
              fontWeight={500}
              {...register("winner")}
              bg="#222"
              color="#fff"
              mb={4}
              w="100%"
              required
              isDisabled={isPending || !sport || !gender}
              borderRadius={15}
              variant="filled"
            >
              <option key="TEAM1" value="TEAM1">
                Team 1
              </option>
              <option key="TEAM2" value="TEAM2">
                Team 2
              </option>
              <option key="TIE" value="TIE">
                Tie
              </option>
            </Select>
            {errors.winner && <Text color="red.500">Winner is required</Text>}
          </Box>

          <Box w="50%">
            <Select placeholder="Tag" borderRadius={15} fontWeight={500} {...register("tag")} bg="#222" variant="filled">
              {Object.entries(MatchTags).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>

        <SubmitCancelBtnGroup type={"Create"} isPending={isPending} isDisabled={!isValid} />
      </form>
    </Flex>
  );
};

export default CreateMatchSummary;
