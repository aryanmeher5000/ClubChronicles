import { Flex, Button, Box, HStack, Text, Image, useColorModeValue } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema, useLogin } from "../Hooks/useLogin";
import NameTitle from "../../Utilities/NameTitle";
import Password from "../../Utilities/Password";
import { Link } from "react-router-dom";
import { createImageUrlFromId } from "../../Utilities/utilFxns";

const Login = () => {
  const { mutate, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const bg = useColorModeValue("blackAlpha.100", "whiteAlpha.200");
  const boxShadow = useColorModeValue("#ddd", "#222");

  return (
    <Flex minH="100vh" alignItems="center" justifyContent="center" flexDirection="column" p={2}>
      <Image
        src={createImageUrlFromId("tg2m5rdtu3k9hhxawdmh")}
        boxSize="15vh"
        borderRadius={20}
        boxShadow={`0px 0px 30px 30px ${boxShadow}`}
        my={8}
      />
      <Box p={4} borderRadius={8} boxShadow="lg" bg={bg} minW={["100%", "100%", "40vw"]}>
        <form onSubmit={handleSubmit((d) => mutate(d))} className="selectedForm">
          <NameTitle
            label="Email"
            placeholder="johndoe@email.com"
            isReq={true}
            registerFxn={register("email")}
            width="100%"
            error={errors.email}
          />

          <Password registerFxn={register("password")} error={errors.password} />

          <HStack mt={6} justify="center" w="100%">
            <Button colorScheme="green" type="submit" isDisabled={isPending} borderRadius={20}>
              {isPending ? "Logging In..." : "Login"}
            </Button>
          </HStack>
        </form>
      </Box>
      <Text mt={4} mb={2}>
        New to LiveApp?
      </Text>
      <Box color="green.300" fontWeight={700} borderBottom="1px solid #03b57b" mb={4}>
        <Link to={"/signup"}>Signup</Link>
      </Box>
    </Flex>
  );
};

export default Login;
