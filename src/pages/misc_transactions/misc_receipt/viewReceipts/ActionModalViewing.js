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
  ModalOverlay,
} from "@chakra-ui/react";
import { BsQuestionOctagonFill } from "react-icons/bs";
import request from "../../../../services/ApiClient";
import { ToastComponent } from "../../../../components/Toast";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";

export const ViewModal = ({ isOpen, onClose, statusBody }) => {
  const [receiptDetailsData, setReceiptDetailsData] = useState([]);

  const id = statusBody.id;
  const fetchReceiptDetailsApi = async (id) => {
    const res = await request.get(
      `Miscellaneous/GetAllDetailsFromWarehouseByMReceipt?id=${id}`
    );
    return res.data;
  };

  const fetchReceiptDetails = () => {
    fetchReceiptDetailsApi(id).then((res) => {
      setReceiptDetailsData(res);
    });
  };

  useEffect(() => {
    fetchReceiptDetails();
  }, [id]);

  console.log(receiptDetailsData);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mt={5} fontSize="md">
          <Flex fontSize="lg" justifyContent="center" mb={5}>
            <Text>Receipt Details</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={-1}>
              <Text fontSize="xs">
                Customer Code: {receiptDetailsData[0]?.supplierCode}
              </Text>
              <Text fontSize="xs">
                Customer Name: {receiptDetailsData[0]?.supplierName}
              </Text>
              <Text fontSize="xs">
                Details: {receiptDetailsData[0]?.remarks}
              </Text>
            </VStack>
            <VStack alignItems="start" spacing={-1}>
              <Text fontSize="xs">
                Transaction ID: {receiptDetailsData[0]?.id}
              </Text>
              <Text fontSize="xs">
                Transaction Date:{" "}
                {moment(receiptDetailsData[0]?.transactionDate).format(
                  "yyyy-MM-DD"
                )}
              </Text>
              <Text fontSize="xs">
                Transact By: {receiptDetailsData[0]?.preparedBy}
              </Text>
            </VStack>
            <VStack alignItems="start" spacing={-1}>
              <Text fontSize="xs">
                Company: {receiptDetailsData[0]?.companyName}
              </Text>
              <Text fontSize="xs">
                Department: {receiptDetailsData[0]?.departmentName}
              </Text>
              <Text fontSize="xs">
                Location: {receiptDetailsData[0]?.locationName}
              </Text>
              <Text fontSize="xs">
                Account Title: {receiptDetailsData[0]?.accountTitles}
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
                    <Th color="white">Item Code</Th>
                    <Th color="white">Item Description</Th>
                    <Th color="white">Quantity</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {receiptDetailsData?.map((receiptdetails, i) => (
                    <Tr key={i}>
                      <Td>{receiptdetails.itemcode}</Td>
                      <Td>{receiptdetails.itemDescription}</Td>
                      <Td>{receiptdetails.totalQuantity}</Td>
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
