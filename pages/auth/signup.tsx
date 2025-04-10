import React, { useEffect, useState } from "react";
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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Select,
} from "@chakra-ui/react";
import Card from "../../components/Card/Card";
import { AxiosError } from "axios";
import { RegisterInputs } from "../../types/formInput";
import { useMutation } from "@tanstack/react-query";
import { getCodeRegister, registerUser } from "../../utils/fetchApi";
import { myToast } from "../../utils/myToast";
import { ErrorResponseAPI } from "../../types/error";
import { myErrorBasic } from "../../utils/myError";
import { SubmitHandler, useForm } from "react-hook-form";
import { rules } from "../../utils/myRules";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

interface ModalVerCodeProps {
  visible: boolean;
  onClose: () => void;
  dataReg: RegisterInputs;
}

interface VerCodeInputs {
  code: number | string;
}

const defaultValues: RegisterInputs = {
  emp_id: "",
  name: "",
  email: "",
  password: "",
  confirmPass: "",
  division_name: "",
};

const defaultValuesCode: VerCodeInputs = {
  code: "",
};

const ModalVerCode = ({ visible, onClose, dataReg }: ModalVerCodeProps) => {
  const textColor = useColorModeValue("gray.400", "white");
  const timerColor = useColorModeValue("gray.600", "white");

  const toast = useToast();
  const router = useRouter();
  const [timerModal, setTimerModal] = useState(0);

  const { mutate, isLoading } = useMutation(registerUser, {
    onMutate: (data) => {
      console.log("data mutate: ", data);
    },
    onSuccess: (data) => {
      console.log("data success: ", data);
      onClose();
      myToast.success(toast, `Berhasil registrasi akun ${dataReg.email}`);
      router.push("/auth");
    },
    onError: (error: AxiosError<ErrorResponseAPI>) =>
      myErrorBasic(error, toast),
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<VerCodeInputs>({
    defaultValues,
  });

  const onSubmit: SubmitHandler<VerCodeInputs> = (dataSubmit) => {
    const { code } = dataSubmit;
    const { emp_id, name, email, confirmPass, division_name } = dataReg;

    const dataRegister = {
      emp_id,
      name,
      email,
      password: confirmPass!,
      code: Number(code),
      division_name,
    };

    console.log("data submit", dataRegister);

    return mutate(dataRegister);
  };

  useEffect(() => {
    if (visible) {
      setTimerModal(60);
    }
  }, [visible]);

  useEffect(() => {
    const timeOut4 = setTimeout(() => {
      setTimerModal(45);
    }, 15000);

    const timeOut3 = setTimeout(() => {
      setTimerModal(30);
    }, 30000);

    const timeOut2 = setTimeout(() => {
      setTimerModal(15);
    }, 45000);

    const timeOut1 = setTimeout(() => {
      setTimerModal(0);
    }, 60000);

    if (!visible) {
      clearTimeout(timeOut1);
      clearTimeout(timeOut2);
      clearTimeout(timeOut3);
      clearTimeout(timeOut4);
    }

    return () => {
      clearTimeout(timeOut1);
      clearTimeout(timeOut2);
      clearTimeout(timeOut3);
      clearTimeout(timeOut4);
    };
  }, [visible]);

  useEffect(() => {
    const timerBegin = setInterval(() => {
      setTimerModal(timerModal - 1);
    }, 1000);

    if (timerModal <= 0) {
      clearInterval(timerBegin);
      onClose();
      reset({ ...defaultValuesCode });
    }

    return () => {
      clearInterval(timerBegin);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerModal, reset]);

  return (
    <Modal isOpen={visible} onClose={onClose} size={"sm"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Verification Code</ModalHeader>
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
                {dataReg.email}
              </Text>
            </Box>
            <Box mb="10px" alignItems="center" w="80%">
              <Text
                fontSize="6xl"
                textAlign="center"
                color={timerColor}
                fontWeight="bold"
              >
                {timerModal}
              </Text>
              <Text fontSize="sm" textAlign="center" color={textColor}>
                Silahkan masukan kode verifikasi sebelum waktu habis
              </Text>
            </Box>
          </Flex>
          <form id="form-vercode" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.code ? true : false} mb="24px">
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Enter Verification Code
              </FormLabel>
              <Input
                borderRadius="15px"
                fontSize="xl"
                ps="20px"
                type="number"
                placeholder="Enter code"
                size="xl"
                minH="80px"
                maxLength={10}
                {...register("code", {
                  required: "Verification code tidak boleh kosong!",
                })}
              />
              <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
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
            form="form-vercode"
            isLoading={isLoading}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

function SignUp() {
  // Chakra color mode
  const titleColor = useColorModeValue("teal.300", "teal.200");
  const textColor = useColorModeValue("gray.400", "white");

  const router = useRouter();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dataReg, setDataReg] = useState({} as RegisterInputs);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutate, isLoading } = useMutation(getCodeRegister, {
    onMutate: (data) => {
      console.log("data mutate: ", data);
    },
    onSuccess: (data) => {
      console.log("data success: ", data);
      onOpen();
    },
    onError: (error: AxiosError<ErrorResponseAPI>) =>
      myErrorBasic(error, toast),
  });

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<RegisterInputs>({
    defaultValues,
  });

  const onSubmit: SubmitHandler<RegisterInputs> = (dataSubmit) => {
    const { email, emp_id } = dataSubmit;

    const dataSendCode = {
      email: email,
      emp_id: emp_id,
    };

    console.log("data submit", dataSendCode);

    setDataReg(dataSubmit);
    return mutate(dataSendCode);
  };

  return (
    <Box>
      <ModalVerCode visible={isOpen} onClose={onClose} dataReg={dataReg} />
      <Flex
        minH="100vh"
        w="100%"
        maxW="1044px"
        mx="auto"
        justifyContent="center"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          style={{ userSelect: "none" }}
          w="100%"
          mt="20px"
          mb="20px"
        >
          <Card mx={{ base: "20px", md: "0px" }} w="100%">
            <Flex
              direction="column"
              w="100%"
              background="transparent"
              px={{ base: "18px", md: "48px" }}
              pt="28px"
              pb="28px"
            >
              <Heading color={titleColor} fontSize="36px" mb="10px">
                Create Account,
              </Heading>
              <Text mb="36px" ms="4px" color={textColor} fontSize="16px">
                Sign Up to get started!
              </Text>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Flex
                  flexDir={{ base: "column", md: "row" }}
                  justifyContent="space-between"
                >
                  <Box w={{ base: "100%", md: "46%" }}>
                    <FormControl
                      isInvalid={errors.emp_id ? true : false}
                      mb="24px"
                    >
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        NIK
                      </FormLabel>
                      <Input
                        borderRadius="15px"
                        fontSize="sm"
                        type="text"
                        placeholder="Your NIK"
                        maxLength={12}
                        size="lg"
                        {...register("emp_id", rules.empId)}
                      />
                      <FormErrorMessage>
                        {errors.emp_id?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={errors.name ? true : false}
                      mb="24px"
                    >
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        Full Name
                      </FormLabel>
                      <Input
                        borderRadius="15px"
                        fontSize="sm"
                        type="text"
                        placeholder="Your full name"
                        size="lg"
                        {...register("name", rules.fullName)}
                      />
                      <FormErrorMessage>
                        {errors.name?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={errors.division_name ? true : false}
                      mb="24px"
                    >
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        Division
                      </FormLabel>
                      <Select
                        placeholder="Select Division"
                        borderRadius="15px"
                        fontSize="sm"
                        size="lg"
                        {...register("division_name", rules.division_name)}
                      >
                        <option value="ACCOUNTING">ACCOUNTING</option>
                        <option value="DESIGN & ENGINEERING">
                          DESIGN & ENGINEERING
                        </option>
                        <option value="FINANCE">FINANCE</option>
                        <option value="GENERAL AFFAIR">GENERAL AFFAIR</option>
                        <option value="HUMAN RESOURCES">HUMAN RESOURCES</option>
                        <option value="INFORMATION TECHNOLOGY">
                          INFORMATION TECHNOLOGY
                        </option>
                        <option value="INTERNAL AUDIT & SOP">
                          INTERNAL AUDIT & SOP
                        </option>
                        <option value="INTERNAL CONTROL">
                          INTERNAL CONTROL
                        </option>
                        <option value="PURCHASING">PURCHASING</option>
                        <option value="SALES & MARKETING">
                          SALES & MARKETING
                        </option>
                        <option value="TAX">TAX</option>
                      </Select>
                      <FormErrorMessage>
                        {errors.division_name?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isInvalid={errors.email ? true : false}
                      mb="24px"
                    >
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
                      <FormErrorMessage>
                        {errors.email?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                  <Box w={{ base: "100%", md: "46%" }}>
                    <FormControl
                      isInvalid={errors.password ? true : false}
                      mb="24px"
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
                              setShowConfirmPassword(
                                (showPassword) => !showPassword
                              )
                            }
                          >
                            {showConfirmPassword ? (
                              <ViewIcon />
                            ) : (
                              <ViewOffIcon />
                            )}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.confirmPass?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                </Flex>
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
                  SIGN UP
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
                  I&apos;m already a member,
                  <NextLink href="/auth">
                    <Link
                      color={titleColor}
                      as="span"
                      ms="5px"
                      fontWeight="bold"
                    >
                      Sign In
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
}

export async function getStaticProps() {
  return {
    props: {
      layoutType: "Auth",
    },
  };
}

export default SignUp;
