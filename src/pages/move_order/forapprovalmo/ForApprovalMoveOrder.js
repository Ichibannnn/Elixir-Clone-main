import React, { useState } from "react";
import {
  Badge,
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
// import PageScrollReusable from '../../../components/PageScroll-Reusable'
// import { ApproveModal, RejectModal, ViewModal } from './Action-Modals'
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
import PageScroll from "../../../utils/PageScroll";
import { ApproveModal, RejectModal, ViewModal } from "./ActionModal";
import { FaShippingFast } from "react-icons/fa";

export const ForApprovalMoveOrder = ({
  setCurrentPage,
  setPageSize,
  setSearch,
  pagesCount,
  currentPage,
  pageSize,
  forApprovalData,
  fetchForApprovalMO,
  mirId,
  setMirId,
  viewData,
  fetchNotification,
  status,
  setStatus,
}) => {
  const TableHead = [
    "Line",
    "MIR ID",
    "Customer Code",
    "Customer Name",
    // "Category",
    "Total Quantity Order",
    "Prepared Date",
    "Rush",
    "View",
    "Approve",
    "Reject",
  ];

  const [totalQuantity, setTotalQuantity] = useState("");

  const {
    isOpen: isView,
    onClose: closeView,
    onOpen: openView,
  } = useDisclosure();
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

  const viewHandler = (id) => {
    if (id) {
      setMirId(id);
    } else {
      setMirId("");
    }
    openView();
  };

  const approveHandler = (data) => {
    if (data) {
      setMirId(data.mirId);
      setTotalQuantity(data.quantity);
    } else {
      setMirId("");
      setTotalQuantity("");
    }
    openApprove();
    console.log(mirId);
  };

  const rejectHandler = (id) => {
    if (id) {
      setMirId(id);
    } else {
      setMirId("");
    }
    openReject();
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  return (
    <Flex w="full" flexDirection="column" p={5} bg="form">
      <Flex justifyContent="space-between">
        <Select
          onChange={handlePageSizeChange}
          w="7%"
          variant="filled"
          fontSize="11px"
          borderColor="gray.400"
        >
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
            placeholder="MIR Id"
            onChange={(e) => searchHandler(e.target.value)}
          />
        </HStack>
      </Flex>

      <Flex mt={5} flexDirection="column">
        <Flex direction="row" justifyContent="left">
          <Button
            size="xs"
            fontSize="xs"
            borderRadius="none"
            colorScheme={!status ? "blue" : "gray"}
            variant={!status ? "solid" : "outline"}
            onClick={() => handleStatusChange(false)}
          >
            Regular Orders
            {/* {regularOrdersCount > 0 && (
            // <Badge ml={2} colorScheme="red" variant="solid" borderRadius="40%">
            //   {regularOrdersCount}
            // </Badge>
          )} */}
          </Button>
          <Button
            size="xs"
            fontSize="xs"
            borderRadius="none"
            colorScheme={status ? "blue" : "gray"}
            variant={status ? "solid" : "outline"}
            onClick={() => handleStatusChange(true)}
          >
            Rush Orders
            {/* {rushOrdersCount > 0 && (
            <Badge ml={2} colorScheme="red" variant="solid" borderRadius="40%">
              {rushOrdersCount}
            </Badge>
          )} */}
          </Button>
        </Flex>
        <PageScroll minHeight="200px" maxHeight="480px">
          <Table size="sm">
            <Thead bgColor="primary">
              <Tr>
                {TableHead?.map((head, i) => (
                  <Th h="40px" key={i} color="white" fontSize="10px">
                    {head}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {forApprovalData?.moveorder?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{i + 1}</Td>
                  <Td fontSize="xs">{item.mirId}</Td>
                  <Td fontSize="xs">{item.customercode}</Td>
                  <Td fontSize="xs">{item.customerName}</Td>
                  {/* <Td fontSize="xs">{item.category}</Td> */}
                  <Td fontSize="xs">{item.quantity}</Td>
                  <Td fontSize="xs">
                    {moment(item.preparedDate).format("MM/DD/yyyy")}
                  </Td>
                  <Td fontSize="xs">
                    {/* {" "} */}
                    {item.rush ? (
                      <FaShippingFast
                        fontSize="17px"
                        title="Rush Orders"
                        color="#E53E3E"
                      />
                    ) : (
                      <FaShippingFast fontSize="17px" color="#A0AEC0" />
                    )}
                  </Td>
                  {/* <Td>{item.dateNeeded}</Td> */}
                  <Td>
                    <Button
                      fontSize="11px"
                      borderRadius="none"
                      size="xs"
                      colorScheme="facebook"
                      px={4}
                      onClick={() => viewHandler(item.mirId)}
                    >
                      View
                    </Button>
                  </Td>
                  <Td>
                    <Button
                      fontSize="11px"
                      borderRadius="none"
                      size="xs"
                      colorScheme="blue"
                      onClick={() => approveHandler(item)}
                    >
                      Approve
                    </Button>
                  </Td>
                  <Td>
                    <Button
                      borderRadius="none"
                      size="xs"
                      fontSize="11px"
                      color="white"
                      colorScheme="red"
                      px={3}
                      onClick={() => rejectHandler(item.mirId)}
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
          {forApprovalData?.moveorder?.length > 0
            ? `Showing ${forApprovalData?.moveorder?.length} entries`
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
                _hover={{ bg: "btnColor", color: "white" }}
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
                _hover={{ bg: "btnColor", color: "white" }}
              >
                {"Next >"}
              </PaginationNext>
            </PaginationContainer>
          </Pagination>
        </Flex>
      </Flex>

      {isView && (
        <ViewModal
          isOpen={isView}
          onClose={closeView}
          id={mirId}
          viewData={viewData}
        />
      )}
      {isApprove && (
        <ApproveModal
          isOpen={isApprove}
          onClose={closeApprove}
          orderNo={mirId}
          fetchForApprovalMO={fetchForApprovalMO}
          printData={viewData}
          fetchNotification={fetchNotification}
          totalQuantity={totalQuantity}
        />
      )}
      {isReject && (
        <RejectModal
          isOpen={isReject}
          onClose={closeReject}
          id={mirId}
          fetchForApprovalMO={fetchForApprovalMO}
          fetchNotification={fetchNotification}
        />
      )}
    </Flex>
  );
};
