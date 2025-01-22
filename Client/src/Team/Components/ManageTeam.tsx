import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { Avatar, Divider, Flex, Heading, Select, Text } from "@chakra-ui/react";
import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../Utilities/LoadingSpinner";
import SubmitCancelBtnGroup from "../../Utilities/SubmitCancelBtnGroup";
import { createImageUrlFromId } from "../../Utilities/utilFxns";
import useGetApplicantsNPlayers, { PlayerProps } from "../Hooks/useGetApplicantsNPlayers";
import useUpdateTeamPlayer from "../Hooks/useUpdateTeamPlayer";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";

interface UserProps {
  user: PlayerProps;
  type: "add" | "remove";
  callbackFxn: (param: PlayerProps) => void;
}

interface ListProps {
  title: string;
  users: PlayerProps[];
  type: "add" | "remove";
  callbackFxn: (param: PlayerProps) => void;
}

const ManageTeam = () => {
  const { id } = useParams();
  const { data, isLoading, error, refetch } = useGetApplicantsNPlayers(id);
  const { mutate, isPending } = useUpdateTeamPlayer();

  const [applicants, setApplicants] = useState<PlayerProps[]>([]);
  const [players, setPlayers] = useState<PlayerProps[]>([]);
  const [addedPlayers, setAddedPlayers] = useState<PlayerProps[]>([]);
  const [removedPlayers, setRemovedPlayers] = useState<PlayerProps[]>([]);
  const [captain, setCaptain] = useState<string>();
  const [viceCaptain, setViceCaptain] = useState<string>();

  useEffect(() => {
    if (data?.body?.applicants) setApplicants(data.body.applicants);
    if (data?.body?.players) setPlayers(data.body.players);
    if (data?.body?.captain) setCaptain(data.body?.captain._id);
    if (data?.body?.viceCaptain) setViceCaptain(data.body.viceCaptain._id);
  }, [data]);

  const handleAddition = useCallback(
    (addedPlayer: PlayerProps) => {
      setApplicants((prev) => prev.filter((k) => k._id !== addedPlayer._id));
      setPlayers((prev) => [...prev, addedPlayer]);
      setAddedPlayers((prev) => [...prev, addedPlayer]);
      setRemovedPlayers((prev) => prev.filter((k) => k._id !== addedPlayer._id));
    },
    [setApplicants, setPlayers, setAddedPlayers, setRemovedPlayers]
  );

  const handleRemoval = useCallback(
    (removedPlayer: PlayerProps) => {
      if (removedPlayer._id === captain) setCaptain("NOTA");
      if (removedPlayer._id === viceCaptain) setViceCaptain("NOTA");
      setApplicants((prev) => [...prev, removedPlayer]);
      setPlayers((prev) => prev.filter((k) => k._id !== removedPlayer._id));
      setAddedPlayers((prev) => prev.filter((k) => k._id !== removedPlayer._id));
      setRemovedPlayers((prev) => [...prev, removedPlayer]);
    },
    [setApplicants, setPlayers, setAddedPlayers, setRemovedPlayers, captain, viceCaptain]
  );

  const isArraysEqual = useCallback((array1?: PlayerProps[], array2?: PlayerProps[]) => {
    if (!array1 || !array2) return array1 === array2;
    if (array1.length !== array2.length) return false;

    const set2 = new Set(array2.map((item) => item._id));
    return array1.every((item) => set2.has(item._id));
  }, []);

  const playerChange = !isArraysEqual(data?.body?.players, players);
  const captainChange = data?.body?.captain?._id !== captain;
  const vCaptainChange = data?.body?.viceCaptain?._id !== viceCaptain;

  const isDisabled = !(playerChange || captainChange || vCaptainChange);

  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;
  if (isLoading) return <LoadingSpinner />;

  return (
    <Flex color="#fff" direction="column" alignItems="center" p={4}>
      <Heading textAlign="center">Player Management</Heading>
      <Divider mb={4} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log(captain);
          console.log(viceCaptain);
          mutate({ id, data: { addedPlayers, removedPlayers, captain, viceCaptain } });
        }}
      >
        <Flex direction="column" alignItems="center">
          <UserList title="Players" users={players} type="remove" callbackFxn={handleRemoval} />
          <UserList title="Applicants" users={applicants} type="add" callbackFxn={handleAddition} />

          <SelectComponent
            users={players}
            selectedValue={captain}
            onChange={setCaptain}
            placeholder="Select Captain for Team"
          />
          <SelectComponent
            users={players}
            selectedValue={viceCaptain}
            onChange={setViceCaptain}
            placeholder="Select Vice Captain for Team"
          />

          <SubmitCancelBtnGroup type="Update" isPending={isPending} isDisabled={isDisabled} />
        </Flex>
      </form>
    </Flex>
  );
};

function UserList({ title, users, type, callbackFxn }: ListProps) {
  return (
    <Flex w="100%" maxH="54vh" overflowY="auto" direction="column" border="2px solid #444" borderRadius={15} p={2} mb={4}>
      <Text fontWeight={600} fontSize="xl" textAlign="center" w="100%" mb={2}>
        {title}
      </Text>

      <Flex direction="column" gap={1}>
        {users.length > 0 ? (
          users.map((k) => <UserListItem key={k._id} user={k} type={type} callbackFxn={callbackFxn} />)
        ) : (
          <Text textAlign="center" my={4}>
            {type === "add"
              ? "No applicants at the moment. New player requests will appear here."
              : "No players in this team yet. Add applicants to start building your team."}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}

function UserListItem({ user, type, callbackFxn }: UserProps) {
  return (
    <Flex borderRadius={15} justifyContent="space-between" alignItems="center" bg="#151515" key={user?._id}>
      <Flex p={2} alignItems="center" gap={2}>
        <Avatar name={user?.name} size="sm" src={user?.profilePic && createImageUrlFromId(user.profilePic)} />
        <Link to={`/profile/${user?._id}`}>{user?.name?.length > 60 ? user.name.slice(0, 60) : user.name}</Link>
      </Flex>

      {type === "remove" && (
        <CloseIcon
          p={1}
          fontSize="lg"
          borderRadius={20}
          color="#fff"
          mr={4}
          cursor="pointer"
          aria-label="Remove player"
          onClick={() => callbackFxn(user)}
        />
      )}
      {type === "add" && (
        <AddIcon
          p={1}
          fontSize="lg"
          borderRadius={20}
          color="#fff"
          mr={4}
          cursor="pointer"
          aria-label="Add player"
          onClick={() => callbackFxn(user)}
        />
      )}
    </Flex>
  );
}

const SelectComponent = ({
  users,
  selectedValue,
  onChange,
  placeholder,
}: {
  users: PlayerProps[];
  selectedValue?: string;
  onChange: React.Dispatch<React.SetStateAction<string | undefined>>;
  placeholder: string;
}) => (
  <Select
    placeholder={placeholder}
    border="2px solid #444"
    mb={4}
    value={selectedValue}
    disabled={users.length === 0}
    onChange={(e) => onChange(e.currentTarget.value)}
  >
    {users?.map((k) => (
      <option key={k._id} value={k._id}>
        {k.name}
      </option>
    ))}
    <option key="NOTA" value="NOTA" disabled={!selectedValue}>
      NOTA
    </option>
  </Select>
);

export default ManageTeam;
