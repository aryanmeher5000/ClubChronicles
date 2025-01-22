import { createBrowserRouter } from "react-router-dom";
import Homepage from "./Homepage";
import Signup from "./Authentication/Components/Signup";
import Login from "./Authentication/Components/Login";
import Teams from "./Team/Components/Teams";
import Announcements from "./Announcement/Components/Announcements";
import ParticularTeam from "./Team/Components/ParticularTeam";
import CreateAnnouncement from "./Announcement/Components/CreateAnnouncement";
import CreateTeam from "./Team/Components/CreateTeam";
import UpdateTeam from "./Team/Components/UpdateTeam";
import ParticularAnnouncement from "./Announcement/Components/ParticularAnnouncement";
import AnnouncementDashBoard from "./Announcement/Components/AnnouncementDashBoard";
import TeamDashboard from "./Team/Components/TeamDashboard";
import Logout from "./Authentication/Components/Logout";
import Applications from "./Application/Components/Applications";
import UpdateProfile from "./Profile/Components/UpdateProfile";
import AdminDashboard from "./AdminDashboard/Components/AdminDashboard";
import Matches from "./Match/Matches";
import Departments from "./Department/Components/Departments";
import ParticularDepartment from "./Department/Components/ParticularDepartment";
import DepartmentDashboardAdmin from "./Department/Components/DepartmentDashboardAdmin";
import CreateLiveMatch from "./Match/MatchManagement/Components/CreateLiveMatch";
import ScoreUpdationPage from "./Match/LiveMatches/Components/ScoreUpdationPage";
import Scoreboard from "./Match/LiveMatches/Components/Scoreboard";
import LiveMatches from "./Match/LiveMatches/Components/LiveMatches";
import ManageTeam from "./Team/Components/ManageTeam";
import RoleManagement from "./AdminDashboard/Components/RoleManagement";
import PointTable from "./PointTable/Components/PointTable";
import PointTableParticularDepartment from "./PointTable/Components/PointTableParticularDepartment";
import TimeTable from "./GCnTT/Components/TimeTable";
import Profile from "./Profile/Components/Profile";
import CreateDepartment from "./Department/Components/CreateDepartment";
import UpdateDepartment from "./Department/Components/UpdateDepartment";
import CreateGCSession from "./GCnTT/Components/CreateGCSession";
import GCArchive from "./GCnTT/Components/GCArchive";
import GCDashboard from "./GCnTT/Components/GCDashboard";
import DepartmentDashboard from "./Department/Components/DepartmentDashboard";
import ErrorPage from "./ErrorPages/ErrorPage";
import UpNSumMatches from "./Match/UpNSumMatches/Components/UpNSumMatches";
import MatchDashboard from "./Match/MatchManagement/Components/MatchDashboard";
import CreateUpcomingMatch from "./Match/MatchManagement/Components/CreateUpcomingMatch";
import CreateMatchSummary from "./Match/MatchManagement/Components/CreateMatchSummary";
import LiveMatchManagement from "./Match/MatchManagement/Components/LiveMatchManagement";
import Layout from "./Layouts/Layout";
import AdminRoutesLayout from "./Layouts/AdminRoutesLayout";
import LiveMatchRouteLayout from "./Layouts/LiveMatchRouteLayout";
import TimeTableManagement from "./GCnTT/Components/TimeTableManagement";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "profile/ownProfile/updateProfile", element: <UpdateProfile /> },
      { path: "profile/:id", element: <Profile /> },

      { path: "departments", element: <Departments /> },
      { path: "departments/:id", element: <ParticularDepartment /> },

      { path: "teams", element: <Teams /> },
      { path: "teams/:id", element: <ParticularTeam /> },
      { path: "applications", element: <Applications /> },

      { path: "announcements", element: <Announcements /> },
      { path: "announcements/:id", element: <ParticularAnnouncement /> },

      { path: "timeTable", element: <TimeTable /> },
      { path: "pointTable", element: <PointTable /> },
      { path: "pointTable/:id", element: <PointTableParticularDepartment /> },
      { path: "gcArchive", element: <GCArchive /> },

      { path: "matches", element: <Matches /> },
      { path: "matches/:endPoint", element: <UpNSumMatches /> },

      {
        path: "/",
        element: <AdminRoutesLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "adminDashboard",
            element: <AdminDashboard />,
          },
          {
            path: "adminDashboard/announcementManagement",
            element: <AnnouncementDashBoard />,
          },
          {
            path: "adminDashboard/announcementManagement/createAnnouncement",
            element: <CreateAnnouncement />,
          },
          {
            path: "adminDashboard/departmentManagement",
            element: <DepartmentDashboard />,
          },
          {
            path: "adminDashboard/departmentManagement/updateDepartment/:id",
            element: <UpdateDepartment />,
          },
          {
            path: "adminDashboard/departmentManagementAdmin",
            element: <DepartmentDashboardAdmin />,
          },
          {
            path: "adminDashboard/departmentManagementAdmin/createDepartment",
            element: <CreateDepartment />,
          },
          {
            path: "adminDashboard/departmentManagementAdmin/updateDepartment/:id",
            element: <UpdateDepartment />,
          },
          {
            path: "adminDashboard/gcManagement",
            element: <GCDashboard />,
          },
          {
            path: "adminDashboard/timeTableManagement",
            element: <TimeTableManagement />,
          },
          {
            path: "adminDashboard/gcManagement/createGCRecord",
            element: <CreateGCSession />,
          },
          {
            path: "adminDashboard/roleManagement",
            element: <RoleManagement />,
          },
          {
            path: "adminDashboard/teamManagement",
            element: <TeamDashboard />,
          },
          {
            path: "adminDashboard/teamManagement/createTeam",
            element: <CreateTeam />,
          },
          {
            path: "adminDashboard/teammanagement/updateTeam/:id",
            element: <UpdateTeam />,
          },
          {
            path: "adminDashboard/teammanagement/manageTeam/:id",
            element: <ManageTeam />,
          },
          {
            path: "adminDashboard/matchManagement",
            element: <MatchDashboard />,
          },
          {
            path: "adminDashboard/matchManagement/createUpcomingMatch",
            element: <CreateUpcomingMatch />,
          },
          {
            path: "adminDashboard/matchManagement/createMatchSummary",
            element: <CreateMatchSummary />,
          },
        ],
      },
      {
        path: "/",
        element: <LiveMatchRouteLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "matches/liveMatches/:roomId",
            element: <Scoreboard />,
          },
          { path: "matches/live", element: <LiveMatches /> },
          {
            path: "/",
            element: <AdminRoutesLayout />,
            children: [
              {
                path: "adminDashboard/liveMatchManagement",
                element: <LiveMatchManagement />,
              },
              {
                path: "adminDashboard/liveMatchManagement/createLiveMatch",
                element: <CreateLiveMatch />,
              },
              {
                path: "adminDashboard/liveMatchManagement/scoreUpdation/:roomId",
                element: <ScoreUpdationPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  { path: "/logout", element: <Logout /> },
]);

export default router;
