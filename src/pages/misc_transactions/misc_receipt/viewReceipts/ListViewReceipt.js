import React, { useEffect, useState } from 'react'
import { Button, Flex, HStack, Input, InputGroup, InputLeftElement, Select, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'
import {
    Pagination,
    PaginationNext,
    PaginationPage,
    PaginationPrevious,
    PaginationContainer,
    PaginationPageGroup,
} from '@ajna/pagination'
import PageScroll from '../../../../utils/PageScroll'
import { ViewModal } from './ActionModalViewing'


export const ListViewReceipt = ({ receiptData, setCurrentPage, setPageSize, setStatus, setSearch, pagesCount, currentPage, pages, fetchReceipts }) => {
  const [statusBody, setStatusBody] = useState({
    id: '',
    status: ''
  })

  const { isOpen: isView, onClose: closeView, onOpen: openView } = useDisclosure()

  const handlePageChange = (nextPage) => {
      setCurrentPage(nextPage)
  }

  const handlePageSizeChange = (e) => {
      const pageSize = Number(e.target.value)
      setPageSize(pageSize)
  }


  const searchHandler = (inputValue) => {
      setSearch(inputValue)
  }


  const viewHandler = (id, status) => {
    console.log(id, status)
      if (id) {
          setStatusBody({
              id: id,
              status: status
          })
          openView()
      } else {
          setStatusBody({
              id: '',
              status: ''
          })
      }
  }

  return (
    <Flex justifyContent='center' flexDirection='column' w='full'>
      <Flex justifyContent='space-between'>
          <InputGroup w='15%'>
              <InputLeftElement
                  pointerEvents='none'
                  children={<FaSearch color='gray.300' />}
              />
              <Input
                  fontSize="xs"
                  onChange={(e) => searchHandler(e.target.value)}
                  type='text' placeholder='Search: ID'
                  focusBorderColor='accent'
              />
          </InputGroup>
      </Flex>

      <Flex mt={5}>
          <PageScroll minHeight='500px' maxHeight='501px'>
              <Table size='sm'>
                  <Thead bgColor='secondary'>
                      <Tr>
                          <Th color='white' fontSize="11px">ID</Th>
                          <Th color='white' fontSize="11px">Supplier Code</Th>
                          <Th color='white' fontSize="11px">Supplier Name</Th>
                          <Th color='white' fontSize="11px">Total Quantity</Th>
                          <Th color='white' fontSize="11px">Transaction Date</Th>
                          <Th color='white' fontSize="11px">Transacted By</Th>
                          <Th color='white' fontSize="11px">View</Th>
                          {/* <Th color='white'>Change status</Th> */}
                      </Tr>
                  </Thead>
                  <Tbody>
                      {
                          receiptData?.receipt?.map((receipts, i) =>
                              <Tr key={i}>
                                  <Td fontSize="10px">{receipts.id}</Td>
                                  <Td fontSize="10px">{receipts.supplierCode}</Td>
                                  <Td fontSize="10px">{receipts.supplierName}</Td>
                                  <Td fontSize="10px">{receipts.totalQuantity}</Td>
                                  <Td fontSize="10px">{receipts.preparedDate}</Td>
                                  <Td fontSize="10px">{receipts.preparedBy}</Td>
                                  <Td fontSize="10px">
                                      <Button
                                          onClick={() => viewHandler(receipts.id, receipts.isActive)}
                                          colorScheme='blue' size='xs'
                                          borderRadius="none"
                                      >
                                          View
                                      </Button>
                                  </Td>
                              </Tr>
                          )
                      }
                  </Tbody>
              </Table>
          </PageScroll>
      </Flex>

      <Flex mt={5} justifyContent='end'>
          <Stack>
              <Pagination
                  pagesCount={pagesCount}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
              >
                  <PaginationContainer>
                      <PaginationPrevious bg="secondary" color='white' p={1} _hover={{ bg: 'accent', color: 'white' }}>{"<<"}</PaginationPrevious>
                      <PaginationPageGroup ml={1} mr={1}>
                          {pages.map((page) => (
                              <PaginationPage
                                  _hover={{ bg: 'accent', color: 'white' }}
                                  p={3}
                                  bg="secondary"
                                  color='white'
                                  key={`pagination_page_${page}`}
                                  page={page}
                              />
                          ))}
                      </PaginationPageGroup>
                      <HStack>
                          <PaginationNext bg="secondary" color='white' p={1} _hover={{ bg: 'accent', color: 'white' }}>{">>"}</PaginationNext>
                          <Select onChange={handlePageSizeChange} variant='filled'>
                              <option value={Number(5)}>5</option>
                              <option value={Number(10)}>10</option>
                              <option value={Number(25)}>25</option>
                              <option value={Number(50)}>50</option>
                          </Select>
                      </HStack>
                  </PaginationContainer>
              </Pagination>
          </Stack>
      </Flex>

      {
          isView && (
              <ViewModal
                  isOpen={isView}
                  onClose={closeView}
                  statusBody={statusBody}
              />
          )
      }

  </Flex>
  )
}
