import { Box, Divider, Heading, Text, Link, Flex } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useGetParticularAnnouncement } from "../Hooks/useGetParticularAnnouncement";
import { useParams } from "react-router-dom";
import { createImageUrlFromId, readableDate } from "../../Utilities/utilFxns";
import SkeletonPage from "../../Utilities/SkeletonPage";
import ZoomableImage from "../../Utilities/ZoomableImage";
import useClientStateManagement from "../../store";
import TagStack from "../../Utilities/TagStack";
import ErrorDisplay from "../../ErrorPages/ErrorDisplay";

const ParticularAnnouncement = () => {
  const fw = 500;
  const fs = "2.4vh";

  const { id } = useParams();
  const { data, error, isLoading, refetch } = useGetParticularAnnouncement(id);
  const profile = useClientStateManagement((p) => p.profile);

  if (isLoading) return <SkeletonPage withImage={false} />;
  if (error) return <ErrorDisplay errorObj={error} retryFxn={refetch} />;

  return (
    <Flex alignItems="center" direction="column">
      <Heading textAlign="center">{data?.body?.title}</Heading>
      <Divider mb={4} />

      {profile?.isAdmin && (
        <>
          <Text className="idStyle">Announcement ID- {data?.body?._id}</Text>
          <Divider mb={4} />
        </>
      )}

      <Text fontWeight={fw} textAlign="center">
        Announcement Description
      </Text>
      <Text p={4} textAlign="center">
        {data?.body?.description ? data.body?.description : "No description provided."}
      </Text>
      <Divider mb={4} />

      {data?.body?.images && data.body?.images.length > 0 && (
        <>
          <Text fontWeight={fw} textAlign="center" mb={4}>
            Related Image Attachments
          </Text>
          <Flex alignItems="center" gap={5} direction={["column", "column", "row"]}>
            {data.body?.images.map((k) => (
              <ZoomableImage key={k} imgSource={k} borderRadius={15} width="full" zoomedWidth="70vw" zoomedHeight="80vh" />
            ))}
          </Flex>
          <Divider my={4} />
        </>
      )}

      {data?.body?.pdf && data.body.pdf.length > 0 && (
        <>
          <Text fontWeight={fw} textAlign="center" mb={4}>
            Related File Attachments
          </Text>
          <Link
            href={createImageUrlFromId(data?.body?.pdf[0])}
            isExternal
            bg="#f04d50"
            color="white"
            p={3}
            borderRadius={15}
            fontWeight={600}
            w="fit-content"
          >
            View Related File <ExternalLinkIcon mt={-1} />
          </Link>
          <Divider my={4} />
        </>
      )}

      {data?.body?.url && (
        <>
          <Text fontWeight={fw} fontSize={fs} my={4}>
            Related URL:
          </Text>
          <Link href={data.body.url} isExternal bg="#03b57b" color="white" p={3} borderRadius={15} fontWeight={600}>
            External Link <ExternalLinkIcon mx="2px" mt={-1} />
          </Link>
          <Divider my={4} />
        </>
      )}

      <Box p={4} w="fit-content" border="2px solid #e5e5e5" borderRadius={15}>
        <Text fontWeight={600}>From : {data?.body?.createdBy?.name || "Deleted Profile"}</Text>
        <Divider my={2} />
        <TagStack
          title="For:"
          department={data?.body.department?.name || "ALL"}
          sport={data?.body?.sport || "ALL"}
          gender={data?.body?.gender || "ALL"}
        />
        <Divider my={2} />
        <Text>{data?.body && readableDate(data.body.createdAt)}</Text>
      </Box>
    </Flex>
  );
};

export default ParticularAnnouncement;
