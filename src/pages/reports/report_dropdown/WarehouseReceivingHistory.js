import React, { useEffect, useState } from "react";
import {
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";

const fetchWarehouseReceivingHistoryApi = async (dateFrom, dateTo) => {
  const res = await request.get(
    `Reports/WareHouseReceivingReports?dateFrom=${dateFrom}&dateTo=${dateTo}`
  );
  return res.data;
};

export const WarehouseReceivingHistory = ({
  dateFrom,
  dateTo,
  sample,
  setSheetData,
}) => {
  const [warehouseData, setWarehouseData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const fetchWarehouseReceivingHistory = () => {
    fetchWarehouseReceivingHistoryApi(dateFrom, dateTo, sample).then((res) => {
      setWarehouseData(res);
      setSheetData(
        res?.map((item, i) => {
          return {
            "Line Number": i + 1,
            ID: item.warehouseId,
            "Received Date": item.receiveDate,
            "PO Number": item.poNumber,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescrption,
            UOM: item.uom,
            // Category: item.category ? item.category : "Miscellaneous",
            Quantity: item.quantity,
            // 'Manufacturing Date': item.manufacturingDate,
            // 'Expiration Date': item.expirationDate,
            "Total Reject": item.totalReject,
            Supplier: item.supplierName,
            "Transaction Type": item.transactionType,
            "Received By": item.receivedBy,
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchWarehouseReceivingHistory();

    return () => {
      setWarehouseData([]);
    };
  }, [dateFrom, dateTo, sample]);

  return (
    <Flex w="full" flexDirection="column">
      <Flex border="1px" borderColor="gray.400">
        <PageScroll minHeight="600px" maxHeight="620px">
          <Table size="sm" variant="striped">
            <Thead bgColor="primary" h="40px">
              <Tr>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  ID
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Received Date
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  PO Number
                </Th>
                {buttonChanger ? (
                  <>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Code
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Item Description
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      UOM
                    </Th>
                    {/* <Th color="white" fontSize="10px" fontWeight="semibold">
                      Category
                    </Th> */}
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Quantity
                    </Th>
                    {/* <Th color='white'>Manufacturing Date</Th> */}
                  </>
                ) : (
                  <>
                    {/* <Th color='white'>Expiration Date</Th> */}
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Total Reject
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Supplier
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transaction Type
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Received By
                    </Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {warehouseData?.inventory?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{item.warehouseId}</Td>
                  <Td fontSize="xs">{item.receiveDate}</Td>
                  <Td fontSize="xs">{item.poNumber ? item.poNumber : ""}</Td>
                  {buttonChanger ? (
                    <>
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescrption}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                      {/* <Td fontSize="xs">
                        {item.category ? item.category : "Miscellaneous"}
                      </Td> */}
                      <Td fontSize="xs">{item.quantity}</Td>
                      {/* <Td>{item.manufacturingDate}</Td> */}
                    </>
                  ) : (
                    <>
                      {/* <Td>{item.expirationDate}</Td> */}
                      <Td fontSize="xs">{item.totalReject}</Td>
                      <Td fontSize="xs">{item.supplierName}</Td>
                      <Td fontSize="xs">{item.transactionType}</Td>
                      <Td fontSize="xs">{item.receivedBy}</Td>
                    </>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex justifyContent="end" mt={2}>
        <Button
          size="xs"
          colorScheme="blue"
          onClick={() => setButtonChanger(!buttonChanger)}
        >
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  );
};
