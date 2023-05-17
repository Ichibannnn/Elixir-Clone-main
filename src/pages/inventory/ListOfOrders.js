import React, { useState } from "react";
import {
  Badge,
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { MdOutlinePendingActions, MdPending } from "react-icons/md";
import { GoArrowSmallRight } from "react-icons/go";
import { BsCheck2Circle } from "react-icons/bs";
import PageScrollImport from "../../components/PageScrollImport";
import moment from "moment";
import PageScroll from "../../utils/PageScroll";

export const ListOfOrders = ({
  orderListData,
  setItemCode,
  highlighterId,
  setHighlighterId,
  setQtyOrdered,
  setPreparedQty,
  orderId,
  setWarehouseId,
}) => {
  const TableHead = [
    "Line",
    "Order Date",
    "Date Needed",
    // "Customer Code",
    // "Customer Name",
    // "Category",
    "Item Code",
    "Item Description",
    "UOM",
    "Quantity Order",
    "Prepared Qty",
    "Status",
  ];

  const rowHandler = ({ id, itemCode, quantityOrder, preparedQuantity }) => {
    setWarehouseId("");
    if (id && itemCode) {
      setItemCode(itemCode);
      setHighlighterId(id);
      setQtyOrdered(quantityOrder);
      setPreparedQty(preparedQuantity);
    } else {
      setItemCode("");
      setHighlighterId("");
      setQtyOrdered("");
      setPreparedQty("");
    }
  };

  return (
    <VStack w="full" spacing={0} justifyContent="center" mt={10}>
      <Box w="full" bgColor="primary" h="22px">
        <Text
          fontWeight="semibold"
          fontSize="13px"
          color="white"
          textAlign="center"
          justifyContent="center"
        >
          List of Orders
        </Text>
      </Box>
      <PageScroll minHeight="150px" maxHeight="200px">
        <Table size="sm" variant="simple">
          <Thead bgColor="secondary">
            <Tr h="30px">
              {TableHead?.map((head, i) => (
                <Th key={i} color="white" fontSize="10px">
                  {head}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {orderListData?.map((list, i) => (
              <Tr
                key={i}
                onClick={() => rowHandler(list)}
                bgColor={highlighterId === list.id ? "blue.100" : "none"}
                cursor="pointer"
              >
                {highlighterId === list.id ? (
                  <Td>
                    <GoArrowSmallRight fontSize="27px" />
                  </Td>
                ) : (
                  <Td fontSize="xs">{i + 1}</Td>
                )}
                <Td fontSize="xs">
                  {moment(list.orderDate).format("yyyy-MM-DD")}
                </Td>
                <Td fontSize="xs">
                  {moment(list.dateNeeded).format("yyyy-MM-DD")}
                </Td>
                {/* <Td fontSize="11px">{list.customerCode}</Td>
                <Td fontSize="11px">{list.customerName}</Td>
                <Td fontSize="11px">{list.category}</Td> */}
                <Td fontSize="xs">{list.itemCode}</Td>
                <Td fontSize="xs">{list.itemDescription}</Td>
                <Td fontSize="xs">{list.uom}</Td>
                <Td fontSize="xs">{list.quantityOrder}</Td>
                <Td fontSize="xs">{list.preparedQuantity}</Td>
                <Td>
                  {list.quantityOrder <= list.preparedQuantity ? (
                    // <BsCheck2Circle fontSize="20px" title="Done" />
                    <Badge colorScheme="whatsapp" fontSize="0.7em">
                      Done
                    </Badge>
                  ) : (
                    <Badge colorScheme="orange" fontSize="0.7em">
                      Pending
                    </Badge>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageScroll>
    </VStack>
  );
};
