import React, { useEffect, useState } from 'react'
import { Flex, Table, Tbody, Td, Th, Thead, Tr, useDisclosure, Button } from '@chakra-ui/react'
import request from '../../../services/ApiClient'
import PageScroll from '../../../utils/PageScroll'
import moment from 'moment'

const fetchMiscellaneousIssueHistoryApi = async (dateFrom, dateTo) => {
  const dayaDate = new Date()
  const dateToDaya = dayaDate.setDate(dayaDate.getDate() + 1)
  const res = await request.get(`Reports/MiscellaneousIssueReport?dateFrom=${dateFrom}&dateTo=${moment(dateToDaya).format('yyyy-MM-DD')}`)
  return res.data
}


export const MiscIssueHistory = ({ dateFrom, dateTo, sample, setSheetData }) => {
  const [miscIssueData, setMiscIssueData] = useState([])
  const [buttonChanger, setButtonChanger] = useState(true)

  const fetchMiscellaneousIssueHistory = () => {
    fetchMiscellaneousIssueHistoryApi(dateFrom, dateTo, sample).then(res => {
      setMiscIssueData(res)
      setSheetData(
        res?.map((item, i) => {
            return {
                'Line Number': i + 1,
                'Issue ID': item.orderId,
                'Customer Code': item.customerCode,
                'Customer Name': item.customerName,
                'Details': item.details,
                'Item Code': item.itemCode,
                'Item Description': item.itemDescription,
                'UOM': item.uom,
                'Quantity': item.quantity,
                // 'Expiration Date': item.expirationDate,
                'Transacted By': item.transactBy,
                'Transaction Date': moment(item.transactDate).format('yyyy-MM-DD')
            }
        })
    )
    })
  }

  useEffect(() => {
    fetchMiscellaneousIssueHistory()

    return () => {
      setMiscIssueData([])
    }
  }, [dateFrom, dateTo, sample])

  return (
    <Flex w='full' flexDirection='column'>
      <Flex border='1px' borderColor="gray.400">
        <PageScroll minHeight='600px' maxHeight='620px'>
          <Table size='sm' variant="striped">
            <Thead bgColor='primary' h="40px"  >
              <Tr>
                <Th color='white' fontSize="11px" fontWeight="semibold">Issue ID</Th>
                <Th color='white' fontSize="11px" fontWeight="semibold">Customer Code</Th>
                <Th color='white' fontSize="11px" fontWeight="semibold">Customer Name</Th>
                {
                  buttonChanger ?
                    <>
                      <Th color='white' fontSize="11px" fontWeight="semibold">Details</Th>
                      <Th color='white' fontSize="11px" fontWeight="semibold">Item Code</Th>
                      <Th color='white' fontSize="11px" fontWeight="semibold">Item Description</Th>
                      <Th color='white' fontSize="11px" fontWeight="semibold">UOM</Th>
                      {/* <Th color='white'>category</Th>  */}
                      <Th color='white' fontSize="11px" fontWeight="semibold">Quantity</Th>
                    </>
                    :
                    <>
                      {/* <Th color='white'>Expiration Date</Th> */}
                      <Th color='white' fontSize="11px" fontWeight="semibold">Transact By</Th>
                      <Th color='white' fontSize="11px" fontWeight="semibold">Transaction Date</Th>
                    </>
                }
              </Tr>
            </Thead>
            <Tbody>
              {
                miscIssueData?.map((item, i) =>
                  <Tr key={i}>
                    <Td fontSize="12px">{item.issueId}</Td>
                    <Td fontSize="12px">{item.customerCode}</Td>
                    <Td fontSize="12px">{item.customerName}</Td>
                    {
                      buttonChanger
                        ?
                        <>
                          <Td fontSize="12px">{item.details}</Td>
                          <Td fontSize="12px">{item.itemCode}</Td>
                          <Td fontSize="12px">{item.itemDescription}</Td>
                          <Td fontSize="12px">{item.uom}</Td>
                          {/* <Td>Body</Td> */}
                          <Td fontSize="12px">{item.quantity}</Td>
                        </>
                        :
                        <>
                          {/* <Td>{item.expirationDate}</Td> */}
                          <Td fontSize="12px">{item.transactBy}</Td>
                          <Td fontSize="12px">{moment(item.transactDate).format('yyyy-MM-DD')}</Td>
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
