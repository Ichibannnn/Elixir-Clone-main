import {
  Box,
  Button,
  Flex,
  HStack,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BiImport } from "react-icons/bi";
import { MdOutlineError } from "react-icons/md";
import * as XLSX from "xlsx";
import { ToastComponent } from "../../components/Toast";
import DateConverter from "../../components/DateConverter";
import request from "../../services/ApiClient";
import { decodeUser } from "../../services/decode-user";
import moment from "moment/moment";
import PageScrollImport from "../../components/PageScrollImport";
import ErrorList from "./ErrorList";
import Swal from "sweetalert2";

const currentUser = decodeUser();

const ImportPO = () => {
  const [excelData, setExcelData] = useState([]);
  const [workbook, setWorkbook] = useState([]);
  const [sheetOption, setSheetOption] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [errorOpener, setErrorOpener] = useState(false);
  const [errorData, setErrorData] = useState([]);
  const toast = useToast();

  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
  } = useDisclosure();
  const clearExcelFile = useRef();
  // const cancelRef = useRef()

  // EXCEL DATA TRIM TO LOWERCASE
  const fileRender = (jsonData) => {
    setExcelData([]);

    jsonData.forEach((row) => {
      Object.keys(row).forEach((key) => {
        let newKey = key.trim().toLowerCase().replace(/ /g, "_");
        if (key !== newKey) {
          row[newKey] = row[key];
          delete row[key];
        }
      });
    });
    setExcelData(jsonData);
  };

  // EXCEL DATA
  const fileHandler = async (e) => {
    setWorkbook([]);

    const file = e[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.readFile(data);

    setWorkbook(workbook);
    setSheetOption(workbook.SheetNames);

    const initialWorkSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(initialWorkSheet);

    const isColumnComplete = jsonData.every((item) => {
     return Object.keys(item).length === 12
    })
    

    // console.log(isColumnComplete)

    fileRender(jsonData);
    if (isColumnComplete) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
      ToastComponent("Error!", "Please check empty fields", "error", toast);
    }

    // console.log(jsonData)
  };

  const resultArray = excelData.map((item) => {
    let newPrData = DateConverter(item.pr_date);
    let newPoDate = DateConverter(item.po_date);

    return {
      pR_Number: item.pr_number,
      pR_Date: moment(newPrData).format("YYYY-MM-DD"),
      pO_Number: item.po_number,
      pO_Date: moment(newPoDate).format("YYYY-MM-DD"),
      itemCode: item.item_code,
      itemDescription: item.item_description,
      ordered: item.qty_ordered,
      delivered: item.qty_delivered,
      billed: item.qty_billed,
      uom: item.uom,
      unitPrice: item.unit_price,
      vendorName: item.supplier_name,
      addedBy: currentUser.username,
    };
  });

  console.log(resultArray);

  const submitExcelHandler = (resultArray) => {
    Swal.fire({
      title: "Confirmation!",
      text: "Are you sure you want to import this purchase order list?",
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
        if (resultArray.length > 0) {
          try {
            setIsLoading(true);
            const res = request
              .post("Import/AddNewPOSummary", resultArray)
              .then((res) => {
                ToastComponent("Success!", "PO Imported", "success", toast);
                setIsLoading(false);
                setIsDisabled(true);
                clearExcelFile.current.value = "";
                setExcelData([]);
              })
              .catch((err) => {
                setIsLoading(false);
                // ToastComponent("Error", "Import Failed, Please check your fields.", "error", toast)
                setErrorData(err.response.data);
                if (err.response.data) {
                  setErrorOpener(true);
                  onErrorOpen();
                }
              });
          } catch (err) {
            ToastComponent(
              "Error!",
              "Wrong excel format imported for PO",
              "error",
              toast
            );
          }
        } else {
          ToastComponent(
            "Error!",
            "No data provided, please check your import",
            "error",
            toast
          );
        }
      }
    });
  };

  const stringValidation = (data) => {
    if (data === isNaN ) {
      setIsDisabled(true)
      ToastComponent("Please check empty fields", "success", toast)
    }
  }

  const openErrorModal = () => {
    onErrorOpen();
  };

  // const handleFile = async (e) => {
  //   const file = e.target.files[0];
  //   const data = await file.arrayBuffer();
  //   const workbook = XLSX.readFile(data, { sheetRows: 5 });

  //   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //   const jsonData = XLSX.utils.sheet_to_json(worksheet, {
  //     header: 1,
  //     defval: ""
  //   })

  //   console.log(jsonData);
  // }

  const actualDeliveredProvider = (data) => {

    if (data = isNaN) {
      setIsDisabled(true);
      ToastComponent(
        "Warning!",
        "Amount is greater than allowable",
        "warning",
        toast
      );
    } else {
      setIsDisabled(false);
    }
  };

  return (
    <Flex bg="form" w="full" boxShadow="md" flexDirection="column">
      <Flex justifyContent="space-between">
        <Box />
        <Box p={2}>
          {errorOpener === true ? (
            <Button
              onClick={() => openErrorModal()}
              type="submit"
              isLoading={isLoading}
              isDisabled={isDisabled}
              // h="25px"
              w="170px"
              // _hover={{ color: 'white', bgColor: 'accent' }}
              leftIcon={<MdOutlineError fontSize="19px" />}
              borderRadius="none"
              colorScheme="red"
              fontSize="12px"
              size="xs"
            >
              Error List
            </Button>
          ) : (
            <Button
              type="submit"
              leftIcon={<BiImport fontSize="19px" />}
              colorScheme="blue"
              borderRadius="none"
              fontSize="12px"
              size="xs"
              isDisabled={isDisabled}
              onClick={() => submitExcelHandler(resultArray)}
            >
              Import Purchase Order
            </Button>
          )}
        </Box>
      </Flex>

      <Flex
        w="100%"
        h="full"
        p={2}
        mt={-4}
        flexDirection="column"
        justifyContent="space-between"
      >
        <Flex w="full" h="full">
          <PageScrollImport maxHeight="470px">
            <Table variant="striped" size="sm">
              <Thead bg="primary" position="sticky" zIndex="0" top={0}>
                <Tr>
                  <Th color="white" fontSize="9px">
                    PR Number
                  </Th>
                  <Th color="white" fontSize="9px">
                    PR Date
                  </Th>
                  <Th color="white" fontSize="9px">
                    PO Number
                  </Th>
                  <Th color="white" fontSize="9px">
                    PO Date
                  </Th>
                  <Th color="white" fontSize="9px">
                    Item Code
                  </Th>
                  <Th color="white" fontSize="9px">
                    Item Description
                  </Th>
                  <Th color="white" fontSize="9px">
                    Qty Ordered
                  </Th>
                  <Th color="white" fontSize="9px">
                    Qty Delivered
                  </Th>
                  <Th color="white" fontSize="9px">
                    Qty Billed
                  </Th>
                  <Th color="white" fontSize="9px">
                    UOM
                  </Th>
                  <Th color="white" fontSize="9px">
                    Unit Price
                  </Th>
                  <Th color="white" fontSize="9px">
                    Supplier Name
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {resultArray?.map((eData, i) => (
                  <Tr key={i}>
                    <Td fontSize="11px">
                      {eData.pR_Number ? (
                        eData.pR_Number
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          PO is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="11px">
                      {eData.pR_Date ? (
                        eData.pR_Date
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          PO Date is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="11px" onChange={(e) =>
                          actualDeliveredProvider(e.target.value)
                        }
                    >
                      {eData.pO_Number ? (
                        eData.pO_Number
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          PO is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="11px">
                      {eData.pO_Date ? (
                        eData.pO_Date
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          PO is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="11px">
                      {eData.itemCode ? (
                        eData.itemCode
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          PO is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="11px">
                      {eData.itemDescription ? (
                        eData.itemDescription
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          PO is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="11px" 
                    // onChange={(e) => {
                    //   stringValidation(e.target.value)
                    // }}
                    >
                    {
                      !isNaN(eData.ordered) ? eData.ordered : `${eData.ordered} is not a number`
                    }
                      {/* {eData.ordered ? (
                        eData.ordered
                      ) : (
                        <Text fontWeight="semibold" color="red">
                          Data missing. Please make sure correct excel file for
                          PO is uploaded.
                        </Text>
                      )} */}
                    </Td>
                    <Td fontSize="11px">
                      {eData.delivered ? (
                        eData.delivered
                      ) : (
                        <Text fontWeight="semibold" color="red">
                          Empty field
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="11px">
                      {eData.billed < 0 ? (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          PO is uploaded.
                        </Text>
                      ) : (
                        eData.billed
                      )}
                    </Td>
                    <Td fontSize="11px">
                      {eData.uom ? (
                        eData.uom
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          PO is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="11px">
                      {eData.unitPrice ? (
                        eData.unitPrice
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          PO is uploaded.
                        </Text>
                      )}
                    </Td>
                    <Td fontSize="11px">
                      {eData.vendorName ? (
                        eData.vendorName
                      ) : (
                        <Text fontWeight="semibold" color="danger">
                          Data missing. Please make sure correct excel file for
                          PO is uploaded.
                        </Text>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </PageScrollImport>
        </Flex>
        <Flex p={2} bg="primary" w="100%">
          <Input
            ref={clearExcelFile}
            color="white"
            type="file"
            w="25%"
            size="25px"
            fontSize="13px"
            onChange={(e) => fileHandler(e.target.files)}
          />
        </Flex>
      </Flex>

      {isErrorOpen && (
        <ErrorList
          isOpen={isErrorOpen}
          onClose={onErrorClose}
          onOpen={onErrorOpen}
          errorData={errorData}
        />
      )}
    </Flex>
  );
};

export default ImportPO;
