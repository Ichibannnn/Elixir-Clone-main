import React, { useState } from "react";
import {
  Button,
  Flex,
  HStack,
  Input,
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
import PageScroll from "../../../utils/PageScroll";
// import { PrintModal, RejectModal, TrackModal } from './Action-Modals'
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import moment from "moment";
import { ImLocation } from "react-icons/im";
import { PrintModal, RejectModal, TrackModal } from "./ActionModal";

export const ApproveMoveOrder = ({
  setCurrentPage,
  setPageSize,
  setSearch,
  pagesCount,
  currentPage,
  approvedData,
  fetchApprovedMO,
  setOrderId,
  orderId,
  printData,
}) => {
  const TableHead = [
    "Line",
    "Order ID",
    "Customer Code",
    "Category",
    "Total Quantity Order",
    "Prepared Date",
    "Track",
    "Print",
    "Reject",
  ];

  const [trackData, setTrackData] = useState([
    {
      barcodeNo: "",
      itemCode: "",
      itemDescription: "",
      quantity: "",
      isPrepared: "",
      isApproved: "",
      isPrint: "",
      isTransact: "",
    },
  ]);

  const [totalQuantity, setTotalQuantity] = useState("");

  const {
    isOpen: isTrack,
    onClose: closeTrack,
    onOpen: openTrack,
  } = useDisclosure();
  const {
    isOpen: isReject,
    onClose: closeReject,
    onOpen: openReject,
  } = useDisclosure();
  const {
    isOpen: isPrint,
    onClose: closePrint,
    onOpen: openPrint,
  } = useDisclosure();

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };
  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  const searchHandler = (inputValue) => {
    setSearch(inputValue);
  };

  const rejectHandler = (orderNo) => {
    if (orderNo) {
      setOrderId(orderNo);
      openReject();
    } else {
      setOrderId("");
    }
  };

  const trackHandler = (data) => {
    if (data) {
      setOrderId(data.orderNo);
      setTrackData([
        {
          barcodeNo: data.barcodeNo,
          itemCode: data.itemCode,
          itemDescription: data.itemDescription,
          quantity: data.quantity,
          isPrepared: data.isPrepared,
          isApproved: data.isApprove,
          isPrint: data.isPrint,
          isTransact: data.isTransact,
        },
      ]);
      openTrack();
    } else {
      setOrderId("");
      setTrackData([
        {
          barcodeNo: "",
          itemCode: "",
          itemDescription: "",
          quantity: "",
          isPrepared: "",
          isApproved: "",
          isPrint: "",
          isTransact: "",
        },
      ]);
    }
  };

  const printHandler = (id, quantity) => {
    if (id) {
      setOrderId(id);
      setTotalQuantity(quantity);
      openPrint();
    } else {
      setOrderId("");
      setTotalQuantity("");
    }
  };

  return (
    <Flex w="full" flexDirection="column" p={5} bg="form">
      <Flex justifyContent="space-between">
        <Select onChange={handlePageSizeChange} w="7%" variant="filled" fontSize="11px" borderColor="gray.400">
          <option value={Number(10)}>10</option>
          <option value={Number(20)}>20</option>
          <option value={Number(30)}>30</option>
          <option value={Number(50)}>50</option>
        </Select>
        <HStack w="17%">
          <Text fontSize="13px">Search:</Text>
          <Input
            borderColor="gray.400"  
            fontSize="11px"
            borderRadius="none"
            placeholder="Order Id"
            onChange={(e) => searchHandler(e.target.value)}
          />
        </HStack>
      </Flex>

      <Flex mt={5}>
        <PageScroll minHeight="200px" maxHeight="500px">
          <Table size="sm" variant ="striped">
            <Thead bgColor="primary">
              <Tr>
                {TableHead?.map((head, i) => (
                  <Th p={3} key={i} color="white" fontSize="10px">
                    {head}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {approvedData?.moveorder?.map((order, i) => (
                <Tr key={i}>
                  <Td fontSize="13px">{i + 1}</Td>
                  <Td fontSize="13px">{order.orderNo}</Td>
                  <Td fontSize="13px">{order.customerCode}</Td>
                  <Td fontSize="13px">{order.category}</Td>
                  <Td fontSize="13px">{order.quantity}</Td>
                  <Td fontSize="13px">
                    {moment(order.preparedDate).format("MM/DD/yyyy")}
                  </Td>
                  <Td>
                    <Button
                      size="xs"
                      p={0}
                      bg="none"
                      onClick={() => trackHandler(order)}
                    >
                      <ImLocation color="#314E89" fontSize="19px" />
                    </Button>
                  </Td>
                  <Td>
                    <Button
                      fontSize="13px"
                      borderRadius="none"
                      size="xs"
                      colorScheme="blue"
                      color="white"
                      onClick={() =>
                        printHandler(order.orderNo, order.quantity)
                      }
                    >
                      Print
                    </Button>
                  </Td>
                  <Td>
                    <Button
                      onClick={() => rejectHandler(order.orderNo)}
                      disabled={order.isTransact}
                      title={
                        order.isTransact
                          ? "Order was already transacted"
                          : "Order not yet transacted"
                      }
                      borderRadius="none"
                      size="xs"
                      fontSize="13px"
                      colorScheme="red"
                    >
                      Reject
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex justifyContent="space-between" mt={7}>
        <Text fontSize="xs">
          {approvedData?.moveorder?.length > 0
            ? `Showing ${approvedData?.moveorder?.length} entries`
            : "No entries available"}
        </Text>

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
                _hover={{ bg: "accent", color: "white" }}
              >
                {"< Previous"}
              </PaginationPrevious>
              <Text mx={1} bgColor="secondary" color="white" px={2} pt={1.5}>
                {currentPage}
              </Text>
              <PaginationNext
                border="1px"
                fontSize="xs"
                px={4}
                _hover={{ bg: "accent", color: "white" }}
              >
                {"Next >"}
              </PaginationNext>
            </PaginationContainer>
          </Pagination>
        </Flex>
      </Flex>

      {isTrack && (
        <TrackModal
          isOpen={isTrack}
          onClose={closeTrack}
          trackData={trackData}
          trackList={printData}
        />
      )}

      {isPrint && (
        <PrintModal
          isOpen={isPrint}
          onClose={closePrint}
          printData={printData}
          fetchApprovedMO={fetchApprovedMO}
          orderId={orderId}
          totalQuantity={totalQuantity}
        />
      )}

      {
        isReject && (
        <RejectModal
          isOpen={isReject}
          onClose={closeReject}
          id={orderId}
          fetchApprovedMO={fetchApprovedMO}
            // fetchNotification={fetchNotification}
        />
        )
      }
    </Flex>
  );
};
