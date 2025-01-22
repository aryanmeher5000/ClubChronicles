import { Flex, Button, HStack, Text, Box, Image, useColorModeValue } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useSignup, { SignupFormData, signupSchema } from "../Hooks/useSignup";
import Password from "../../Utilities/Password";
import NameTitle from "../../Utilities/NameTitle";
import DeptSprtYear from "../../Utilities/DeptSprtYear";
import { Link } from "react-router-dom";
import { createImageUrlFromId } from "../../Utilities/utilFxns";

const Signup = () => {
  const { mutate, isPending } = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({ resolver: zodResolver(signupSchema) });
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
      <Box p={4} borderRadius={8} bg={bg}>
        <form onSubmit={handleSubmit((data) => mutate(data))} className="selectedForm">
          <NameTitle
            label="Name"
            placeholder="John Doe"
            isReq={true}
            registerFxn={register("name")}
            width="100%"
            error={errors.name}
          />

          <NameTitle
            label="Email"
            placeholder="johndoe@email.com"
            isReq={true}
            registerFxn={register("email")}
            width="100%"
            error={errors.email}
            type="email"
          />

          <Password registerFxn={register("password")} error={errors.password} />
          <Text fontSize="xs" p={2} color="grey" mb={2} mt={-6}>
            Pasword must be 8 characters long and have an UPPERCASE and a SPECIAL CHARACTER.
          </Text>

          <DeptSprtYear
            label="Select:"
            registerDept={register("department")}
            registerGender={register("gender")}
            errDept={errors.department}
            errYear={errors.gender}
            isReq={true}
            inclSport={false}
            width="100%"
          />
          <HStack mt={6} justify="center" w="100%">
            <Button colorScheme="green" type="submit" isDisabled={isPending || !isValid}>
              {isPending ? "Signing Up..." : "Sign Up"}
            </Button>
          </HStack>
        </form>
      </Box>

      <Text mt={4} mb={2}>
        Already have an account?
      </Text>
      <Box color="green.300" fontWeight={700} borderBottom="1px solid #03b57b" mb={4}>
        <Link to={"/login"}>Login</Link>
      </Box>
    </Flex>
  );
};

export default Signup;
