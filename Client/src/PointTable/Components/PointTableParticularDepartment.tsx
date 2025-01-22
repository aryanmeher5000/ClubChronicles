import { Box, Divider, Flex, Heading, HStack, Icon, SimpleGrid, Text, useColorModeValue } from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { LuSwords } from "react-icons/lu";
import { Sports } from "../../staticData";
import { PartDeptPT, useGetPartDeptPointsTable } from "../Hooks/useGetPartDeptPointTable";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";

const PointTableParticularDepartment = () => {
  const { id } = useParams();
  const [sport, setSport] = useState<string>("CRICKET");
  const { data, error, isLoading, refetch } = useGetPartDeptPointsTable(sport, id);

  const wonMatches = useMemo(() => {
    return data?.body?.deptMatches?.filter((k) => k.winner && data.body.deptTeams.includes(k.winner)) || [];
  }, [data]);

  const lostMatches = useMemo(() => {
    return data?.body?.deptMatches?.filter((k) => k.winner && !data.body.deptTeams.includes(k.winner)) || [];
  }, [data]);

  const tieMatches = useMemo(() => {
    return data?.body?.deptMatches?.filter((k) => !k.winner) || [];
  }, [data]);

  const color = useColorModeValue("blackAlpha.600", "whiteAlpha.600");
  const bg = useColorModeValue("blackAlpha.200", "whiteAlpha.200");
  const bgSelected = useColorModeValue("blackAlpha.400", "whiteAlpha.400");

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Box>
      <Heading textAlign="center">Results</Heading>
      <Divider mb={4} />

      <Flex gap={2} w={["calc(100vw - 32px)", "calc(100vw - 37.1vh)"]} overflowX="auto" className="scrollBarHidden">
        {Object.entries(Sports).map(([ky, val]) => (
          <Text
            key={ky}
            h="fit-content"
            minW="fit-content"
            p={1}
            px={3}
            bg={ky === sport ? bgSelected : bg}
            color={color}
            borderRadius={15}
            cursor="pointer"
            onClick={() => setSport(ky)}
          >
            {val}
          </Text>
        ))}
      </Flex>

      <MatchList title="WON" matches={wonMatches} color="#03b57b" />
      <MatchList title="LOST" matches={lostMatches} color="#f04d50" />
      <MatchList title="TIE" matches={tieMatches} color="whitesmoke" />
    </Box>
  );
};

const MatchList = ({ title, matches, color }: { title: string; matches: PartDeptPT[]; color: string }) => (
  <Box>
    <Heading color={color} py={4} fontSize="3xl">
      {title}
    </Heading>
    {matches.length > 0 ? (
      <SimpleGrid columns={[1, 1, 2, 3]} gap={4}>
        {matches.map((match) => (
          <HStack
            key={match._id}
            border="2px solid #444"
            borderRadius={15}
            fontWeight="500"
            justifyContent="space-evenly"
            alignItems="center"
            p={2}
          >
            <Text>{match.team1.name}</Text>
            <Icon as={LuSwords} />
            <Text>{match.team2.name}</Text>
          </HStack>
        ))}
      </SimpleGrid>
    ) : (
      <Text fontWeight={500} p={4}>
        No matches {title} yet!
      </Text>
    )}
  </Box>
);

export default PointTableParticularDepartment;
