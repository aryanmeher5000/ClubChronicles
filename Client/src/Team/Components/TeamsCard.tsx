import { Avatar, Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import TagStack from "../../Utilities/TagStack";
import { createImageUrlFromId } from "../../Utilities/utilFxns";
import { TeamsCardProps } from "../Hooks/useGetTeams";

const TeamsCard = ({ _id, name, logo, department, gender, sport }: TeamsCardProps) => {
  const navigate = useNavigate();
  return (
    <Box className="card" key={_id} onClick={() => navigate(`/teams/${_id}`)} gap={2}>
      <Avatar name={name} src={logo && createImageUrlFromId(logo)} size="lg" border="2px solid #c5c5c5" />
      <Text fontWeight="700" fontSize="xl">
        {name}
      </Text>
      <TagStack department={department.name} gender={gender} sport={sport} size="sm" />
    </Box>
  );
};

export default TeamsCard;
