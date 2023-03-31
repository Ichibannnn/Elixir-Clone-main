import React from "react";
import {
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
} from "@chakra-ui/react";

import moment from "moment";
import PageScroll from "../../../utils/PageScroll";

export const ListOfPreparedOrders = ({ orders, orderNo, setOrderNo }) => {
  const orderNoHandler = (id) => {
    if (id) {
      setOrderNo(id);
    } else {
      setOrderNo("");
    }
    console.log("me click ne kulet");
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
          List of Prepared Date
        </Text>
        <PageScroll minHeight="200px" maxHeight="210px">
          <Table size="sm" variant="simple">
            <Thead bgColor="secondary">
              <Tr>
                <Th color="white" fontSize="9px">
                  Line
                </Th>
                <Th color="white" fontSize="9px">
                  Order ID
                </Th>
                <Th color="white" fontSize="9px">
                  Customer Code
                </Th>
                <Th color="white" fontSize="9px">
                  Customer Name
                </Th>
                <Th color="white" fontSize="9px">
                  Category
                </Th>
                <Th color="white" fontSize="9px">
                  Total Quantity Order
                </Th>
                <Th color="white" fontSize="9px">
                  Prepared Date
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders?.map((item, i) => (
                <Tr
                  onClick={() => orderNoHandler(item.orderNoPKey)}
                  bgColor={orderNo === item.orderNoPKey ? "blue.100" : "none"}
                  key={i}
                  cursor="pointer"
                >
                  <Td fontSize="11px">{i + 1}</Td>
                  <Td fontSize="11px">{item.orderNoPKey}</Td>
                  <Td fontSize="11px">{item.customerCode}</Td>
                  <Td fontSize="11px">{item.customerName}</Td>
                  <Td fontSize="11px">{item.category}</Td>
                  <Td fontSize="11px">{item.totalOrders}</Td>
                  <Td fontSize="11px">
                    {moment(item.preparedDate).format("MM/DD/yyyy")}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>
    </Flex>
  );
};
