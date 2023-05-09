import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  toast,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { RiQuestionnaireLine } from "react-icons/ri";
import request from "../../services/ApiClient";
import { ToastComponent } from "../../components/Toast";
import { decodeUser } from "../../services/decode-user";
import axios from "axios";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

const currentUser = decodeUser();

//Cancel Approved Date
export const CancelApprovedDate = ({
  isOpen,
  onClose,
  id,
  setOrderId,
  fetchApprovedMoveOrders,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => {
    setIsLoading(true);
    console.log(id);
    try {
      const res = request
        .put(`Ordering/CancelOrdersInMoveOrder`, { orderNoPKey: id })
        .then((res) => {
          ToastComponent(
            "Success",
            "Successfully cancelled approved date",
            "success",
            toast
          );
          setOrderId("");
          fetchApprovedMoveOrders();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Cancel failed", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <RiQuestionnaireLine fontSize="35px" />
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <VStack justifyContent="center">
              <Text>
                Are you sure you want to cancel this approved date for
                re-scheduling?
              </Text>
            </VStack>
          </ModalBody>

          <ModalFooter mt={10}>
            <ButtonGroup size="sm" mt={3}>
              <Button
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="blue"
                px={4}
              >
                Yes
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="red"
                px={4}
              >
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

//Save Button

export const SaveButton = ({
  orderId,
  deliveryStatus,
  batchNumber,
  orderListData,
  fetchApprovedMoveOrders,
  fetchOrderList,
  setOrderId,
  setHighlighterId,
  setItemCode,
  setDeliveryStatus,
  setButtonChanger,
  setCurrentPage,
  currentPage,
  fetchNotification,
}) => {
  const {
    isOpen: isPlateNumber,
    onClose: closePlateNumber,
    onOpen: openPlateNumber,
  } = useDisclosure();

  return (
    <Flex w="full" justifyContent="end">
      <Button
        onClick={() => openPlateNumber()}
        // disabled={!deliveryStatus || !batchNumber}
        title={
          deliveryStatus
            ? `Save with delivery status "${deliveryStatus}" and batch number "${batchNumber}"`
            : "Please select a delivery status and batch number."
        }
        size="sm"
        colorScheme="blue"
        px={6}
      >
        Save
      </Button>
      {
        <AccountTitleModal
          orderId={orderId}
          isOpen={isPlateNumber}
          onClose={closePlateNumber}
          // deliveryStatus={deliveryStatus}
          // batchNumber={batchNumber}
          orderListData={orderListData}
          fetchApprovedMoveOrders={fetchApprovedMoveOrders}
          fetchOrderList={fetchOrderList}
          setOrderId={setOrderId}
          setHighlighterId={setHighlighterId}
          setItemCode={setItemCode}
          setDeliveryStatus={setDeliveryStatus}
          setButtonChanger={setButtonChanger}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          fetchNotification={fetchNotification}
        />
      }
    </Flex>
  );
};

const schema = yup.object().shape({
  formData: yup.object().shape({
    orderId: yup.string(),
    companyCode: yup.string().required("Company Code is required"),
    companyName: yup.string().required("Company Name is required"),
    departmentName: yup.string().required("Department Name is required"),
    locationName: yup.string().required("Location Name is required"),
    accountTitles: yup.string().required("Account Title is required"),
  }),
});

//ACCOUNT TITLE
export const AccountTitleModal = ({
  orderId,
  isOpen,
  onClose,
  fetchMoveOrder,
  orderListData,
  fetchApprovedMoveOrders,
  fetchOrderList,
  fetchPreparedItems,
  setOrderId,
  setHighlighterId,
  setItemCode,
  setDeliveryStatus,
  setButtonChanger,
  setCurrentPage,
  currentPage,
  fetchNotification,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState([]);
  const [department, setDepartment] = useState([]);
  const [location, setLocation] = useState([]);
  const [account, setAccount] = useState([]);

  // FETCH COMPANY API
  const fetchCompanyApi = async () => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/company?api_for=vladimir&status=1&paginate=0",
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setCompany(res.data.result.companies);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  // FETCH DEPT API
  const fetchDepartmentApi = async (id) => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/department?status=1&paginate=0&api_for=vladimir&company_id=" +
          id,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setDepartment(res.data.result.departments);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  // FETCH Loc API
  const fetchLocationApi = async (id) => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/location?status=1&paginate=0&api_for=vladimir&department_id=" +
          id,
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setLocation(res.data.result.locations);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCompanyApi();
  }, []);

  // FETCH ACcount API
  const fetchAccountApi = async () => {
    try {
      const res = await axios.get(
        "http://10.10.2.76:8000/api/dropdown/account-title?status=1&paginate=0",
        {
          headers: {
            Authorization: "Bearer " + process.env.REACT_APP_FISTO_TOKEN,
          },
        }
      );
      setAccount(res.data.result.account_titles);
      // console.log(res.data.result.companies);
    } catch (error) {}
  };

  useEffect(() => {
    fetchAccountApi();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        orderNo: orderId,
        companyCode: "",
        companyName: "",
        // departmentCode: "",
        departmentName: "",
        // locationCode: "",
        locationName: "",
        // accountCode: "",
        accountTitles: "",
      },
    },
  });

  // console.log(watch("formData"));

  const submitHandler = async (data) => {
    console.log(data);
    try {
      const response = await request
        .put(`Ordering/AddSavePreparedMoveOrder`, [data.formData])
        .then((response) => {
          ToastComponent(
            "Success",
            "Items prepared successfully.",
            "success",
            toast
          );

          // fetchMoveOrder();
          setOrderId("");
          setHighlighterId("");
          setItemCode("");
          setButtonChanger(false);
          setCurrentPage(currentPage);
          fetchApprovedMoveOrders();
          fetchOrderList();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  console.log(errors);

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <ModalContent>
            <ModalHeader>
              <Flex justifyContent="center">
                <Text>Account Title</Text>
              </Flex>
            </ModalHeader>
            <ModalCloseButton onClick={onClose} />

            <ModalBody>
              <Stack spacing={2} p={6}>
                <Box>
                  <FormLabel fontSize="sm">Company</FormLabel>
                  <Select
                    fontSize="sm"
                    onChange={(e) => {
                      setValue(
                        "formData.companyCode",
                        company.find(
                          (item) => item.id?.toString() === e.target.value
                        )?.code
                      );
                      setValue(
                        "formData.companyName",
                        company.find(
                          (item) => item.id?.toString() === e.target.value
                        )?.name
                      );
                      fetchDepartmentApi(e.target.value);
                    }}
                    placeholder="Select Company"
                    // {...register("formData.company")}
                  >
                    {company?.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.code} - {item.name}
                        </option>
                      );
                    })}
                  </Select>
                  <Text color="red" fontSize="xs">
                    {errors.formData?.companyName?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Department</FormLabel>
                  <Select
                    fontSize="sm"
                    placeholder="Select Department"
                    onChange={(e) => {
                      setValue(
                        "formData.departmentCode",
                        department.find(
                          (dept) => dept.id?.toString() === e.target.value
                        )?.code
                      );
                      setValue(
                        "formData.departmentName",
                        department.find(
                          (dept) => dept.id?.toString() === e.target.value
                        )?.name
                      );
                      fetchLocationApi(e.target.value);
                    }}
                  >
                    {department?.map((dept) => {
                      return (
                        <option key={dept.id} value={dept.id}>
                          {dept.code} - {dept.name}
                        </option>
                      );
                    })}
                  </Select>
                </Box>

                <Box>
                  <FormLabel fontSize="sm">Location</FormLabel>
                  <Select
                    fontSize="sm"
                    placeholder="Select Location"
                    onChange={(e) => {
                      setValue(
                        "formData.locationCode",
                        location.find(
                          (item) => item.id?.toString() === e.target.value
                        )?.code
                      );
                      setValue(
                        "formData.locationName",
                        location.find(
                          (item) => item.id?.toString() === e.target.value
                        )?.name
                      );
                      // fetchLocationApi(e.target.value);
                    }}
                  >
                    {location?.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.code} - {item.name}
                        </option>
                      );
                    })}
                  </Select>
                </Box>
                <Box>
                  <FormLabel fontSize="sm">Account Title</FormLabel>
                  <Select
                    fontSize="sm"
                    onChange={(e) => {
                      // setValue(
                      //   "formData.accountCode",
                      //   account.find(
                      //     (acc) => acc.id?.toString() === e.target.value
                      //   )?.code
                      // );
                      setValue(
                        "formData.accountTitles",
                        account.find(
                          (acc) => acc.id?.toString() === e.target.value
                        )?.name
                      );
                      // fetchAccountApi(e.target.value);
                    }}
                    placeholder="Select Account"
                    // {...register("formData.company")}
                  >
                    {account?.map((item) => {
                      return (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      );
                    })}
                  </Select>
                </Box>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                type="submit"
                // disabled={!isValid}
                colorScheme="blue"
                px={4}
              >
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export const AddQuantityConfirmation = ({
  isOpen,
  onClose,
  id,
  orderNo,
  itemCode,
  quantityOrdered,
  fetchOrderList,
  fetchPreparedItems,
  setQuantity,
  setHighlighterId,
  warehouseId,
  setWarehouseId,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .post(`Ordering/PrepareItemForMoveOrder`, {
          warehouseId: warehouseId,
          orderNoPkey: id,
          orderNo: orderNo,
          itemCode: itemCode,
          quantityOrdered: Number(quantityOrdered),
          preparedBy: currentUser.userName,
        })
        .then((res) => {
          ToastComponent(
            "Success",
            "Quantity has been prepared.",
            "success",
            toast
          );
          setQuantity("");
          setHighlighterId("");
          setWarehouseId("");
          setIsLoading(false);
          onClose();
          fetchOrderList();
          fetchPreparedItems();
        })
        .catch((err) => {
          ToastComponent("Error", "Add Failed", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {/* <Flex justifyContent="center">
              <RiQuestionnaireLine fontSize="35px" />
            </Flex> */}
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <VStack justifyContent="center">
              <Text fontSize="sm">
                Are you sure you want to add this quantity?
              </Text>
              <Text fontSize="sm">{`[ Order No. ${orderNo} ] [ Item Code ${itemCode} ] [ Quantity Ordered ${quantityOrdered} ]`}</Text>
            </VStack>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <ButtonGroup size="sm" mt={3}>
              <Button
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="blue"
                px={4}
                size="xs"
              >
                Yes
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                color="black"
                variant="outline"
                px={4}
                size="xs"
              >
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

//Cancel Prepared

export const CancelConfirmation = ({
  isOpen,
  onClose,
  id,
  fetchPreparedItems,
  fetchOrderList,
  setCancelId,
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => {
    setIsLoading(true);
    try {
      const res = request
        .put(`Ordering/CancelPreparedItems`, { id: id })
        .then((res) => {
          ToastComponent(
            "Success",
            "Successfully cancelled prepared item",
            "success",
            toast
          );
          setCancelId("");
          fetchPreparedItems();
          fetchOrderList();
          setIsLoading(false);
          onClose();
        })
        .catch((err) => {
          ToastComponent("Error", "Cancel failed", "error", toast);
          setIsLoading(false);
        });
    } catch (error) {}
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => {}} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex justifyContent="center">
              <RiQuestionnaireLine fontSize="35px" />
            </Flex>
          </ModalHeader>
          <ModalCloseButton onClick={onClose} />

          <ModalBody>
            <VStack justifyContent="center">
              <Text>Are you sure you want to cancel this prepared item?</Text>
            </VStack>
          </ModalBody>

          <ModalFooter justifyContent="center">
            <ButtonGroup size="sm" mt={3}>
              <Button
                onClick={submitHandler}
                isLoading={isLoading}
                disabled={isLoading}
                colorScheme="blue"
                px={4}
              >
                Yes
              </Button>
              <Button
                onClick={onClose}
                isLoading={isLoading}
                disabled={isLoading}
                color="black"
                variant="outline"
                px={4}
              >
                No
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
