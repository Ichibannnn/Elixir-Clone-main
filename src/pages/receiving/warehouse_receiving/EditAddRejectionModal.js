import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  FormLabel,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ReceivingContext } from "../../../components/context/ReceivingContext";
import request from "../../../services/ApiClient";
import { ToastComponent } from "../../../components/Toast";
import { AiFillMinusCircle } from "react-icons/ai";

const EditAddRejectionModal = ({ receivingId, sumQuantity, actualGood}) => {
  const { setSubmitDataTwo, setSumQuantity } = useContext(ReceivingContext);

  const [reasons, setReasons] = useState([]);
  const [quantity, setQuantity] = useState(undefined);
  const [remarks, setRemarks] = useState("");
  const [remarksName, setRemarksName] = useState("");
  const [errors, setErrors] = useState({});
  const [finalData, setFinalData] = useState([]);

  const remarksDisplay = useRef(null);
  const toast = useToast();

  // FETCH REASON API
  const fetchReasonsApi = async () => {
    const res = await request.get("Reason/GetAllActiveReasons");
    return res.data;
  };

  const getReasonHandler = async () => {
    fetchReasonsApi().then((res) => {
      setReasons(res);
    });
  };

  useEffect(() => {
    getReasonHandler();
  }, [setReasons]);

  // USE EFFECT (QUANTITY)
  useEffect(() => {
    if (finalData.length) {
      let totalQuantity = finalData.map((q) => parseFloat(q.quantity));
      let sum = totalQuantity.reduce((a, b) => a + b);
      setSumQuantity(sum);
    } else {
      setSumQuantity(0);
    }
  }, [finalData, sumQuantity]);

  useEffect(() => {
    setSubmitDataTwo(finalData);
  }, [finalData]);

  // QTY HANDLER FOR QUANTITY INPUT
    const quantityHandler = (data) => {
        if (data) {
            if (data >= actualGood) {
                ToastComponent("Warning", "You are providing a value greater than or equal to your Actual Good!", "warning", toast)
                setQuantity("")
            } else {
                setQuantity(data)
            }
        } else {
            setQuantity("")
        }
    }

  // REASON HANDLER
  const remarksHandler = (data) => {
    if (data) {
      const newData = JSON.parse(data);
      setRemarks(newData.id);
      setRemarksName(newData.reasonName);
    } else {
      setRemarks("");
    }
  };

  // HANDLER FOR REJECTION BUTTON
  const addNewRowHandler = () => {
    if (finalData.some((data) => data.remarks === remarks)) {
      ToastComponent(
        "Error!",
        "Remarks description already added",
        "error",
        toast
      );
      return;
    }

    if (!quantity) {
      setErrors({
        qty: true,
      });
      return;
    }
    if (!remarks) {
      setErrors({
        rms: true,
      });
      return;
    } else {
      setErrors({
        qty: false,
        rms: false,
      });
    }

    const data = {
      pO_ReceivingId: receivingId,
      quantity: quantity,
      remarks: remarks,
      remarksName: remarksName,
    };
    setFinalData([...finalData, data]);

    remarksDisplay.current.selectedIndex = 0;
    setQuantity("");
  };

  // REMOVE THE DATA FROM THE TABLE ADD REJECT
  const deleteRejectionHandler = (data) => {
    setFinalData(finalData.filter((row) => row.remarksName !== data));
  };

  return (
    <Box>
      <Accordion allowToggle defaultIndex={[1]}>
        <AccordionItem>
          <Flex
            bg="primary"
            color="white"
            justifyContent="space-between"
            alignItems="center"
          >
            <AccordionButton p={1}>
              <Text fontSize="13px" fontWeight="semibold">
                {" "}
                REJECTION INFORMATION <AccordionIcon />{" "}
              </Text>
            </AccordionButton>
            <Button
              colorScheme="whiteAlpha"
              size="xs"
              mr={1}
              borderRadius="none"
              onClick={addNewRowHandler}
            >
              Add Rejection
            </Button>
          </Flex>

          <AccordionPanel>
            <Flex justifyContent="space-between">
              <FormLabel w="40%" fontSize="12px" p={0}>
                Quantity
                <Input
                  value={quantity}
                  onChange={(e) => quantityHandler(parseInt(e.target.value))}
                  onWheel={(e) => e.target.blur()}
                  isInvalid={errors.qty}
                  fontSize="11px"
                  size="sm"
                  bg="white"
                  placeholder="Quantity"
                  type="number"
                />
              </FormLabel>
              <FormLabel w="40%" fontSize="12px">
                Remarks
                {reasons.length > 0 ? (
                  <Select
                    ref={remarksDisplay}
                    onChange={(e) => remarksHandler(e.target.value)}
                    isInvalid={errors.rms}
                    placeholder="Select Reason"
                    fontSize="11px"
                    size="sm"
                    border="1px"
                    borderColor="gray.400"
                  >
                    {reasons?.map((reason) => (
                      <option key={reason.id} value={JSON.stringify(reason)}>
                        {reason.reasonName}
                      </option>
                    ))}
                  </Select>
                ) : (
                  "Loading"
                )}
              </FormLabel>
            </Flex>

            <Badge colorScheme="blue"> Total Quantity: {sumQuantity} </Badge>
            {!finalData.length > 0 ? (
              ""
            ) : (
              <Table variant="striped" size="sm" mt={2}>
                <Thead>
                  <Tr bgColor="primary">
                    <Th color="white" fontSize="10px">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="10px">
                      Remarks
                    </Th>
                    <Th color="white"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {finalData?.map((data, i) => (
                    <Tr key={i}>
                      <Td fontSize="10px">{data.quantity}</Td>
                      <Td fontSize="10px">{data.remarksName}</Td>
                      {/* <Td>{data.rawMaterialDescription}</Td> */}
                      <Td>
                        <Button
                          p={0}
                          background="none"
                          color="secondary"
                          onClick={() =>
                            deleteRejectionHandler(data.remarksName)
                          }
                        >
                          <AiFillMinusCircle fontSize="15px" />
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default EditAddRejectionModal;
