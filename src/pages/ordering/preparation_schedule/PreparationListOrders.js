import React, { useState, useEffect } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Flex,
  HStack,
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
import { TiInfo } from "react-icons/ti";
import PageScrollImport from "../../../components/PageScrollImport";
import PageScroll from "../../../utils/PageScroll";
import {
  CancelModalConfirmation,
  EditModal,
  ScheduleModal,
} from "./ScheduleModal";

export const PreparationListOrders = ({
  setCurrentPage,
  currentPage,
  pagesCount,
  customerName,
  setCustomerName,
  orders,
  pageTotal,
  setTrasactId,
  transactId,
  fetchOrders,
  fetchCustomerOrders,
  lengthIndicator,
}) => {
  const [editData, setEditData] = useState({
    transactId: "",
    customerName: "",
    itemCode: "",
    itemDescription: "",
    uom: "",
    quantiyOrdered: "",
  });
  const [cancelId, setCancelId] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);
  const [dateNeeded, setDateNeeded] = useState("");
  const [disableIfStock, setDisableIfStock] = useState(false);
  const dateToday = new Date();

  const {
    isOpen: isEdit,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();
  const {
    isOpen: isCancel,
    onOpen: openCancel,
    onClose: closeCancel,
  } = useDisclosure();
  const {
    isOpen: isSchedule,
    onOpen: openSchedule,
    onClose: closeSchedule,
  } = useDisclosure();

  const handlePageChange = (nextPage) => {
    setCheckedItems([]);
    setCurrentPage(nextPage);
  };

  const editHandler = ({
    id,
    customerName,
    itemCode,
    itemDescription,
    uom,
    quantityOrder,
  }) => {
    if (
      id &&
      customerName &&
      itemCode &&
      itemDescription &&
      uom &&
      quantityOrder
    ) {
      setEditData({
        transactId: id,
        customerName: customerName,
        itemCode: itemCode,
        itemDescription: itemDescription,
        uom: uom,
        quantiy: quantityOrder,
      });
      openEdit();
    } else {
      setEditData({
        transactId: "",
        customerName: "",
        itemCode: "",
        itemDescription: "",
        uom: "",
        quantiy: "",
      });
    }
  };

  const cancelHandler = ({ id }) => {
    if (id) {
      setCancelId(id);
      openCancel();
    } else {
      setCancelId("");
    }
  };

  //refetch if data length === 0
  useEffect(() => {
    if (lengthIndicator === 0 && currentPage === 1) {
      fetchCustomerOrders();
      fetchOrders();
    }
    if (lengthIndicator === 0 && currentPage !== 1) {
      setCurrentPage(1);
      fetchOrders();
    }
  }, [lengthIndicator]);

  const stockAvailable = orders?.filter(
    (item) => item.stockOnHand >= item.quantityOrder
  );
  const stockData = stockAvailable?.map((item) => item.id);
  const parentCheckHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems(stockData);
    } else {
      setCheckedItems([]);
    }
  };

  const scheduleHandler = () => {
    openSchedule();
  };

  const childCheckHandler = (e) => {
    if (e.target.checked) {
      setCheckedItems([...checkedItems, parseInt(e.target.value)]);
    } else {
      const data = checkedItems?.filter(
        (item) => item !== parseInt(e.target.value)
      );
      setCheckedItems(data);
    }
  };

  return (
    <Flex w="full" flexDirection="column">
      <Flex w="full" justifyContent="space-between">
        <HStack w="40%">
          <Badge bgColor="primary" color="white" px={3}>
            Customer:{" "}
          </Badge>
          <Text fontSize="sm">{customerName && customerName}</Text>
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
                _hover={{ bg: "btnColor", color: "white" }}
              >
                {"< Previous"}
              </PaginationPrevious>
              <Text mx={1} bgColor="primary" color="white" px={2} pt={1.5}>
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

      <Text textAlign="center" fontSize="sm" fontWeight="semibold">
        {pageTotal && pageTotal} Remaining Orders
      </Text>

      <Flex
        w="full"
        spacing={0}
        flexDirection="column"
        justifyContent="center"
        mt={10}
      >
        <Text
          w="full"
          fontWeight="semibold"
          fontSize="xs"
          bgColor="primary"
          color="white"
          textAlign="center"
        >
          List of Orders
        </Text>
        <PageScroll maxHeight="700px">
          <Table
            size="sm"
            width="full"
            border="none"
            boxShadow="md"
            // bg="gray.200"
            variant="simple"
          >
            <Thead bg="secondary">
              <Tr>
                <Th>
                  <Checkbox
                    size="sm"
                    onChange={parentCheckHandler}
                    isChecked={stockData?.length === checkedItems?.length}
                    disabled={!stockData?.length > 0}
                    color="white"
                  >
                    <Text fontSize="9px">Line</Text>
                  </Checkbox>
                </Th>
                <Th color="white" fontSize="9px">
                  ID
                </Th>
                <Th color="white" fontSize="9px">
                  Order Date
                </Th>
                <Th color="white" fontSize="9px">
                  Date Needed
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
                <Th color="white" fontSize="9px">
                  Reserve
                </Th>
                <Th color="white" fontSize="9px">
                  Edit
                </Th>
                <Th color="white" fontSize="9px">
                  Cancel
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders?.map((item, i) => (
                <Tr
                  bgColor={
                    item.stockOnHand < item.quantityOrder ? "#dfdfdf5c" : "none"
                  }
                  color={
                    item.stockOnHand < item.quantityOrder ? "black" : "none"
                  }
                  _active={
                    transactId
                      ? { bgColor: "accent", color: "white" }
                      : { bgColor: "none" }
                  }
                  _hover={
                    transactId
                      ? { bgColor: "accent", color: "white" }
                      : { bgColor: "none" }
                  }
                  cursor="pointer"
                  key={i}
                >
                  {item.stockOnHand >= item.quantityOrder ? (
                    <Td>
                      <Checkbox
                        size="sm"
                        onChange={childCheckHandler}
                        isChecked={checkedItems.includes(item.id)}
                        value={item.id}
                        color="black"
                      >
                        <Text fontSize="11px">{i + 1}</Text>
                      </Checkbox>
                    </Td>
                  ) : (
                    <Td>
                      <HStack>
                        <TiInfo color="red" title="Not enough stocks" />
                        <Text fontSize="11px">{i + 1}</Text>
                      </HStack>
                    </Td>
                  )}
                  <Td fontSize="11px">{item.id}</Td>
                  <Td fontSize="11px">{item.orderDate}</Td>
                  <Td fontSize="11px">{item.dateNeeded}</Td>
                  <Td fontSize="11px">{item.customerCode}</Td>
                  <Td fontSize="11px">{item.customerName}</Td>
                  <Td fontSize="11px">{item.category.toUpperCase()}</Td>
                  <Td fontSize="11px">{item.itemCode}</Td>
                  <Td fontSize="11px">{item.itemDescription}</Td>
                  <Td fontSize="11px">{item.uom}</Td>
                  <Td fontSize="11px">
                    {item.quantityOrder.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </Td>
                  <Td fontSize="11px">{item.stockOnHand}</Td>
                  <Td fontSize="11px">
                    <Button
                      onClick={() => editHandler(item)}
                      disabled={item.stockOnHand === 0}
                      size="xs"
                      colorScheme="blue"
                      color="white"
                      px={4}
                      borderRadius="none"
                    >
                      <Text fontSize="11px">Edit</Text>
                    </Button>
                  </Td>

                  <Td fontSize="11px">
                    <Button
                      onClick={() => cancelHandler(item)}
                      colorScheme="red"
                      size="xs"
                      borderRadius="none"

                    >
                      <Text fontSize="11px">Cancel</Text>
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
        <Flex w="full" justifyContent="space-between" py={2} px={2}>
          <Text fontSize="xs">Selected Item(s): {checkedItems?.length}</Text>
          <Button
            onClick={scheduleHandler}
            title={
              !checkedItems?.length > 0
                ? disableIfStock
                  ? "Stocks must be available"
                  : "Please select an order to schedule"
                : !checkedItems?.length > 0 || disableIfStock
                ? "Stocks must be available"
                : "Schedule order(s)"
            }
            disabled={!checkedItems?.length > 0 || disableIfStock}
            size="sm"
            px={3}
            colorScheme="blue"
            borderRadius="none"
          >
            Schedule
          </Button>
        </Flex>
      </Flex>

      {isEdit && (
        <EditModal
          isOpen={isEdit}
          onClose={closeEdit}
          editData={editData}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          fetchOrders={fetchOrders}
        />
      )}

      {isCancel && (
        <CancelModalConfirmation
          isOpen={isCancel}
          onClose={closeCancel}
          cancelId={cancelId}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          fetchOrders={fetchOrders}
          //   fetchNotification={fetchNotification}
        />
      )}

      {isSchedule && (
        <ScheduleModal
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          isOpen={isSchedule}
          onClose={closeSchedule}
          customerName={customerName}
          fetchOrders={fetchOrders}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      )}
    </Flex>
  );
};
