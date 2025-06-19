import {
  Flex,
  Heading,
  Image,
  Text,
  useColorModeValue,
  Box,
  SimpleGrid,
  Icon,
  VStack,
  HStack,
  Button,
  Container,
  Divider,
} from "@chakra-ui/react";
import { FaTrophy, FaUsers, FaCalendarAlt, FaBullseye, FaHandshake, FaStar } from "react-icons/fa";
import { createImageUrlFromId } from "./Utilities/utilFxns";

const Homepage = () => {
  const boxShadow = useColorModeValue("#ddd", "#222");
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, green.50, yellow.50)",
    "linear(to-br, blue.900, green.900, yellow.900)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const accentColor = useColorModeValue("blue.600", "blue.300");

  const features = [
    {
      icon: FaTrophy,
      title: "Excellence",
      description: "Committed to achieving the highest standards in every sport",
    },
    {
      icon: FaUsers,
      title: "Community",
      description: "Building lasting bonds among athletes, coaches, and supporters",
    },
    {
      icon: FaBullseye,
      title: "Performance",
      description: "Track your progress and reach your full potential",
    },
    {
      icon: FaHandshake,
      title: "Sportsmanship",
      description: "Fostering respect, integrity, and fair play in all activities",
    },
  ];

  const stats = [
    { number: "500+", label: "Members" },
    { number: "15", label: "Sports" },
    { number: "50+", label: "Tournaments" },
    { number: "10", label: "Years" },
  ];

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      {/* Hero Section */}
      <Container maxW="7xl" py={10}>
        <Flex justifyContent="center" alignItems="center" gap={8} flexDirection="column" textAlign="center">
          {/* Club Logo */}
          <Box position="relative">
            <Image
              src={createImageUrlFromId("tg2m5rdtu3k9hhxawdmh")}
              borderRadius="full"
              boxShadow={`0px 0px 40px 20px ${boxShadow}`}
              w={["150px", "200px", "250px"]}
              h={["150px", "200px", "250px"]}
              objectFit="cover"
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.05)" }}
            />
            <Box position="absolute" top="-10px" right="-10px" bg="yellow.400" borderRadius="full" p={2} boxShadow="lg">
              <Icon as={FaStar} color="yellow.600" boxSize={6} />
            </Box>
          </Box>

          {/* Main Heading */}
          <VStack spacing={4}>
            <Heading
              fontSize={["3xl", "4xl", "6xl"]}
              fontWeight="bold"
              bgGradient="linear(to-r, blue.600, green.500, yellow.500)"
              bgClip="text"
              letterSpacing="tight"
            >
              Satej Sports Club
            </Heading>
            <Text fontSize={["lg", "xl"]} color={accentColor} fontWeight="600" maxW="2xl">
              Where passion meets excellence in the world of competitive sports
            </Text>
          </VStack>

          {/* CTA Buttons */}
          <HStack spacing={4} mt={6}>
            <Button
              size="lg"
              colorScheme="blue"
              variant="solid"
              leftIcon={<FaUsers />}
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              transition="all 0.3s ease"
            >
              Join Our Community
            </Button>
            <Button
              size="lg"
              colorScheme="green"
              variant="outline"
              leftIcon={<FaCalendarAlt />}
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              transition="all 0.3s ease"
            >
              View Events
            </Button>
          </HStack>
        </Flex>

        {/* Stats Section */}
        <SimpleGrid columns={[2, 4]} spacing={6} mt={16} mb={12}>
          {stats.map((stat, index) => (
            <Box
              key={index}
              bg={cardBg}
              p={6}
              borderRadius="xl"
              textAlign="center"
              boxShadow="lg"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "gray.700")}
              _hover={{ transform: "translateY(-5px)" }}
              transition="all 0.3s ease"
            >
              <Text fontSize="3xl" fontWeight="bold" color={accentColor}>
                {stat.number}
              </Text>
              <Text color={textColor} fontSize="sm" fontWeight="medium">
                {stat.label}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <Divider my={12} />

        {/* Features Section */}
        <VStack spacing={8} mb={12}>
          <Heading fontSize={["2xl", "3xl"]} textAlign="center" color={accentColor}>
            What Makes Us Special
          </Heading>

          <SimpleGrid columns={[1, 2, 4]} spacing={8} w="full">
            {features.map((feature, index) => (
              <Box
                key={index}
                bg={cardBg}
                p={6}
                borderRadius="xl"
                textAlign="center"
                boxShadow="md"
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.700")}
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "xl",
                  borderColor: accentColor,
                }}
                transition="all 0.3s ease"
              >
                <Icon as={feature.icon} boxSize={12} color={accentColor} mb={4} />
                <Heading size="md" mb={3} color={accentColor}>
                  {feature.title}
                </Heading>
                <Text color={textColor} fontSize="sm">
                  {feature.description}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>

        <Divider my={12} />

        {/* About Section */}
        <Box
          bg={cardBg}
          p={8}
          borderRadius="2xl"
          boxShadow="xl"
          border="1px solid"
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <VStack spacing={6} textAlign="center">
            <Heading fontSize={["xl", "2xl"]} color={accentColor}>
              Welcome to Our Sports Family
            </Heading>

            <Text color={textColor} fontSize={["md", "lg"]} lineHeight="1.8" maxW="4xl">
              Welcome to the official website of Satej Sports Club, where the passion for sports meets a vibrant community of
              athletes, coaches, and supporters. Our club is home to a variety of dynamic teams, each driven by a commitment
              to excellence both on and off the field.
            </Text>

            <Text color={textColor} fontSize={["md", "lg"]} lineHeight="1.8" maxW="4xl">
              Whether you're looking to explore team profiles, stay updated with the latest events, or manage match details,
              our website provides everything you need in one place. Join us in celebrating teamwork, dedication, and the
              thrill of the game as we continue to foster a culture of sportsmanship and personal growth.
            </Text>

            <Box
              bg={useColorModeValue("blue.50", "blue.900")}
              p={6}
              borderRadius="xl"
              border="2px solid"
              borderColor={accentColor}
              maxW="3xl"
            >
              <Text color={accentColor} fontSize="lg" fontWeight="600" fontStyle="italic">
                "At Satej Sports Club, we don't just play sports – we build champions, forge friendships, and create memories
                that last a lifetime."
              </Text>
            </Box>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Homepage;
