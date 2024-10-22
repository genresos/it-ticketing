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
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AuthContext } from "../../store/AuthContext";
import { DataIssueUser } from "../../types/dataList";
import { ErrorResponseAPI } from "../../types/error";
import { ReopenIssueInputs } from "../../types/formInput";
import { reopenIssueICT } from "../../utils/fetchApi";
import { myError } from "../../utils/myError";
import { myToast } from "../../utils/myToast";

interface Props {
  visible: boolean;
  onClose: () => void;
  data: DataIssueUser;
  onFinish: () => void;
}

const defaultValues: ReopenIssueInputs = {
  comment: "",
};

const ModalReopen = ({ visible, onClose, data, onFinish }: Props) => {
  const { id, assigned_to, title } = data;
  const textColor = useColorModeValue("gray.700", "white");

  const toast = useToast();

  const { userToken, signOut } = useContext(AuthContext);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ReopenIssueInputs>({ defaultValues });

  const { mutate, isLoading } = useMutation(reopenIssueICT, {
    onSuccess: (dataSuccess) => {
      myToast.success(toast, `Berhasil Reopen Issue, ${title}`);
      onClose();
      reset({ ...defaultValues });
      onFinish();
    },
    onError: (err: AxiosError<ErrorResponseAPI>) =>
      myError(err, toast, signOut),
  });

  const onSubmit: SubmitHandler<ReopenIssueInputs> = (dataSubmit) => {
    if (!id) {
      myToast.error(toast, "Id tidak ditemukan!");
      return;
    }

    mutate({ id: id, data: dataSubmit, token: userToken });
  };

  return (
    <Modal isOpen={visible} onClose={onClose} size={"2xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reopen Issue</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box ms="4px" mb="20px">
            <Text color={textColor}>Assigned : {assigned_to}</Text>
            <Text color={textColor} fontSize="lg" fontWeight="bold">
              {title}
            </Text>
          </Box>
          <form id="reopen-form" onSubmit={handleSubmit(onSubmit)}>
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
            form="reopen-form"
          >
            Reopen Issue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalReopen;
