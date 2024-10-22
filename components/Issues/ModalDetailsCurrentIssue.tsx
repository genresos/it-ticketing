import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React, { useContext, useMemo } from "react";
import { IconType } from "react-icons";
import {
  FaBusinessTime,
  FaCheck,
  FaClipboardCheck,
  FaDoorClosed,
  FaFolderOpen,
  FaMagic,
  FaUserCheck,
} from "react-icons/fa";
import { AuthContext } from "../../store/AuthContext";
import {
  DataIssues,
  DataIssueUserDetails,
  TicketComment,
} from "../../types/dataList";
import { ErrorResponseAPI } from "../../types/error";
import { getIssueICTDetails } from "../../utils/fetchApi";
import { myError } from "../../utils/myError";
import { ListDetails, TableComment } from "../Main";

interface Props {
  visible: boolean;
  onClose: () => void;
  data: DataIssues;
}

interface StatusProps {
  bg: string;
  icon: IconType;
}

const newColor = "rgba(0, 117, 143, 1)";
const secondColor = "#ffac4c";
const successColor = "rgba(85, 198, 170, 1)";
const gradBlue1 = "#136ABD";
const gradOrange1 = "#D56425";
const gradPurple1 = "#5E22BD";
const closeColor = "rgba(128, 128, 128, 1)";

const ModalDetailsCurrentIssue = ({ visible, onClose, data }: Props) => {
  const {
    id,
    requestor,
    title,
    description,
    category_id,
    priority,
    status_id,
    asset_name,
    project_code,
    assigned_to,
    accepted_time,
    end_time,
    created_time,
  } = data;

  const textColor = useColorModeValue("gray.700", "white");
  const toast = useToast();
  const { userData, userToken, signOut } = useContext(AuthContext);

  const {
    data: dataDetails,
    isSuccess,
    isFetched,
  } = useQuery<DataIssueUserDetails[], AxiosError<ErrorResponseAPI>>(
    ["get-issue-details", id],
    () => getIssueICTDetails(id, userToken),
    {
      enabled: userToken && visible ? true : false,
      onSuccess: (dataSuccess) =>
        console.log("success my task: ", dataSuccess.length),
      onError: (err) => myError(err, toast, signOut),
    }
  );

  const ticketComments = useMemo<TicketComment[]>(() => {
    if (isSuccess) {
      const newVal = dataDetails[0].ticket_comments;
      return newVal;
    }

    return [];
  }, [dataDetails, isSuccess]);

  const isStatus = useMemo<StatusProps>(() => {
    if (status_id === "New") {
      return { bg: newColor, icon: FaMagic };
    } else if (status_id === "Assigned") {
      return { bg: secondColor, icon: FaUserCheck };
    } else if (status_id === "Resovled") {
      return { bg: successColor, icon: FaCheck };
    } else if (status_id === "Deployed") {
      return { bg: gradBlue1, icon: FaBusinessTime };
    } else if (status_id === "Verified") {
      return { bg: gradOrange1, icon: FaClipboardCheck };
    } else if (status_id === "Reopened") {
      return { bg: gradPurple1, icon: FaFolderOpen };
    } else {
      return { bg: closeColor, icon: FaDoorClosed };
    }
  }, [status_id]);

  return (
    <Modal isOpen={visible} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Details Issue</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack direction={{ base: "column", md: "row" }}>
            <Box flex={1}>
              <ListDetails label="Requestor" value={requestor} />
              <ListDetails label="Title" value={title} />
              <ListDetails
                label="Description"
                value={description}
                fontSize="md"
                fontWeight="normal"
              />
              <ListDetails label="No Asset" value={asset_name || "-"} />
              <ListDetails label="Project Code" value={project_code || "-"} />
              <ListDetails label="Assign To" value={assigned_to} />
            </Box>
            <Box flex={1}>
              <ListDetails label="Category" value={category_id} />
              <ListDetails label="Priority" value={priority} />
              <Text
                color={textColor}
                fontSize="sm"
                fontWeight="normal"
                mb="6px"
              >
                Status
              </Text>
              <Button
                leftIcon={<isStatus.icon />}
                bg={isStatus.bg}
                color="white"
                variant="solid"
                minW="130px"
                borderRadius={20}
                _hover={{ bg: isStatus.bg }}
                _active={{ bg: isStatus.bg }}
                mb="24px"
              >
                {status_id}
              </Button>
              <ListDetails label="Created at" value={created_time} />
              <ListDetails label="Accept Time" value={accepted_time} />
              <ListDetails label="End Time" value={end_time} />
            </Box>
          </Stack>
          <Text color={textColor} fontSize="lg" fontWeight="normal" mb="6px">
            History Issue
          </Text>
          <Skeleton isLoaded={isFetched}>
            <Box>
              <TableComment ticket_comments={ticketComments} />
            </Box>
          </Skeleton>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalDetailsCurrentIssue;
