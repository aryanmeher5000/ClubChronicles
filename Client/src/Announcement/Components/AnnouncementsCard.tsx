import { Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { readableDate } from "../../Utilities/utilFxns";
import { MultipleAnnouncements } from "../Hooks/useGetAnnouncements";
import TagStack from "../../Utilities/TagStack";

const AnnouncementsCard = ({ _id, title, department, sport, gender, createdAt }: MultipleAnnouncements) => {
  const navigate = useNavigate();

  return (
    <Box key={_id} className="card" onClick={() => navigate(`/announcements/${_id}`)}>
      <Text fontWeight={700} fontSize="xl">
        {title}
      </Text>

      <TagStack department={department?.name || "All"} gender={gender || "All"} sport={sport || "All"} size="sm" />

      <Text>{readableDate(createdAt, false)}</Text>
    </Box>
  );
};

export default AnnouncementsCard;
