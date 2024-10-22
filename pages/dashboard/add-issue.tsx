import React, { useContext, useMemo, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  Flex,
  Text,
  Select as ChakraSelect,
  useToast,
  useColorModeValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import withAuth from "../../HOC/withAuth";
import Card from "../../components/Card/Card";
import CardBody from "../../components/Card/CardBody";
import CardHeader from "../../components/Card/CardHeader";
import { Select, GroupBase } from "chakra-react-select";
import { AddIssueInputs } from "../../types/formInput";
import { AuthContext } from "../../store/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ListGeneral, ProjectList } from "../../types/dataList";
import { AxiosError } from "axios";
import { ErrorResponseAPI } from "../../types/error";
import {
  addIssueICT,
  getIssueIctMember,
  getIssuePriority,
  getProjectWithSearch,
} from "../../utils/fetchApi";
import { myError, myErrorSSR } from "../../utils/myError";
import { ListSelect } from "../../types";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { myToast } from "../../utils/myToast";
import { GetServerSideProps, NextPage } from "next";
import { useSearchDebounce } from "../../hooks";

interface AddIssueForm extends Omit<AddIssueInputs, "project_no"> {
  project_no?: ListSelect;
}

const defaultValues: AddIssueForm = {
  title: "",
  description: "",
  priority_id: "",
  project_no: undefined,
  asset_name: "",
  assigned: [],
};

interface Props {
  priority: ListGeneral[];
  member: ListSelect[];
}

const AddIssue: NextPage<Props> = ({ priority, member }) => {
  const { userToken, signOut } = useContext(AuthContext);

  const Router = useRouter();
  const toast = useToast();
  const [searchProject, setSearchProject] = useState("");
  const { dataSearch } = useSearchDebounce(searchProject, 1000);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<AddIssueForm>({
    defaultValues,
  });

  const { data: dataProject, isFetching } = useQuery<
    ProjectList[],
    AxiosError<ErrorResponseAPI>
  >(
    ["get-project", dataSearch],
    () => getProjectWithSearch(dataSearch, userToken),
    {
      onError: (error: AxiosError<ErrorResponseAPI>) =>
        myError(error, toast, signOut),
    }
  );

  const { mutate, isLoading } = useMutation(addIssueICT, {
    onMutate: (dataMutate) => {
      console.log("data mutate: ", dataMutate);
    },
    onSuccess: (dataSuccess) => {
      console.log("data success: ", dataSuccess);
      myToast.success(toast, "Berhasil Post Issue");
      Router.push("/dashboard/issues");
    },
    onError: (error: AxiosError<ErrorResponseAPI>) =>
      myError(error, toast, signOut),
  });

  const newProjectList = useMemo<ListSelect[]>(() => {
    if (!dataProject) {
      return [];
    }

    return dataProject.map((item) => {
      return {
        value: String(item.project_no),
        label: `${item.code} - ${item.name}`,
      };
    });
  }, [dataProject]);

  const onSubmit: SubmitHandler<AddIssueForm> = (dataSubmit) => {
    const {
      title,
      description,
      priority_id,
      assigned,
      project_no,
      asset_name,
    } = dataSubmit;

    const dataPostTicket = {
      title,
      description,
      priority_id: Number(priority_id),
      project_no: Number(project_no?.value),
      asset_name,
      assigned_1: Number(assigned![0]?.value),
      assigned_2:
        assigned![1]?.value === undefined ? 0 : Number(assigned![1].value),
      assigned_3:
        assigned![2]?.value === undefined ? 0 : Number(assigned![2].value),
    };
    console.log("data submit", dataPostTicket);

    return mutate({ data: dataPostTicket, token: userToken });
  };

  // Chakra color mode
  const textColor = useColorModeValue("gray.700", "white");

  return (
    <Box>
      <Navbar
        title="ADD ISSUE"
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink as={NextLink} href="/dashboard">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>Add Issue</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        }
      >
        <Flex direction="column" pt="20px">
          <Card p="40px">
            <CardHeader mt="10px">
              <Flex minHeight="60px" w="100%">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Add Issue
                </Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Flex flexDir={{ base: "column", md: "row" }}>
                  <Box
                    mr={{ base: "0px", md: "30px" }}
                    w={{ base: "inherit", md: "48%" }}
                  >
                    <FormControl
                      isInvalid={errors.title ? true : false}
                      mb="24px"
                    >
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        Title
                      </FormLabel>
                      <Input
                        borderRadius="15px"
                        fontSize="sm"
                        type="text"
                        placeholder="Input title issue"
                        maxLength={60}
                        size="lg"
                        {...register("title", {
                          required: "Title tidak boleh kosong!",
                        })}
                      />
                      <FormErrorMessage>
                        {errors.title?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl mb="24px">
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        No Asset
                      </FormLabel>
                      <Input
                        borderRadius="15px"
                        fontSize="sm"
                        type="text"
                        placeholder="Input asset number"
                        maxLength={60}
                        size="lg"
                        {...register("asset_name", { required: false })}
                      />
                    </FormControl>
                {/*    <FormControl mb="24px" isInvalid={!!errors.project_no}>
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        Project Code
                      </FormLabel>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Select<ListSelect, false, GroupBase<ListSelect>>
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            options={newProjectList}
                            placeholder="pilih kode project"
                            filterOption={(_, src) => {
                              setSearchProject(src);
                              return true;
                            }}
                            closeMenuOnSelect={true}
                            isLoading={isFetching}
                          />
                        )}
                        name="project_no"
                        rules={{ required: "Kode Project tidak boleh kosong!" }}
                      />
                      <FormErrorMessage>
                        {errors.project_no?.message}
                      </FormErrorMessage>
                    </FormControl>*/}
                    <FormControl
                      isInvalid={errors.priority_id ? true : false}
                      mb="24px"
                    >
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        Priority
                      </FormLabel>
                      <ChakraSelect
                        borderRadius="15px"
                        fontSize="sm"
                        placeholder="Select priority"
                        size="lg"
                        {...register("priority_id", {
                          required: "Priority tidak boleh kosong!",
                        })}
                      >
                        {priority.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </ChakraSelect>
                      <FormErrorMessage>
                        {errors.priority_id?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                  <Box w={{ base: "inherit", md: "48%" }}>
                    <FormControl mb="24px" isInvalid={!!errors.assigned}>
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        Assign User
                      </FormLabel>
                      <Controller
                        control={control}
                        render={({ field: { onChange, onBlur, value } }) => (
                          <Select<ListSelect, true, GroupBase<ListSelect>>
                            isMulti
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            options={member}
                            placeholder="pilih user"
                            closeMenuOnSelect={false}
                          />
                        )}
                        name="assigned"
                        rules={{ required: "Assign User tidak boleh kosong!" }}
                      />
                      <FormErrorMessage>
                        {errors.assigned?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isInvalid={errors.description ? true : false}
                      mb="24px"
                    >
                      <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                        Description
                      </FormLabel>
                      <Textarea
                        borderRadius="15px"
                        fontSize="sm"
                        placeholder="Input description issue"
                        rows={4}
                        size="lg"
                        {...register("description", {
                          required: "Description tidak boleh kosong!",
                        })}
                      />
                      <FormErrorMessage>
                        {errors.description?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Box>
                </Flex>
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
                  isLoading={isLoading}
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

export default withAuth(AddIssue);

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
}) => {
  const { ictAuth } = req.cookies;

  if (!ictAuth) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth",
      },
    };
  }

  try {
    const priority = await getIssuePriority(ictAuth);
    const getMember = await getIssueIctMember(ictAuth);

    const member: ListSelect[] = getMember.map((item: ListGeneral) => {
      return {
        label: item.name,
        value: String(item.id),
      };
    });

    return {
      props: { priority, member },
    };
  } catch (err) {
    return myErrorSSR<any>(err as AxiosError<ErrorResponseAPI>);
  }
};
