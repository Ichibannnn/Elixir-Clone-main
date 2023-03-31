import React, { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";

import { ApproveModal, RejectModal } from "./ActionModal";
import PageScroll from "../../../utils/PageScroll";

export const ListOfOrders = ({
  customerOrders,
  orderNo,
  setOrderNo,
  fetchOrderList,
  fetchOrdersByOrderNo,
}) => {
  const [stockIdentifier, setStockIdentifier] = useState("false");

  const {
    isOpen: isApprove,
    onClose: closeApprove,
    onOpen: openApprove,
  } = useDisclosure();
  const {
    isOpen: isReject,
    onClose: closeReject,
    onOpen: openReject,
  } = useDisclosure();

  const approveModal = () => {
    openApprove();
  };

  const rejectModal = () => {
    openReject();
  };

  return (
    <Flex w="95%" h="250px" flexDirection="column">
      <Flex flexDirection="column">
        <Text
          textAlign="center"
          bgColor="secondary"
          color="white"
          fontSize="11px"
        >
          List of Orders
        </Text>
        <PageScroll minHeight='260px' maxHeight='270px'>
          <Table size="sm" variant="simple">
            <Thead bgColor="secondary">
              <Tr>
                <Th color="white" fontSize="9px">
                  Line
                </Th>
                <Th color="white" fontSize="9px">
                  Order Date
                </Th>
                <Th color="white" fontSize="9px">
                  Date Needed
                </Th>
                {/* <Th color="white" fontSize="9px">
                  Customer Code
                </Th>
                <Th color="white" fontSize="9px">
                  Customer Name
                </Th>
                <Th color="white" fontSize="9px">
                  Category
                </Th> */}
                <Th color="white" fontSize="9px">
                  Item Code
                </Th>
                <Th color="white" fontSize="9px">
                  Item Description
                </Th>
                <Th color="white" fontSize="9px">
                  UOM
                </Th>
                <Th color="white" fontSize="9px">
                  Quantity Order
                </Th>
              </Tr>
            </Thead>
            {orderNo ? (
              <Tbody>
                {customerOrders?.map((item, i) => (
                  <Tr key={i}>
                    <Td fontSize="11px">{i + 1}</Td>
                    <Td fontSize="11px">{item.orderDate}</Td>
                    <Td fontSize="11px">{item.dateNeeded}</Td>
                    {/* <Td fontSize="11px">{item.customerCode}</Td>
                    <Td fontSize="11px">{item.customerName}</Td>
                    <Td fontSize="11px">{item.category}</Td> */}
                    <Td fontSize="11px">{item.itemCode}</Td>
                    <Td fontSize="11px">{item.itemDescription}</Td>
                    <Td fontSize="11px">{item.uom}</Td>
                    <Td fontSize="11px">{item.quantityOrder}</Td>
                    {/* <Td fontSize="11px">{item.orderDate}</Td> */}
                  </Tr>
                ))}
              </Tbody>
            ) : null}
          </Table>
        </PageScroll>
      </Flex>

      <Flex justifyContent="end">
        <ButtonGroup size="xs">
          <Button
            colorScheme="blue"
            px={2}
            disabled={!orderNo}
            onClick={approveModal}
          >
            APPROVE
          </Button>
          <Button
            px={4}
            disabled={!orderNo}
            onClick={rejectModal}
            color="white"
            size="xs"
            bg="gray.500"
            _hover={{ bg: "gray.400" }}
          >
            REJECT
          </Button>
        </ButtonGroup>
      </Flex>

      {isApprove && (
        <ApproveModal
          isOpen={isApprove}
          onClose={closeApprove}
          orderNo={orderNo}
          setOrderNo={setOrderNo}
          fetchOrderList={fetchOrderList}
          fetchOrdersByOrderNo={fetchOrdersByOrderNo}
          // fetchNotification={fetchNotification}
        />
      )}

      {isReject && (
        <RejectModal
          isOpen={isReject}
          onClose={closeReject}
          orderNo={orderNo}
          setOrderNo={setOrderNo}
          fetchOrderList={fetchOrderList}
          fetchOrdersByOrderNo={fetchOrdersByOrderNo}
          // fetchNotification={fetchNotification}
        />
      )}
    </Flex>
  );
};
