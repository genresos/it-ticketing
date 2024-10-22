import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ErrorResponseAPI } from "../../types/error";
import { ForgotPassGetInputs, ForgotPassInputs } from "../../types/formInput";
import { forgotPass, getCodeForgotPass } from "../../utils/fetchApi";
import { myErrorBasic } from "../../utils/myError";
import { rules } from "../../utils/myRules";
import { myToast } from "../../utils/myToast";

interface ModalVerCodeProps {
  visible: boolean;
  onClose: () => void;
  email: string;
}

const defaultValues: ForgotPassGetInputs = {
  email: "",
};

const defaultValuesReset: ForgotPassInputs = {
  code: "",
  email: "",
  password: "",
};

const ModalVerCodePass = ({ visible, onClose, email }: ModalVerCodeProps) => {
  const textColor = useColorModeValue("gray.400", "white");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toast = useToast();
  const router = useRouter();

  const { mutate, isLoading } = useMutation(forgotPass, {
    onSuccess: (dataSuccess) => {
      console.log("success forgot: ", dataSuccess);
      onClose();
      myToast.success(toast, `Berhasil reset password ${email}`);
      router.push("/auth");
    },
    onError: (err: AxiosError<ErrorResponseAPI>) => myErrorBasic(err, toast),
  });

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<ForgotPassInputs>({ defaultValues: defaultValuesReset });

  const onSubmit: SubmitHandler<ForgotPassInputs> = (dataSubmit) => {
    const { code, confirmPass } = dataSubmit;

    const dataForgotPass: ForgotPassInputs = {
      email,
      code: Number(code),
      password: confirmPass!,
    };

    mutate(dataForgotPass);
  };

  return (
    <Modal isOpen={visible} onClose={onClose} size={"sm"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Forgot Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex alignItems="center" flexDir="column" w="full">
            <Box mb="10px">
              <Text color={textColor} fontSize="sm" textAlign="center">
                Verification code sudah dikirim ke
              </Text>
              <Text
                color={textColor}
                fontSize="sm"
                textAlign="center"
                fontWeight="bold"
              >
                {email}
              </Text>
            </Box>
          </Flex>
          <form id="form-vercode-pass" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.code} mb="24px">
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Enter Verification Code
              </FormLabel>
              <Input
                fontSize="sm"
                type="number"
                placeholder="Enter code"
                size="lg"
                maxLength={10}
                {...register("code", {
                  required: "Verification code tidak boleh kosong!",
                })}
              />
              <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.password} mb="24px">
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
              <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={errors.confirmPass ? true : false}
              mb="24px"
            >
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Confirm Password
              </FormLabel>
              <InputGroup borderRadius="15px" size="lg">
                <Input
                  fontSize="sm"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Your confirm password"
                  {...register(
                    "confirmPass",
                    rules.confirmPass(watch("password"))
                  )}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowConfirmPassword((showPassword) => !showPassword)
                    }
                  >
                    {showConfirmPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPass?.message}</FormErrorMessage>
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            bg="teal.300"
            color="white"
            _hover={{
              bg: "teal.200",
            }}
            _active={{
              bg: "teal.400",
            }}
            type="submit"
            form="form-vercode-pass"
            isLoading={isLoading}
          >
            Change Password
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const ForgotPass = () => {
  const [email, setEmail] = useState("");
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.400", "white");

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutate, isLoading } = useMutation(getCodeForgotPass, {
    onSuccess: (dataSuccess) => {
      console.log("success get code: ", dataSuccess);
      onOpen();
    },
    onError: (err: AxiosError<ErrorResponseAPI>) => myErrorBasic(err, toast),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ForgotPassGetInputs>({ defaultValues });

  const onSubmit: SubmitHandler<ForgotPassGetInputs> = (dataSubmit) => {
    setEmail(dataSubmit.email);
    mutate({ email: dataSubmit.email });
  };

  return (
    <Box>
      <ModalVerCodePass visible={isOpen} onClose={onClose} email={email} />
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
                Forgot Password,
              </Heading>
              <Text mb="36px" ms="4px" color={textColor} fontSize="16px">
                Forgot password to get new password!
              </Text>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={errors.email ? true : false} mb="24px">
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
                  GET CODE
                </Button>
              </form>
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

export default ForgotPass;
