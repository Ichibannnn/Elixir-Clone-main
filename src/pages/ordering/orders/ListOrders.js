import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Table,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  Tbody,
  Td,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { TiArrowSync } from "react-icons/ti";
import PageScrollImport from "../../../components/PageScrollImport";
import { FiSearch } from "react-icons/fi";
import PageScroll from "../../../utils/PageScroll";
import { ToastComponent } from "../../../components/Toast";
import Swal from "sweetalert2";
import request from "../../../services/ApiClient";
import moment from "moment";
import OrdersConfirmation from "./OrdersConfirmation";
import DatePicker from "react-date-picker";

export const ListOrders = ({
  genusOrders,
  fetchingData,
  setFromDate,
  setToDate,
  fromDate,
  toDate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [errorDate, setErrorDate] = useState([]);
  const [errorData, setErrorData] = useState([]);

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  // ARRAY FOR THE LIST DATA
  const resultArray = genusOrders?.genus_orders?.map((item) => {
    return {
      transactId: item?.transaction_id,
      customerName: item?.customer?.name,
      // customerPosition: item?.customer?.position,
      // farmType: item?.order_details?.farm_name,
      // farmCode: item?.order_details?.farm_code,
      orderNo: item?.order_details?.orderNo,
      batchNo: item?.order_details?.batchNo,
      orderDate: item?.order_details?.dateOrdered,
      dateNeeded: item?.order_details?.dateNeeded,
      // timeNeeded: item?.order_details?.timeNeeded,
      // transactionType: item?.order_details?.type,
      itemCode: item?.order_details?.order?.itemCode,
      itemDescription: item?.order_details?.order?.itemDescription,
      uom: item?.order_details?.order?.uom,
      quantityOrdered: item?.order_details?.order?.quantity,
      category: item?.order_details?.order?.category,
    };
  });

  const dateVar = new Date();
  const startDate = moment(dateVar.setDate(dateVar.getDate() - 5)).format(
    "yyyy-MM-DD"
  );

  // SYNC ORDER BUTTON
  const syncHandler = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to sync these orders?",
      icon: "info",
      color: "white",
      background: "#1B1C1D",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          setIsLoading(true);
          const res = request
            .post(
              `Ordering/AddNewOrders`,
              resultArray.map((item) => {
                return {
                  transactId: item?.transactId,
                  customerName: item?.customerName,
                  // customerPosition: item?.customerPosition,
                  // farmType: item?.farmType,
                  // farmCode: item?.farmCode,
                  // farmName: item?.farmName,
                  orderNo: item?.orderNo,
                  batchNo: item?.batchNo.toString(),
                  orderDate: moment(item?.orderDate).format("yyyy-MM-DD"),
                  dateNeeded: moment(item?.dateNeeded).format("yyyy-MM-DD"),
                  // timeNeeded: item?.dateNeeded,
                  // transactionType: item?.transactionType,
                  itemCode: item?.itemCode,
                  itemDescription: item?.itemDescription,
                  uom: item?.uom,
                  quantityOrdered: item?.quantityOrdered,
                  category: item?.category,
                };
              })
            )
            .then((res) => {
              ToastComponent("Success", "Orders Synced!", "success", toast);
              // fetchNotification();
              // onClose();
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
              setErrorData(err.response.data);
              if (err.response.data) {
                // onClose();
                onOpen();
              }
            });
        } catch (error) {}
      }
    });
  };

  return (
    <Flex
      color="fontColor"
      h="auto"
      w="full"
      flexDirection="column"
      p={2}
      bg="form"
      boxShadow="md"
    >
      <Flex p={2} flexDirection="column">
        <Flex justifyContent="center">
          <HStack>
            <Badge fontSize="11px">From:</Badge>
            <Input
              onChange={(date) => setFromDate(date)}
              value={fromDate}
              min={fromDate}
              size="sm"
              type="date"
              fontSize="11px"
            />
            <Badge fontSize="11px">To:</Badge>
            <Input
              onChange={(date) => setToDate(date)}
              value={toDate}
              min={fromDate}
              size="sm"
              type="date"
              fontSize="11px"
            />
          </HStack>
        </Flex>

        {fromDate && toDate ? (
          <>
            <Flex justifyContent="space-between" w="100%" p={4} mt={-3}>
              <HStack>
                {/* <Text>Search</Text> */}
                <InputGroup size="sm">
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FiSearch bg="black" fontSize="18px" />}
                  />
                  <Input
                    fontSize="13px"
                    size="sm"
                    type="text"
                    placeholder="Search: ex. Store Name"
                    onChange={(e) => setKeyword(e.target.value)}
                    disabled={isLoading}
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.400" }}
                  />
                </InputGroup>
              </HStack>

              <HStack>
                <Button
                  colorScheme="blue"
                  size="sm"
                  fontSize="13px"
                  borderRadius="none"
                  leftIcon={<TiArrowSync fontSize="19px" />}
                  onClick={() => syncHandler()}
                >
                  Sync
                </Button>
              </HStack>
            </Flex>

            <Flex p={4}>
              <VStack bg="primary" alignItems="center" w="100%" p={1} mt={-7}>
                <Text color="white" fontSize="13px" textAlign="center">
                  LIST OF ORDERS
                </Text>
              </VStack>
            </Flex>

            <Flex p={4}>
              <VStack alignItems="center" w="100%" mt={-8}>
                <PageScroll>
                  {fetchingData ? (
                    <Stack width="full">
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                      <Skeleton height="20px" />
                    </Stack>
                  ) : (
                    <Table
                      size="sm"
                      width="full"
                      // height="100%"
                      border="none"
                      boxShadow="md"
                      bg="gray.200"
                      variant="striped"
                    >
                      <Thead bg="secondary" position="sticky" top={0}>
                        <Tr>
                          <Th color="#D6D6D6" fontSize="10px">
                            ID
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Ordered Date
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Ordered Needed
                          </Th>
                          {/* <Th color="#D6D6D6" fontSize="10px">
                            Customer Code
                          </Th> */}
                          <Th color="#D6D6D6" fontSize="10px">
                            Customer Name
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Item Code
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Item Description
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Category
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            UOM
                          </Th>
                          <Th color="#D6D6D6" fontSize="10px">
                            Quantity Order
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {genusOrders?.genus_orders
                          ?.filter((val) => {
                            const newKeyword = new RegExp(
                              `${keyword.toLowerCase()}`
                            );
                            return val.order_details.farm_name
                              ?.toLowerCase()
                              .match(newKeyword, "*");
                          })
                          ?.map((order, i) => (
                            <Tr key={i}>
                              <Td fontSize="12px">{i + 1}</Td>
                              <Td fontSize="12px">
                                {order.order_details.dateOrdered}
                              </Td>
                              <Td fontSize="12px">
                                {order.order_details.dateNeeded}
                              </Td>
                              <Td fontSize="12px">{order.customer.name}</Td>
                              {/* <Td fontSize="12px">
                                {order.order_details.farm_code}
                              </Td>
                              <Td fontSize="12px">
                                {order.order_details.farm_name}
                              </Td> */}
                              <Td fontSize="12px">
                                {order.order_details.order.itemCode}
                              </Td>
                              <Td fontSize="12px">
                                {order.order_details.order.itemDescription}
                              </Td>
                              <Td fontSize="12px">
                                {order.order_details.order.category}
                              </Td>
                              <Td fontSize="12px">
                                {order.order_details.order.uom}
                              </Td>
                              <Td fontSize="12px">
                                {order.order_details.order.quantity}
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  )}
                </PageScroll>
              </VStack>
            </Flex>
          </>
        ) : (
          ""
        )}

        {fromDate && toDate ? (
          <Flex>
            <HStack>
              <Badge colorScheme="cyan">
                <Text color="secondary">
                  Number of Records: {genusOrders?.genus_orders?.length}
                </Text>
              </Badge>
            </HStack>
          </Flex>
        ) : (
          ""
        )}

        {isOpen && (
          <OrdersConfirmation
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            resultArray={resultArray}
            errorData={errorData}
            setErrorData={setErrorData}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}
      </Flex>
    </Flex>
  );
};
