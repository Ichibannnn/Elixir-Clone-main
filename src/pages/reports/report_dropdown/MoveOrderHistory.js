import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button } from '@chakra-ui/react'
import request from '../../../services/ApiClient'
import PageScroll from '../../../utils/PageScroll'
import moment from 'moment'

const fetchMoveOrderHistoryApi = async (dateFrom, dateTo) => {
  const res = await request.get(`Reports/MoveOrderHistory?dateFrom=${dateFrom}&dateTo=${dateTo}`)
  return res.data
}

export const MoveOrderHistory = ({ dateFrom, dateTo, sample, setSheetData }) => {
  const [moData, setMoData] = useState([])
  const [buttonChanger, setButtonChanger] = useState(true)

  const fetchMoveOrderHistory = () => {
    fetchMoveOrderHistoryApi(dateFrom, dateTo, sample).then(res => {
      setMoData(res)
      setSheetData(
        res?.map((item, i) => {
          return {
            'Line Number': i + 1,
            'Move Order Id': item.moveOrderId,
            'Customer Code': item.customerCode,
            'Customer Name': item.customerName,
            'Item Code': item.itemCode,
            'Item Description': item.itemDescription,
            'UOM': item.uom,
            'Category': item.category,
            'Quantity': item.quantity,
            'Batch Number': item.batchNo,
            'Expiration Date': item.expirationDate ? moment(item.expirationDate).format('yyyy-MM-DD') : '',
            'Transaction Type': item.transactionType,
            'Move Order Date': item.moveOrderDate ? moment(item.moveOrderDate).format('yyyy-MM-DD') : '',
            'Move Order By': item.moveOrderBy,
            'Status': item.transactedDate ? 'Transacted' : 'For Transaction',
            'Transacted Date': item.transactedDate ? moment(item.transactedDate).format('yyyy-MM-DD') : '',
            'Transacted By': item.transactedBy ? item.transactedBy : ''
          }
        })
      )
    })
  }

  useEffect(() => {
    fetchMoveOrderHistory()

    return () => {
      setMoData([])
    }
  }, [dateFrom, dateTo, sample])



  return (
    <Flex w='full' flexDirection='column'>
      <Flex border='1px' borderColor="gray.400">
        <PageScroll minHeight='600px' maxHeight='620px'>
          <Table size='sm' variant="striped">
            <Thead bgColor='primary' h="40px" >
              <Tr>
                <Th color='white' fontSize="11px" fontWeight="semibold">Move Order ID</Th>
                <Th color='white' fontSize="11px" fontWeight="semibold">Customer Code</Th>
                <Th color='white' fontSize="11px" fontWeight="semibold">Customer Name</Th>
                {
                  buttonChanger ?
                    <>
                      <Th color='white' fontSize="11px" fontWeight="semibold">Item Code</Th>
                      <Th color='white' fontSize="11px" fontWeight="semibold">Item Description</Th>
                      <Th color='white' fontSize="11px" fontWeight="semibold">UOM</Th>
                      <Th color='white' fontSize="11px" fontWeight="semibold">Category</Th>
                      <Th color='white' fontSize="11px" fontWeight="semibold">Quantity</Th>
                      <Th color='white' fontSize="11px" fontWeight="semibold">Batch Number</Th>
                    </>
                    :
                    <>
                      {/* <Th color='white'>Expiration Date</Th> */}
                      <Th color='white' fontSize="11px" fontWeight="semibold">Transaction Type</Th>
                      <Th color='white' fontSize="11px" fontWeight="semibold">Move Order Date</Th>
                      <Th color='white' fontSize="11px" fontWeight="semibold">Move Order By</Th>
                      <Th color='white' fontSize="11px" fontWeight="semibold">Status</Th>
                      <Th color='white' fontSize="11px" fontWeight="semibold">Transacted Date</Th>
                      <Th color='white' fontSize="11px" fontWeight="semibold">Transacted By</Th>
                    </>
                }
              </Tr>
            </Thead>
            <Tbody>
              {
                moData?.map((item, i) =>
                  <Tr key={i}>
                    <Td fontSize="12px">{item.moveOrderId}</Td>
                    <Td fontSize="12px">{item.customerCode}</Td>
                    <Td fontSize="12px">{item.customerName}</Td>
                    {
                      buttonChanger
                        ?
                        <>
                          <Td fontSize="12px">{item.itemCode}</Td>
                          <Td fontSize="12px">{item.itemDescription}</Td>
                          <Td fontSize="12px">{item.uom}</Td>
                          <Td fontSize="12px">{item.category}</Td>
                          <Td fontSize="12px">{item.quantity}</Td>
                          <Td fontSize="12px">{item.batchNo}</Td>
                        </>
                        :
                        <>
                          {/* <Td>{item.expirationDate ? moment(item.expirationDate).format('yyyy-MM-DD') : ''}</Td> */}
                          <Td fontSize="12px">{item.transactionType}</Td>
                          <Td fontSize="12px">{item.moveOrderDate ? moment(item.moveOrderDate).format('yyyy-MM-DD'): ''}</Td>
                          <Td fontSize="12px">{item.moveOrderBy}</Td>
                          <Td fontSize="12px">{item.transactedDate ? 'Transacted' : 'For Transaction'}</Td>
                          <Td fontSize="12px">{item.transactedDate ? moment(item.transactedDate).format('yyyy-MM-DD') : ''}</Td>
                          <Td fontSize="12px">{item.transactedBy ? item.transactedBy : ''}</Td>
                        </>
                    }
                  </Tr>
                )
              }
            </Tbody>
          </Table>
        </PageScroll>
      </Flex>

      <Flex justifyContent='end' mt={2}>
        <Button size='xs' colorScheme='teal' onClick={() => setButtonChanger(!buttonChanger)}>
          {buttonChanger ? `>>>>` : `<<<<`}
        </Button>
      </Flex>
    </Flex>
  )
}
