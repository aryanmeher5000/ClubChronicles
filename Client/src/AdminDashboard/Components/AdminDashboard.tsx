import { Box, Divider, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useClientStateManagement from "../../store";

const AdminDashboard = () => {
  const nav = useNavigate();
  const { profile } = useClientStateManagement();

  function mapper(text: string, description: string, url: string) {
    return (
      <Box key={text} className="card" onClick={() => nav(url)}>
        <Text fontWeight={700} fontSize="3vh">
          {text}
        </Text>
        <Text fontSize="2vh" my={2}>
          {description}
        </Text>
      </Box>
    );
  }

  const things = [
    {
      text: "GC & Archive Management",
      description: "Manage current GC, GC record and also update point table.",
      url: "gcManagement",
      roles: ["ADMIN"],
    },
    {
      text: "Time Table Management",
      description: "Manage current GC's time table.",
      url: "timeTableManagement",
      roles: ["ADMIN"],
    },
    {
      text: "Announcement Management",
      description:
        "Create and manage announcements to keep all team members and participants updated on important events, schedule changes, and other news.",
      url: "announcementManagement",
      roles: ["ADMIN", "DEPARTMENT_HEAD", "DEPARTMENT_SPORTS_LEAD", "HELPER"],
    },
    {
      text: "Department Management",
      description:
        "Oversee department-specific details and responsibilities, assign roles to team members, and ensure smooth coordination across department activities.",
      url: "departmentManagement",
      roles: ["DEPARTMENT_HEAD", "DEPARTMENT_SPORTS_LEAD"],
    },
    {
      text: "Admin Department Management",
      description:
        "Access high-level department management controls for admin roles, allowing full oversight and control over all department-related operations.",
      url: "departmentManagementAdmin",
      roles: ["ADMIN"],
    },
    {
      text: "Team Management",
      description:
        "Manage the details and performance of each team. Assign players to teams, update rosters, and track player and team performance to ensure efficient team dynamics and successful outcomes.",
      url: "teamManagement",
      roles: ["DEPARTMENT_HEAD", "DEPARTMENT_SPORTS_LEAD"],
    },
    {
      text: "Match Management",
      description:
        "Organize and manage scheduled matches by setting up match details, tracking scores, and updating outcomes.",
      url: "matchManagement",
      roles: ["ADMIN", "HELPER"],
    },
    {
      text: "Live Match Management",
      description: "Facilitate real-time match operations including live score updates, match events.",
      url: "liveMatchManagement",
      roles: ["ADMIN", "HELPER"],
    },
    {
      text: "Role Management",
      description: "Define and manage roles for participants and team members.",
      url: "roleManagement",
      roles: ["ADMIN"],
    },
  ];

  return (
    <Box>
      <Heading textAlign="center">Admin Dashboard</Heading>
      <Divider mb={4} />
      <SimpleGrid columns={[1, 2, 2, 2, 3]} gap={4}>
        {things.map((k) => profile && k.roles.includes(profile?.role) && mapper(k.text, k.description, k.url))}
      </SimpleGrid>
    </Box>
  );
};

export default AdminDashboard;
