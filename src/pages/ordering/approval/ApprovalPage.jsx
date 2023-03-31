import React, { useState, useEffect } from "react";
import { Box, Flex, Stack, VStack } from "@chakra-ui/react";
import { ListOfOrders } from "./ListOfOrders";
import request from "../../../services/ApiClient";
import { ListOfPreparedOrders } from "./ListOfPreparedOrders";

const fetchOrderListApi = async () => {
  const res = await request.get(`Ordering/GetAllListForApprovalOfSchedule`);
  return res.data;
};

const fetchOrdersByOrderNoApi = async (orderNo) => {
  const res = await request.get(
    `Ordering/GetAllOrdersForScheduleApproval?id=${orderNo}`
  );
  return res.data;
};

const ApprovalPage = () => {
  const [orderNo, setOrderNo] = useState("");
  const [orders, setOrders] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);

  const fetchOrderList = () => {
    fetchOrderListApi().then((res) => {
      setOrders(res);
    });
  };

  useEffect(() => {
    fetchOrderList();

    return () => {
      setOrders([]);
    };
  }, []);

  const fetchOrdersByOrderNo = () => {
    fetchOrdersByOrderNoApi(orderNo).then((res) => {
      setCustomerOrders(res);
    });
  };

  useEffect(() => {
    if (orderNo) {
      fetchOrdersByOrderNo();
    }

    return () => {
      setCustomerOrders([]);
    };
  }, [orderNo]);

  return (
    <Flex
      color="fontColor"
      w="full"
      flexDirection="column"
      p={2}
      bg="form"
      boxShadow="md"
    >
      <VStack w="full">
        <ListOfPreparedOrders
          orders={orders}
          orderNo={orderNo}
          setOrderNo={setOrderNo}
        />
        <ListOfOrders
          customerOrders={customerOrders}
          orderNo={orderNo}
          setOrderNo={setOrderNo}
          fetchOrderList={fetchOrderList}
          fetchOrdersByOrderNo={fetchOrdersByOrderNo}
        />
      </VStack>
    </Flex>
  );
};

export default ApprovalPage;
