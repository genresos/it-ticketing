import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { RegisterOptions, SubmitHandler, useForm } from "react-hook-form";
import { AuthContext } from "../../store/AuthContext";
import { DataIssueICT, ListGeneral } from "../../types/dataList";
import { ErrorResponseAPI } from "../../types/error";
import { UpdateIssueInputs } from "../../types/formInput";
import { updateIssueICT } from "../../utils/fetchApi";
import { myError } from "../../utils/myError";
import { myToast } from "../../utils/myToast";

interface Props {
  visible: boolean;
  onClose: () => void;
  data: DataIssueICT;
  ticketStatus: ListGeneral[];
  ticketCategory: ListGeneral[];
  onFinish: () => void;
}

const defaultValues: UpdateIssueInputs = {
  status_id: 2,
  comment: "",
  category_id: "",
};

const ModalUpdateTask = ({
  visible,
  onClose,
  data,
  ticketStatus,
  ticketCategory,
  onFinish,
}: Props) => {
  const { id, requestor, title, status_id } = data;
  const textColor = useColorModeValue("gray.700", "white");

  const toast = useToast();

  const { userToken, signOut } = useContext(AuthContext);
  const [categoryOptions, setCategoryOptions] = useState<RegisterOptions>({
    required: false,
  });

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateIssueInputs>({ defaultValues });

  const { mutate, isLoading } = useMutation(updateIssueICT, {
    onSuccess: (dataSuccess) => {
      myToast.success(toast, `Berhasil Update Issue, ${title}`);
      onClose();
      reset({ ...defaultValues });
      onFinish();
    },
    onError: (err: AxiosError<ErrorResponseAPI>) =>
      myError(err, toast, signOut),
  });

  const onSubmit: SubmitHandler<UpdateIssueInputs> = (dataSubmit) => {
    const { status_id, comment, category_id } = dataSubmit;

    if (!id) {
      myToast.error(toast, "Id tidak ditemukan!");
      return;
    }

    const newSubmit = {
      status_id: Number(status_id),
      comment,
      category_id: category_id === "" ? "null" : Number(category_id),
    };

    mutate({ id: id, data: newSubmit, token: userToken });
  };

  const newStatus = useMemo<ListGeneral[]>(() => {
    if (ticketStatus.length === 0) {
      return [];
    }

    const newVal = ticketStatus.filter((item) => item.id !== 1);
    return newVal;
  }, [ticketStatus]);

  useEffect(() => {
    if (status_id && visible) {
      const idx = newStatus.findIndex((val) => val.name === status_id);
      if (idx !== -1) {
        setValue("status_id", newStatus[idx].id);
      } else {
        setValue("status_id", 2);
      }
    }
  }, [visible, newStatus, status_id, setValue]);

  useEffect(() => {
    if (visible && status_id === "New") {
      setCategoryOptions({ required: "Category tidak boleh kosong!" });
    } else {
      setCategoryOptions({ required: false });
    }
  }, [status_id, visible]);

  return (
    <Modal isOpen={visible} onClose={onClose} size={"2xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Issue</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box ms="4px" mb="20px">
            <Text color={textColor}>Requestor : {requestor}</Text>
            <Text color={textColor} fontSize="lg" fontWeight="bold">
              {title}
            </Text>
          </Box>
          <form id="form-update-issue" onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.status_id ? true : false} mb="24px">
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Status
              </FormLabel>
              <Select
                borderRadius="15px"
                fontSize="sm"
                placeholder="Select Status"
                size="lg"
                {...register("status_id", {
                  required: "Status tidak boleh kosong!",
                })}
              >
                {status_id === "New"
                  ? newStatus
                      .filter((item) => item.id === 2)
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))
                  : newStatus.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
              </Select>
              <FormErrorMessage>{errors.status_id?.message}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.comment ? true : false} mb="24px">
              <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                Comment
              </FormLabel>
              <Textarea
                borderRadius="15px"
                fontSize="sm"
                rows={4}
                placeholder="Input comment"
                size="lg"
                {...register("comment", {
                  required: "Comment tidak boleh kosong!",
                })}
              />
              <FormErrorMessage>{errors.comment?.message}</FormErrorMessage>
            </FormControl>
            {status_id === "New" ? (
              <FormControl
                isInvalid={errors.category_id ? true : false}
                mb="24px"
              >
                <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                  Category
                </FormLabel>
                <Select
                  borderRadius="15px"
                  fontSize="sm"
                  placeholder="Select Category"
                  size="lg"
                  {...register("category_id", categoryOptions)}
                >
                  {ticketCategory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.category_id?.message}
                </FormErrorMessage>
              </FormControl>
            ) : null}
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
            isLoading={isLoading}
            form="form-update-issue"
          >
            Update Issue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalUpdateTask;
