import React, { useContext, useState } from "react";
import NextLink from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Link,
  Text,
  FormControl,
  FormLabel,
  Input,
  useToast,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
} from "@chakra-ui/react";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";
import { IoMail } from "react-icons/io5";
import withAuth from "../../HOC/withAuth";
import { AuthContext } from "../../store/AuthContext";
import Navbar from "../../components/Navbar";
import { ChangePasswordInputs } from "../../types/formInput";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../utils/fetchApi";
import { myToast } from "../../utils/myToast";
import { AxiosError } from "axios";
import { ErrorResponseAPI } from "../../types/error";
import { myError } from "../../utils/myError";
import { SubmitHandler, useForm } from "react-hook-form";
import { rules } from "../../utils/myRules";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const defaultValues: ChangePasswordInputs = {
  old_password: "",
  password: "",
  new_password: "",
};

// Assets
const ProfileBgImage = "/img/ProfileBackground.png";

const Profile = () => {
  const { userData, userToken, signOut } = useContext(AuthContext);
  const toast = useToast();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate, isLoading } = useMutation(changePassword, {
    onSuccess: (dataSuccess) => {
      console.log("success change pass: ", dataSuccess);
      myToast.success(toast, "Berhasil Ubah Password");
      signOut();
    },
    onError: (err: AxiosError<ErrorResponseAPI>) =>
      myError(err, toast, signOut),
  });

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordInputs>({ defaultValues });

  const onSubmit: SubmitHandler<ChangePasswordInputs> = (dataSubmit) =>
    mutate({ data: dataSubmit, token: userToken });

  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");
  const bgProfile = useColorModeValue(
    "hsla(0,0%,100%,.8)",
    "linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)"
  );
  const borderProfileColor = useColorModeValue(
    "white",
    "rgba(255, 255, 255, 0.31)"
  );
  const emailColor = useColorModeValue("gray.400", "gray.300");
  return (
    <Box>
      <Navbar
        title="PROFILE"
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink as={NextLink} href="/dashboard">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Profile</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        }
      >
        <Flex direction="column" pt="20px">
          <Box
            mb={{ base: "205px", md: "75px", xl: "70px" }}
            borderRadius="15px"
            px="0px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Box
              bgImage={ProfileBgImage}
              w="100%"
              h="300px"
              borderRadius="25px"
              bgPosition="50%"
              bgRepeat="no-repeat"
              position="relative"
              display="flex"
              justifyContent="center"
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                mx="1.5rem"
                maxH="330px"
                w={{ base: "90%", xl: "95%" }}
                justifyContent={{ base: "center", md: "space-between" }}
                align="center"
                backdropFilter="saturate(200%) blur(50px)"
                position="absolute"
                boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
                border="2px solid"
                borderColor={borderProfileColor}
                bg={bgProfile}
                p="24px"
                borderRadius="20px"
                transform={{
                  base: "translateY(45%)",
                  md: "translateY(110%)",
                  lg: "translateY(160%)",
                }}
              >
                <Flex
                  align="center"
                  mb={{ base: "10px", md: "0px" }}
                  direction={{ base: "column", md: "row" }}
                  w={{ sm: "100%" }}
                  textAlign={{ base: "center", md: "start" }}
                >
                  {userData.images === 0 ? (
                    <Flex
                      me={{ md: "22px" }}
                      w="80px"
                      h="80px"
                      borderRadius="15px"
                      bg="teal.300"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        color="white"
                        textTransform="uppercase"
                        fontSize="4xl"
                      >
                        {userData.name.substring(0, 1)}
                      </Text>
                    </Flex>
                  ) : (
                    <Avatar
                      me={{ md: "22px" }}
                      src={`http://192.168.0.5/storage/profiles/pictures/${userData.profile_images}.png`}
                      w="80px"
                      h="80px"
                      borderRadius="15px"
                    />
                  )}
                  <Flex
                    direction="column"
                    maxWidth="100%"
                    my={{ base: "14px", md: "inherite" }}
                  >
                    <Text
                      fontSize={{ base: "lg", lg: "xl" }}
                      color={textColor}
                      fontWeight="bold"
                      ms={{ base: "8px", md: "0px" }}
                    >
                      {userData.name}
                    </Text>
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      color={emailColor}
                      fontWeight="semibold"
                    >
                      {userData.emp_id}
                    </Text>
                  </Flex>
                </Flex>
                <Flex
                  direction={{ base: "column", lg: "row" }}
                  w={{ base: "100%", md: "50%", lg: "auto" }}
                >
                  <Button p="0px" bg="transparent" _hover={{ bg: "none" }}>
                    <Flex
                      align="center"
                      w="100%"
                      bg="hsla(0,0%,100%,.3)"
                      borderRadius="15px"
                      justifyContent="center"
                      py="10px"
                      px="20px"
                      boxShadow="inset 0 0 1px 1px hsl(0deg 0% 100% / 90%), 0 20px 27px 0 rgb(0 0 0 / 5%)"
                      border="1px solid gray.200"
                      cursor="pointer"
                    >
                      <Icon as={IoMail} me="6px" />
                      <Link href={`mailto:${userData.email}`}>
                        <Text fontSize="sm" color={textColor} fontWeight="bold">
                          {userData.email}
                        </Text>
                      </Link>
                    </Flex>
                  </Button>
                </Flex>
              </Flex>
            </Box>
          </Box>
          <Card p="30px" mb="24px" mt={{ base: "-90px", md: "24px" }}>
            <CardHeader p="12px 5px" mb="12px">
              <Flex direction="column">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Change Password
                </Text>
                <Text fontSize="sm" color="gray.500" fontWeight="400">
                  Update your password
                </Text>
              </Flex>
            </CardHeader>
            <CardBody px="5px">
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl
                  isInvalid={errors.old_password ? true : false}
                  mb="24px"
                >
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Current Password
                  </FormLabel>
                  <InputGroup borderRadius="15px" size="lg">
                    <Input
                      fontSize="sm"
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Input current password"
                      {...register("old_password", rules.password)}
                    />
                    <InputRightElement h={"full"}>
                      <Button
                        variant={"ghost"}
                        onClick={() =>
                          setShowOldPassword((showPassword) => !showPassword)
                        }
                      >
                        {showOldPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.old_password?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={errors.password ? true : false}
                  mb="24px"
                >
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    New Password
                  </FormLabel>
                  <InputGroup borderRadius="15px" size="lg">
                    <Input
                      fontSize="sm"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Input new password"
                      {...register(
                        "password",
                        rules.newPassword(watch("old_password"))
                      )}
                    />
                    <InputRightElement h={"full"}>
                      <Button
                        variant={"ghost"}
                        onClick={() =>
                          setShowNewPassword((showPassword) => !showPassword)
                        }
                      >
                        {showNewPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.password?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={errors.new_password ? true : false}
                  mb="24px"
                >
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Confirm New Password
                  </FormLabel>
                  <InputGroup borderRadius="15px" size="lg">
                    <Input
                      fontSize="sm"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Input confirm new password"
                      {...register(
                        "new_password",
                        rules.confirmPass(watch("password") || "")
                      )}
                    />
                    <InputRightElement h={"full"}>
                      <Button
                        variant={"ghost"}
                        onClick={() =>
                          setShowConfirmPassword(
                            (showPassword) => !showPassword
                          )
                        }
                      >
                        {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>
                    {errors.new_password?.message}
                  </FormErrorMessage>
                </FormControl>
                <Button
                  fontSize="14px"
                  type="submit"
                  bg="teal.300"
                  w="100%"
                  h="45"
                  mb="20px"
                  color="white"
                  mt={{ base: "20px", md: "40px" }}
                  _hover={{
                    bg: "teal.200",
                  }}
                  _active={{
                    bg: "teal.400",
                  }}
                  disabled={isLoading}
                >
                  SUBMIT
                </Button>
              </form>
            </CardBody>
          </Card>
        </Flex>
      </Navbar>
    </Box>
  );
};

export default withAuth(Profile);
