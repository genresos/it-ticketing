import React, { useContext, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  useToast,
  useColorModeValue,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { AuthContext } from "../../store/AuthContext";
import { Card } from "../../components/Card";
import { LoginInputs } from "../../types/formInput";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../utils/fetchApi";
import { myToast } from "../../utils/myToast";
import { UserData } from "../../types/userData";
import { AxiosError } from "axios";
import { ErrorResponseAPI } from "../../types/error";
import { myErrorBasic } from "../../utils/myError";
import { useForm, SubmitHandler } from "react-hook-form";
import { rules } from "../../utils/myRules";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const defaultValues: LoginInputs = {
  email: "",
  password: "",
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.400", "white");

  const router = useRouter();
  const toast = useToast();

  const { signIn } = useContext(AuthContext);
  const { mutate, isLoading } = useMutation(loginUser, {
    onSuccess: ({ token, user }: { token: string; user: UserData }) => {
      myToast.success(toast, `Selamat Datang, ${user.name}`);
      signIn({ user, token });
      router.push("/dashboard");
    },
    onError: (err: AxiosError<ErrorResponseAPI>) => myErrorBasic(err, toast),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginInputs>({ defaultValues });

  const onSubmit: SubmitHandler<LoginInputs> = (dataSubmit) =>
    mutate(dataSubmit);

  return (
    <Box>
      <Flex
        minH="100vh"
        w="full"
        maxW="1044px"
        mx="auto"
        justifyContent="center"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          style={{ userSelect: "none" }}
          w={{ base: "100%", md: "50%", lg: "42%" }}
          mt="20px"
          mb="20px"
        >
          <Card mx={{ base: "20px", md: "0px" }}>
            <Flex
              direction="column"
              minW={{ base: "320px", md: "340px" }}
              background="transparent"
              px={{ base: "18px", md: "48px" }}
              pt="28px"
              pb="28px"
            >
              <Heading color={titleColor} fontSize="36px" mb="10px">
                Welcome,
              </Heading>
              <Text mb="36px" ms="4px" color={textColor} fontSize="16px">
                Sign In to continue!
              </Text>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={errors.email ? true : false} mb="24px">
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Email
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    fontSize="sm"
                    type="email"
                    placeholder="Your email adress"
                    size="lg"
                    {...register("email", rules.email)}
                  />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={errors.password ? true : false}
                  mb="36px"
                >
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Password
                  </FormLabel>
                  <InputGroup borderRadius="15px" size="lg">
                    <Input
                      fontSize="sm"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      {...register("password", rules.password)}
                    />
                    <InputRightElement h={"full"}>
                      <Button
                        variant={"ghost"}
                        onClick={() =>
                          setShowPassword((showPassword) => !showPassword)
                        }
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.password?.message}
                  </FormErrorMessage>
                </FormControl>
                <Box>
                  <NextLink href="/auth/forgot">
                    <Link color={titleColor} as="span">
                      Forgot Password?
                    </Link>
                  </NextLink>
                </Box>
                <Button
                  fontSize="10px"
                  bg="teal.300"
                  w="100%"
                  h="45"
                  mb="20px"
                  color="white"
                  mt="20px"
                  _hover={{
                    bg: "teal.200",
                  }}
                  _active={{
                    bg: "teal.400",
                  }}
                  type="submit"
                  isLoading={isLoading}
                >
                  SIGN IN
                </Button>
              </form>
              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                maxW="100%"
                mt="0px"
              >
                <Text color={textColor} fontWeight="medium">
                  I&apos;m a new user,
                  <NextLink href="/auth/signup">
                    <Link
                      color={titleColor}
                      as="span"
                      ms="5px"
                      fontWeight="bold"
                    >
                      Sign Up
                    </Link>
                  </NextLink>
                </Text>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Flex>
    </Box>
  );
};

export async function getStaticProps() {
  return {
    props: {
      layoutType: "Auth",
    },
  };
}

export default Login;
