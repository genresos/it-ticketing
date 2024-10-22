import {
  Box,
  Button,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../store/AuthContext";
import { ErrorResponseAPI } from "../../types/error";
import { exportIssueICT } from "../../utils/fetchApi";
import { myErrorBlob } from "../../utils/myError";
import { myToast } from "../../utils/myToast";
import { DatePicker2 } from "../Main";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ModalExportIssue = ({ visible, onClose }: Props) => {
  const { userToken, signOut } = useContext(AuthContext);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const toast = useToast();

  const { mutate, isLoading } = useMutation(exportIssueICT, {
    onMutate: (dataMutate) => {
      console.log("data mutate: ", dataMutate);
    },
    onSuccess: (dataSuccess) => {
      console.log("data success: ", dataSuccess);
      myToast.success(toast, "Download in progress");
      onClose();
    },
    onError: (error: AxiosError<ErrorResponseAPI>) =>
      myErrorBlob(error, toast, signOut),
  });

  useEffect(() => {
    if (visible) {
      const first = dayjs().add(-1, "M").toISOString();
      setStartDate(new Date(first));
    }
  }, [visible]);

  return (
    <Modal isOpen={visible} onClose={onClose} size={"2xl"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Export Issue</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack>
            <Box>
              <FormLabel>From</FormLabel>
              <DatePicker2
                selectedDate={startDate}
                onChange={(val) => setStartDate(val || new Date())}
              />
            </Box>
            <Box>
              <FormLabel>To</FormLabel>
              <DatePicker2
                selectedDate={endDate}
                onChange={(val) => setEndDate(val || new Date())}
              />
            </Box>
          </HStack>
          <Button
            bg="teal.300"
            color="white"
            mt={4}
            _hover={{
              bg: "teal.200",
            }}
            _active={{
              bg: "teal.400",
            }}
            onClick={() =>
              mutate({
                token: userToken,
                from: dayjs(startDate).format("YYYY-MM-DD"),
                to: dayjs(endDate).format("YYYY-MM-DD"),
              })
            }
            isLoading={isLoading}
          >
            Export
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalExportIssue;
