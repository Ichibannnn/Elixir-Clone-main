import React, { useEffect } from "react";
import {
  Badge,
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

export const ListOfPreparedOrders = ({
  orders,
  orderNo,
  setOrderNo,
  customerOrders,
}) => {
  const orderNoHandler = (id) => {
    if (id) {
      setOrderNo(id);
    } else {
      setOrderNo("");
    }
    console.log(orderNo);
  };

  //Auto select index 0
  useEffect(() => {
    setOrderNo(orders[0]?.orderNoPKey);
  }, [orders]);

  // console.log(customerOrders);
  // console.log(orders);

  // const rushBadge = customerOrders?.some((x) => (x.rush ? true : false));

  return (
    <Flex w="95%" h="250px" flexDirection="column">
      <Flex flexDirection="column">
        <Text
          textAlign="center"
          bgColor="secondary"
          color="white"
          fontSize="13px"
        >
          List of Prepared Date
        </Text>
        <PageScroll minHeight="200px" maxHeight="210px">
          <Table size="sm" variant="simple">
            <Thead bgColor="secondary">
              <Tr h="30px">
                <Th color="white" fontSize="10px">
                  Line
                </Th>
                <Th color="white" fontSize="10px">
                  Order ID
                </Th>
                <Th color="white" fontSize="10px">
                  Customer Code
                </Th>
                <Th color="white" fontSize="10px">
                  Customer Name
                </Th>
                <Th color="white" fontSize="10px">
                  Total Quantity Order
                </Th>
                <Th color="white" fontSize="10px">
                  Prepared Date
                </Th>
                <Th color="white" fontSize="10px">
                  Status
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
                  <Td fontSize="xs">{i + 1}</Td>
                  <Td fontSize="xs">{item.orderNoPKey}</Td>
                  {/* <Td fontSize="xs">{item.department}</Td> */}
                  <Td fontSize="xs">{item.customerCode}</Td>
                  <Td fontSize="xs">
                    {item.customerName}{" "}
                    {/* <Badge
                      fontSize="9.5px"
                      colorScheme="orange"
                      variant="solid"
                      className="inputCapital"
                    >
                      {rushBadge && "Rush"}
                    </Badge> */}
                    {/* {!!customerOrders?.find(
                        (order) => order.orderNo === item.orderNoPKey
                      )?.rush && "Rush"} */}
                  </Td>
                  {/* <Td fontSize="xs">{item.category}</Td> */}
                  <Td fontSize="xs">{item.totalOrders}</Td>
                  <Td fontSize="xs">
                    {moment(item.preparedDate).format("MM/DD/yyyy")}
                  </Td>
                  <Td fontSize="xs">
                    {item.rush ? (
                      <Badge
                        fontSize="9.5px"
                        colorScheme="orange"
                        variant="solid"
                        className="inputCapital"
                      >
                        Rush
                      </Badge>
                    ) : (
                      ""
                    )}
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
