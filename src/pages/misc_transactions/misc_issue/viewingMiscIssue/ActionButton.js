import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  HStack,
  ModalOverlay,
} from "@chakra-ui/react";
import { BsQuestionOctagonFill } from "react-icons/bs";
import request from "../../../../services/ApiClient";
import { ToastComponent } from "../../../../components/Toast";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";

export const ViewModal = ({ isOpen, onClose, statusBody }) => {
  // console.log(statusBody)

  const [issuesDetailsData, setIssuesDetailsData] = useState([]);

  const id = statusBody.id;
  const fetchIssuesDetailsApi = async (id) => {
    const res = await request.get(
      `Miscellaneous/GetAllDetailsInMiscellaneousIssue?id=${id}`
    );
    return res.data;
  };

  const fetchIssuesDetails = () => {
    fetchIssuesDetailsApi(id).then((res) => {
      setIssuesDetailsData(res);
    });
  };

  useEffect(() => {
    fetchIssuesDetails();
  }, [id]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mt={5} fontSize="md">
          <Flex fontSize="sm" justifyContent="center">
            <Text>Issue Details</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={-1}>
              <Text fontSize="xs">
                Customer Code: {issuesDetailsData[0]?.customerCode}
              </Text>
              <Text fontSize="xs">
                Customer Name: {issuesDetailsData[0]?.customer}
              </Text>
              <Text fontSize="xs">
                Details: {issuesDetailsData[0]?.remarks}
              </Text>
            </VStack>
            <VStack alignItems="start" spacing={-1}>
              <Text fontSize="xs">
                Transaction ID: {issuesDetailsData[0]?.issuePKey}
              </Text>
              <Text fontSize="xs">
                Transaction Date:{" "}
                {moment(issuesDetailsData[0]?.preparedDate).format(
                  "yyyy-MM-DD"
                )}
              </Text>
              <Text fontSize="xs">
                Transact By: {issuesDetailsData[0]?.preparedBy}
              </Text>
            </VStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody mb={5}>
          <Flex justifyContent="center">
            <PageScroll minHeight="350px" maxHeight="351px">
              <Table size="sm">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white" fontSize="xs">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="xs">
                      Quantity
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {issuesDetailsData?.map((receiptdetails, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{receiptdetails.itemCode}</Td>
                      <Td fontSize="xs">{receiptdetails.itemDescription}</Td>
                      <Td fontSize="xs">{receiptdetails.totalQuantity}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup size="sm">
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
