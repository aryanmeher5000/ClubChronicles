import { Flex, Heading, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { createImageUrlFromId } from "./Utilities/utilFxns";

const Homepage = () => {
  const boxShadow = useColorModeValue("#ddd", "#222");
  return (
    <Flex justifyContent="center" alignItems="center" gap={6} flexDirection="column">
      <Image
        src={createImageUrlFromId("tg2m5rdtu3k9hhxawdmh")}
        borderRadius="full"
        boxShadow={`0px 0px 30px 30px ${boxShadow}`}
        my={6}
      />

      <Heading textAlign="center" fontSize="4xl">
        Satej Sports Club
      </Heading>

      <Text fontWeight={500} textAlign="center">
        Welcome to the official website of Satej Sports Club, where the passion for sports meets a vibrant community of
        athletes, coaches, and supporters. Our club is home to a variety of dynamic teams, each driven by a commitment to
        excellence both on and off the field. Whether you're looking to explore team profiles, stay updated with the latest
        events, or manage match details, our website provides everything you need in one place. Stay informed with important
        club announcements, track upcoming events, and dive into the world of competitive sports with Satej. Join us in
        celebrating teamwork, dedication, and the thrill of the game as we continue to foster a culture of sportsmanship and
        personal growth. At Satej Sports Club, we strive to create an environment that encourages athletes to reach their
        full potential while building lasting bonds within the community. Our teams span across various sports, bringing
        together both experienced players and newcomers eager to develop their skills. The website serves as the central hub
        for everything related to the club, offering seamless access to team management, match updates, scoreboards, and
        event schedules. With a commitment to transparency and engagement, we ensure that every member is informed and
        empowered to contribute to the club’s ongoing success. Whether you’re a player tracking your performance, a coach
        organizing the next big match, or a fan cheering from the sidelines, Satej Sports Club welcomes you to be part of our
        journey. Let’s build a legacy of sportsmanship, camaraderie, and achievement together!
      </Text>
    </Flex>
  );
};

export default Homepage;
