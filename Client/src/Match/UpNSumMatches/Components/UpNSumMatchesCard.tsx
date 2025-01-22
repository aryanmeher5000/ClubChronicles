import { Flex, Icon, Text, HStack, Tag, Avatar, Divider } from "@chakra-ui/react";
import { LuSwords } from "react-icons/lu";
import { createImageUrlFromId } from "../../../Utilities/utilFxns";
import { useNavigate } from "react-router-dom";
import useClientStateManagement from "../../../store";
import { UpNSumMatchesCardProps } from "../Hooks/useGetMatches";

const UpNSumMatchesCard = ({
  _id,
  team1,
  team2,
  sport,
  gender,
  tag,
  venue,
  date,
  time,
  winner,
  team1Score,
  team2Score,
  status,
}: UpNSumMatchesCardProps) => {
  const profile = useClientStateManagement((p) => p.profile);

  return (
    <Flex key={_id} className="card" cursor="default">
      <Flex w="100%" justifyContent="space-between" alignItems="center" gap={2}>
        <TeamCard teamId={team1?._id} teamName={team1?.name} teamLogo={team1?.logo} />
        {team1Score && team2Score && (
          <Text fontWeight={500} fontSize="xl">
            {team1Score}
          </Text>
        )}
        <Icon as={LuSwords} color="#f04d50" fontSize="3xl" w="10%" />
        {team1Score && team2Score && (
          <Text fontWeight={500} fontSize="xl">
            {team2Score}
          </Text>
        )}
        <TeamCard teamId={team2?._id} teamName={team2?.name} teamLogo={team2?.logo} />
      </Flex>
      <Divider my={2} />

      {status === "SUMMARY" && (
        <>
          <Text fontWeight={500}>Winner: {!winner ? "TIE" : winner === team1._id ? team1.name : team2.name}</Text>
          <Divider my={2} />
        </>
      )}

      {status === "UPCOMING" && venue && (
        <>
          {venue && (
            <>
              <Text fontWeight={500}>{venue}</Text>
              <Divider my={2} />
            </>
          )}
        </>
      )}
      {status === "UPCOMING" && date && (
        <>
          <Text>
            {date && new Date(date).toDateString()} {time && " - "} {time}
          </Text>
          <Divider my={2} />
        </>
      )}

      <HStack alignItems="center" gap={4}>
        <Tag colorScheme="red">{sport}</Tag>
        <Tag colorScheme="blue">{gender}</Tag>
        {tag && <Tag colorScheme="green">Final</Tag>}
      </HStack>

      {profile?.isAdmin && (
        <>
          <Divider my={2} />
          <Text className="idStyle">Match Id: {_id}</Text>
        </>
      )}
    </Flex>
  );
};

export function TeamCard({ teamId, teamName, teamLogo }: { teamId: string; teamName: string; teamLogo: string }) {
  const nav = useNavigate();
  return (
    <Flex w="40%" className="card" bg="transparent" onClick={() => nav(`/teams/${teamId}`)}>
      <Avatar name={teamName} src={teamLogo ? createImageUrlFromId(teamLogo) : undefined} size="lg" borderRadius="full" />
      <Text fontWeight={700} fontSize="3vh" textAlign="center" p={1}>
        {teamName}
      </Text>
    </Flex>
  );
}

export default UpNSumMatchesCard;
