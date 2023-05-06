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
import moment from "moment";

const fetchMoveOrderHistoryApi = async (dateFrom, dateTo) => {
  const res = await request.get(
    `Reports/MoveOrderHistory?dateFrom=${dateFrom}&dateTo=${dateTo}`
  );
  return res.data;
};

export const MoveOrderHistory = ({
  dateFrom,
  dateTo,
  sample,
  setSheetData,
}) => {
  const [moData, setMoData] = useState([]);
  const [buttonChanger, setButtonChanger] = useState(true);

  const fetchMoveOrderHistory = () => {
    fetchMoveOrderHistoryApi(dateFrom, dateTo, sample).then((res) => {
      setMoData(res);
      setSheetData(
        res?.map((item, i) => {
          return {
            "Line Number": i + 1,
            "Move Order Id": item.moveOrderId,
            "Customer Code": item.customerCode,
            "Customer Name": item.customerName,
            "Item Code": item.itemCode,
            "Item Description": item.itemDescription,
            UOM: item.uom,
            Category: item.category,
            Quantity: item.quantity,
            "Batch Number": item.batchNo,
            "Expiration Date": item.expirationDate
              ? moment(item.expirationDate).format("yyyy-MM-DD")
              : "",
            "Transaction Type": item.transactionType,
            "Move Order Date": item.moveOrderDate
              ? moment(item.moveOrderDate).format("yyyy-MM-DD")
              : "",
            "Move Order By": item.moveOrderBy,
            Status: item.transactedDate ? "Transacted" : "For Transaction",
            "Transacted Date": item.transactedDate
              ? moment(item.transactedDate).format("yyyy-MM-DD")
              : "",
            "Transacted By": item.transactedBy ? item.transactedBy : "",
          };
        })
      );
    });
  };

  useEffect(() => {
    fetchMoveOrderHistory();

    return () => {
      setMoData([]);
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
                  Move Order ID
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Customer Code
                </Th>
                <Th color="white" fontSize="10px" fontWeight="semibold">
                  Customer Name
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
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Category
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Quantity
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Batch Number
                    </Th>
                  </>
                ) : (
                  <>
                    {/* <Th color='white'>Expiration Date</Th> */}
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transaction Type
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Move Order Date
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Move Order By
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Status
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transacted Date
                    </Th>
                    <Th color="white" fontSize="10px" fontWeight="semibold">
                      Transacted By
                    </Th>
                  </>
                )}
              </Tr>
            </Thead>
            <Tbody>
              {moData?.inventory?.map((item, i) => (
                <Tr key={i}>
                  <Td fontSize="xs">{item.moveOrderId}</Td>
                  <Td fontSize="xs">{item.customerCode}</Td>
                  <Td fontSize="xs">{item.customerName}</Td>
                  {buttonChanger ? (
                    <>
                      <Td fontSize="xs">{item.itemCode}</Td>
                      <Td fontSize="xs">{item.itemDescription}</Td>
                      <Td fontSize="xs">{item.uom}</Td>
                      <Td fontSize="xs">{item.category}</Td>
                      <Td fontSize="xs">{item.quantity}</Td>
                      <Td fontSize="xs">{item.batchNo}</Td>
                    </>
                  ) : (
                    <>
                      {/* <Td>{item.expirationDate ? moment(item.expirationDate).format('yyyy-MM-DD') : ''}</Td> */}
                      <Td fontSize="xs">{item.transactionType}</Td>
                      <Td fontSize="xs">
                        {item.moveOrderDate
                          ? moment(item.moveOrderDate).format("yyyy-MM-DD")
                          : ""}
                      </Td>
                      <Td fontSize="xs">{item.moveOrderBy}</Td>
                      <Td fontSize="xs">
                        {item.transactedDate ? "Transacted" : "For Transaction"}
                      </Td>
                      <Td fontSize="xs">
                        {item.transactedDate
                          ? moment(item.transactedDate).format("yyyy-MM-DD")
                          : ""}
                      </Td>
                      <Td fontSize="xs">
                        {item.transactedBy ? item.transactedBy : ""}
                      </Td>
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
