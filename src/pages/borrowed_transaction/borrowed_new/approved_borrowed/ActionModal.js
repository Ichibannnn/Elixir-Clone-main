import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
  HStack,
  ModalOverlay,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import PageScroll from "../../../../utils/PageScroll";
import moment from "moment";
// import { EditModal } from "./ActionModalBorrowed";
import { ToastComponent } from "../../../../components/Toast";
import Swal from "sweetalert2";

export const ViewModal = ({
  isOpen,
  onClose,
  statusBody,
  fetchBorrowed,
  setIsLoading,
}) => {
  const {
    isOpen: isEdit,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();

  const [borrowedDetailsData, setBorrowedDetailsData] = useState([]);
  const [editData, setEditData] = useState({
    id: "",
    itemCode: "",
    itemDescription: "",
    returnQuantity: "",
    consumes: "",
    quantity: "",
  });

  const toast = useToast();

  const id = statusBody.id;
  const fetchBorrowedDetailsApi = async (id) => {
    const res = await request.get(
      `Borrowed/GetAllDetailsInBorrowedIssue?id=${id}`
    );
    return res.data;
  };

  const fetchBorrowedDetails = () => {
    fetchBorrowedDetailsApi(id).then((res) => {
      setBorrowedDetailsData(res);
    });
  };

  useEffect(() => {
    fetchBorrowedDetails();
  }, [id]);

  const editHandler = ({
    id,
    itemCode,
    itemDescription,
    returnQuantity,
    consumes,
    quantity,
  }) => {
    if (
      id &&
      itemCode &&
      itemDescription &&
      returnQuantity >= 0 &&
      consumes >= 0 &&
      quantity
      //   id &&
      //   itemCode &&
      //   itemDescription &&
      //   returnQuantity > 0 &&
      //   consumes > 0 &&
      //   quantity
    ) {
      setEditData({
        id: id,
        itemCode: itemCode,
        itemDescription: itemDescription,
        returnQuantity: returnQuantity,
        consumes: consumes,
        quantity: quantity,
      });
      openEdit();
    } else {
      setEditData({
        id: "",
        itemCode: "",
        itemDescription: "",
        returnQuantity: "",
        consumes: "",
        quantity: "",
      });
    }
  };

  const submitBody = () => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to save this information?",
      icon: "info",
      color: "black",
      background: "white",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#CBD1D8",
      confirmButtonText: "Yes",
      heightAuto: false,
      width: "40em",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          if (statusBody.id) {
            const res = request
              .put(`Borrowed/SaveReturnedQuantity`, [{ id: statusBody.id }])
              .then((res) => {
                fetchBorrowed();
                ToastComponent(
                  "Success",
                  "Returned materials was saved",
                  "success",
                  toast
                );
                onClose();
              })
              .catch((err) => {
                ToastComponent(
                  "Error",
                  "Returned materials was not saved",
                  "error",
                  toast
                );
                setIsLoading(false);
              });
          }
        } catch (error) {}
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} size="5xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mb={5} fontSize="md">
          {/* <Flex fontSize="sm" justifyContent="center" mb={5}>
            <Text>Borrowed Details</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={-1}>
              <Text fontSize="xs">
                Customer Code: {borrowedDetailsData[0]?.customerCode}
              </Text>
              <Text fontSize="xs">
                Customer Name: {borrowedDetailsData[0]?.customer}
              </Text>
              <Text fontSize="xs">
                Details: {borrowedDetailsData[0]?.remarks}
              </Text>
            </VStack>
            <VStack alignItems="start" spacing={-1}>
              <Text fontSize="xs">
                Transaction ID: {borrowedDetailsData[0]?.borrowedPKey}
              </Text>
              <Text fontSize="xs">
                Transaction Date:{" "}
                {moment(borrowedDetailsData[0]?.borrowedDate).format(
                  "yyyy-MM-DD"
                )}
              </Text>
              <Text fontSize="xs">
                Transact By: {borrowedDetailsData[0]?.preparedBy}
              </Text>
            </VStack>
            <VStack alignItems="start" spacing={-1}>
              <Text fontSize="xs">
                Company: {borrowedDetailsData[0]?.companyName}
              </Text>
              <Text fontSize="xs">
                Department: {borrowedDetailsData[0]?.departmentName}
              </Text>
              <Text fontSize="xs">
                Location: {borrowedDetailsData[0]?.locationName}
              </Text>
              <Text fontSize="xs">
                Account Title: {borrowedDetailsData[0]?.accountTitles}
              </Text>
            </VStack>
          </Flex> */}
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody mb={5}>
          <Flex fontSize="sm" justifyContent="center" mb={5}>
            <Text fontWeight="semibold">Approved Borrowed Details</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <VStack alignItems="start" spacing={-1}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transaction ID:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.borrowedPKey}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transaction Date:
                </Text>
                <Text fontSize="xs">
                  {" "}
                  {moment(borrowedDetailsData[0]?.preparedDate).format(
                    "yyyy-MM-DD"
                  )}
                </Text>
              </HStack>

              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Code:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.customerCode}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Customer Name:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.customer}</Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Details:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.remarks}</Text>
              </HStack>
            </VStack>

            <VStack alignItems="start" spacing={-1}>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Company:
                </Text>
                <Text fontSize="xs">{borrowedDetailsData[0]?.companyName}</Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Department:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.departmentName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Location:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.locationName}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Account Title:
                </Text>
                <Text fontSize="xs">
                  {borrowedDetailsData[0]?.accountTitles}
                </Text>
              </HStack>
            </VStack>
          </Flex>

          <VStack justifyContent="center">
            <PageScroll minHeight="350px" maxHeight="351px">
              <Table size="sm">
                <Thead bgColor="secondary">
                  <Tr>
                    <Th color="white" fontSize="xs">
                      Id
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="xs">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="xs">
                      Borrowed Qty
                    </Th>
                    <Th color="white" fontSize="xs">
                      Consumed
                    </Th>
                    <Th color="white" fontSize="xs">
                      Returned Qty
                    </Th>
                    <Th color="white" fontSize="xs">
                      Action
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {borrowedDetailsData?.map((borrowdetails, i) => (
                    <Tr key={i}>
                      <Td fontSize="xs">{borrowdetails.id}</Td>
                      <Td fontSize="xs">{borrowdetails.itemCode}</Td>
                      <Td fontSize="xs">{borrowdetails.itemDescription}</Td>
                      <Td fontSize="xs">
                        {borrowdetails.quantity.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.consumes.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </Td>
                      <Td fontSize="xs">
                        {borrowdetails.returnQuantity.toLocaleString(
                          undefined,
                          {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2,
                          }
                        )}
                      </Td>
                      <Td>
                        <Button
                          onClick={() => editHandler(borrowdetails)}
                          // disabled={
                          //     borrowdetails.returnQuantity === borrowdetails.quantity
                          // }
                          colorScheme="blue"
                          size="xs"
                        >
                          Return
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </PageScroll>
            <Flex justifyContent="space-between" mt={5} w="full">
              <HStack>
                <Text fontSize="xs" fontWeight="semibold">
                  Transacted By:
                </Text>
                <Text textDecoration="underline" fontSize="xs">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {borrowedDetailsData[0]?.preparedBy}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </Text>
              </HStack>
            </Flex>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <ButtonGroup size="sm">
            <Button colorScheme="blue" onClick={submitBody}>
              Submit
            </Button>
            <Button colorScheme="gray" onClick={onClose}>
              Close
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>

      {isEdit && (
        <EditModal
          isOpen={isEdit}
          onClose={closeEdit}
          editData={editData}
          fetchBorrowedDetails={fetchBorrowedDetails}
        />
      )}
    </Modal>
  );
};

export const EditModal = ({
  isOpen,
  onClose,
  editData,
  fetchBorrowedDetails,
}) => {
  const [quantitySubmit, setQuantitySubmit] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const quantityHandler = (data) => {
    if (data) {
      setQuantitySubmit(parseFloat(data));
    } else {
      setQuantitySubmit("");
    }
  };

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Borrowed/EditReturnedQuantity`, {
          id: editData.id,
          returnQuantity: quantitySubmit,
        })
        .then((res) => {
          ToastComponent("Success", "Order has been edited!", "success", toast);
          onClose();
          fetchBorrowedDetails();
        })
        .catch((err) => {
          // ToastComponent("Error", err.response.data, "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  const titles = ["Item Code", "Item Description", "Return Quantity"];
  const autofilled = [editData?.itemCode, editData?.itemDescription];

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} isCentered size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="primary" color="white">
            <Flex justifyContent="left">
              <Text fontSize="15px">Return Quantity</Text>
            </Flex>
          </ModalHeader>

          <ModalBody>
            {/* <PageScrollReusable minHeight='50px' maxHeight='350px'> */}
            {/* <Text textAlign="center" mb={7} fontSize="sm">
              Are you sure you want to edit this order?
            </Text> */}
            <HStack justifyContent="center" textAlign="start">
              <VStack spacing={4}>
                {titles.map((title) => (
                  <Text w="full" pl={2} key={title} fontSize="xs">
                    {title}
                  </Text>
                ))}
              </VStack>
              <VStack spacing={3.5}>
                {autofilled.map((items) => (
                  <Text
                    w="70%"
                    pl={2}
                    bgColor="gray.200"
                    border="1px"
                    key={items}
                    color="fontColor"
                    fontSize="xs"
                  >
                    {items}
                  </Text>
                ))}
                <Input
                  borderRadius="sm"
                  color="fontColor"
                  fontSize="sm"
                  onChange={(e) => quantityHandler(e.target.value)}
                  value={quantitySubmit}
                  type="number"
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) =>
                    ["E", "e", "+", "-"].includes(e.key) && e.preventDefault()
                  }
                  onPaste={(e) => e.preventDefault()}
                  w="72%"
                  pl={2}
                  h={7}
                  bgColor="#fff8dc"
                  border="1px"
                />
              </VStack>
            </HStack>
            {/* </PageScrollReusable> */}
          </ModalBody>

          <ModalFooter justifyItems="center">
            <ButtonGroup size="xs" mt={5}>
              <Button
                px={4}
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={
                  !quantitySubmit ||
                  isLoading ||
                  quantitySubmit > editData?.consumes
                }
                // disabled={!quantitySubmit || isLoading || quantitySubmit > editData?.consumes}
                colorScheme="blue"
              >
                Save
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="gray"
              >
                Cancel
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
