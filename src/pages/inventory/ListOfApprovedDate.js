import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
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
  VStack,
} from "@chakra-ui/react";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import PageScrollImport from "../../components/PageScrollImport";
import { VscCircleLargeFilled } from "react-icons/vsc";
import { BiRightArrow } from "react-icons/bi";
import { FaArrowAltCircleRight, FaShippingFast, FaSort } from "react-icons/fa";
import moment from "moment";
import { CancelApprovedDate, CancelConfirmation } from "./ActionModal";
import PageScroll from "../../utils/PageScroll";
import { GoArrowSmallRight } from "react-icons/go";

export const ListofApprovedDate = ({
  customerName,
  moveData,
  pagesCount,
  currentPage,
  fetchApprovedMoveOrders,
  lengthIndicator,
  setCurrentPage,
  setItemCode,
  setWarehouseId,
  setHighlighterId,
  setOrderId,
  orderId,
  setDeliveryStatus,
  setBatchNumber,
  buttonChanger,
  preparedLength,
}) => {
  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
    setItemCode("");
    setWarehouseId("");
    // setHighlighterId('')
    setOrderId("");
  };

  const handleId = (data) => {
    setItemCode("");
    setHighlighterId("");
    setDeliveryStatus("");
    if (data) {
      setOrderId(data);
    } else {
      setOrderId("");
    }
  };

  // Return to Page 1 once length === 0
  useEffect(() => {
    if (lengthIndicator === 0) {
      setCurrentPage(1);
      fetchApprovedMoveOrders();
    }
  }, [lengthIndicator]);

  //Auto select index 0
  useEffect(() => {
    setOrderId(moveData[0]?.id);
  }, [moveData]);

  //Sort by date start line
  const [order, setOrder] = useState("asc");
  function descendingComparator(a, b) {
    if (
      moment(b?.preparedDate).format("yyyy-MM-DD") <
      moment(a?.preparedDate).format("yyyy-MM-DD")
    ) {
      return -1;
    }
    if (
      moment(b?.preparedDate).format("yyyy-MM-DD") >
      moment(a?.preparedDate).format("yyyy-MM-DD")
    ) {
      return 1;
    }
    return 0;
  }
  function getComparator(order) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b)
      : (a, b) => -descendingComparator(a, b);
  }
  //Sort by date end line

  const {
    isOpen: isCancel,
    onOpen: openCancel,
    onClose: closeCancel,
  } = useDisclosure();
  const cancelHandler = (id) => {
    if (id) {
      setOrderId(id);
      openCancel();
    }
  };

  const selectedValue = () => {
    const option = [{ name: "Pick-Up" }];
    const selectedId = 0;
  };

  return (
    <Flex w="full" flexDirection="column">
      <Flex w="full" justifyContent="space-between">
        <HStack w="40%">
          <Badge bgColor="secondary" fontSize="10px" color="white" px={1}>
            Customer:{" "}
          </Badge>
          <Text fontSize="13px">{customerName && customerName}</Text>
        </HStack>

        <Flex>
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          >
            <PaginationContainer>
              <PaginationPrevious
                border="1px"
                fontSize="xs"
                px={2}
                _hover={{ bg: "blue.200", color: "white" }}
                borderRadius="none"
                size="sm"
              >
                {"< Previous"}
              </PaginationPrevious>
              <Text mx={1} bgColor="primary" color="white" px={2} pt={1}>
                {currentPage}
              </Text>
              <PaginationNext
                border="1px"
                fontSize="xs"
                px={4}
                _hover={{ bg: "blue.200", color: "white" }}
                borderRadius="none"
                size="sm"
              >
                {"Next >"}
              </PaginationNext>
            </PaginationContainer>
          </Pagination>
        </Flex>
      </Flex>

      {/* {buttonChanger ? (
        <VStack spacing={1}>
          <HStack w="full" justifyContent="start">
            <Badge bgColor="primary" fontSize="10px" color="white" px={1}>
              Delivery Status:{" "}
            </Badge>
            <Select
              onChange={(e) => setDeliveryStatus(e.target.value)}
              placeholder=" "
              w="15%"
              size="xs"
              bgColor="#fff8dc"
            >
              <option>Pick-Up</option>
            </Select>
          </HStack>
          <HStack w="full" justifyContent="start">
            <Badge bgColor="primary" fontSize="10px" color="white" px={1}>
              Batch Number:{" "}
            </Badge>
            <Select
              onChange={(e) => setBatchNumber(e.target.value)}
              placeholder=" "
              w="15%"
              size="xs"
              bgColor="#fff8dc"
            >
              <option>{`${moment(new Date()).format("YYYY")} - 1`}</option>
              <option>{`${moment(new Date()).format("YYYY")} - 2`}</option>
              <option>{`${moment(new Date()).format("YYYY")} - 3`}</option>
              <option>{`${moment(new Date()).format("YYYY")} - 4`}</option>
              <option>{`${moment(new Date()).format("YYYY")} - 5`}</option>
              <option>{`${moment(new Date()).format("YYYY")} - 6`}</option>
              <option>{`${moment(new Date()).format("YYYY")} - 7`}</option>
            </Select>
          </HStack>
        </VStack>
      ) : (
        ""
      )} */}
      <VStack w="full" spacing={0} justifyContent="center" mt={6}>
        <Box w="full" bgColor="primary" h="22px">
          <Text
            fontWeight="semibold"
            color="white"
            textAlign="center"
            justifyContent="center"
            fontSize="xs"
          >
            List of Approved Orders
          </Text>
        </Box>
        <PageScroll minHeight="150px" maxHeight="210px">
          <Table size="sm" variant="simple">
            <Thead bgColor="secondary">
              <Tr>
                <Th color="white" fontSize="10px">
                  Line
                </Th>
                <Th color="white" fontSize="10px">
                  Order ID
                </Th>
                {/* <Th color="white" fontSize="10px">
                  Department
                </Th> */}
                <Th color="white" fontSize="10px">
                  Customer Code
                </Th>
                <Th color="white" fontSize="10px">
                  Customer Name
                </Th>
                {/* <Th color="white" fontSize="10px">
                  Category
                </Th> */}
                <Th color="white" fontSize="10px">
                  Total Quantity Order
                </Th>
                <Th color="white" fontSize="10px">
                  <HStack>
                    <Text>Prepared Date</Text>
                    <Button
                      cursor="pointer"
                      onClick={() => {
                        setOrder(order === "asc" ? "desc" : "asc");
                      }}
                      size="xs"
                      p={0}
                      m={0}
                      background="none"
                      _hover={{ background: "none" }}
                    >
                      <FaSort />
                    </Button>
                  </HStack>
                </Th>
                <Th color="white" fontSize="10px">
                  Rush
                </Th>
                <Th color="white" fontSize="10px">
                  Cancel
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {moveData?.sort(getComparator(order)).map((order, i) => (
                <Tr
                  key={i}
                  title={order.isReject ? order.remarks : ""}
                  onClick={() => handleId(order.id)}
                  bgColor={orderId === order.id ? "blue.100" : "none"}
                  _hover={
                    order.isReject
                      ? { bgColor: "gray.200" }
                      : { bgColor: "none" }
                  }
                  cursor="pointer"
                >
                  {orderId === order.id ? (
                    <Td>
                      <GoArrowSmallRight fontSize="27px" />
                    </Td>
                  ) : (
                    <Td fontSize="11px">{i + 1}</Td>
                  )}
                  <Td fontSize="xs">{order.id}</Td>
                  {/* <Td fontSize="xs">{order.department}</Td> */}
                  <Td fontSize="xs">{order.customerCode}</Td>
                  <Td fontSize="xs">{order.customerName}</Td>

                  {/* <Td fontSize="xs">{order.category}</Td> */}
                  <Td fontSize="xs">{order.totalOrders}</Td>
                  <Td fontSize="xs">
                    {moment(order.preparedDate).format("MM/DD/yyyy")}
                  </Td>

                  <Td fontSize="xs">
                    {/* {" "} */}
                    {order.rush ? (
                      <FaShippingFast
                        title="Rush Orders"
                        fontSize="17px"
                        color="orange"
                      />
                    ) : (
                      <FaShippingFast fontSize="17px" color="#A0AEC0" />
                    )}
                  </Td>
                  <Td fontSize="11px">
                    <Button
                      size="xs"
                      fontSize="11px"
                      colorScheme="red"
                      onClick={() => cancelHandler(order.id)}
                      disabled={preparedLength > 0}
                      title={
                        preparedLength > 0
                          ? "Please cancel all prepared items first"
                          : ""
                      }
                      borderRadius="none"
                    >
                      Cancel
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </VStack>

      {isCancel && (
        <CancelApprovedDate
          isOpen={isCancel}
          onClose={closeCancel}
          id={orderId}
          setOrderId={setOrderId}
          fetchApprovedMoveOrders={fetchApprovedMoveOrders}
        />
      )}
    </Flex>
  );
};
