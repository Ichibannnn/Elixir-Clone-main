import React from 'react'
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text, Table, Tbody, Td, Th, Thead, Tr, Badge, VStack, HStack,
} from '@chakra-ui/react'
import moment from 'moment'
import PageScrollModalErrorList from '../../components/PageScrollModalErrorList'
import PageScrollImportModal from '../../components/PageScrollImportModal'
import { RiFileList3Fill } from 'react-icons/ri'
import { TiWarning } from 'react-icons/ti'

const ErrorList = ({ isOpen, onClose, errorData }) => {

    const availableImportData = errorData?.availableImport?.map(list => {
        return {
            pR_Number: list.pR_Number,
            pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
            pO_Number: list.pO_Number,
            pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
            item_Code: list.itemCode,
            item_Description: list.itemDescription,
            ordered: list.ordered,
            delivered: list.delivered,
            billed: list.billed,
            uom: list.uom,
            unit_Price: list.unitPrice,
            vendor_Name: list.vendorName
        }
    })

    const duplicateListData = errorData?.duplicateList?.map(list => {
        return {
            pR_Number: list.pR_Number,
            pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
            pO_Number: list.pO_Number,
            pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
            item_Code: list.itemCode,
            item_Description: list.itemDescription,
            ordered: list.ordered,
            delivered: list.delivered,
            billed: list.billed,
            uom: list.uom,
            unit_Price: list.unitPrice,
            vendor_Name: list.vendorName
        }
    })

    const itemcodeNotExistData = errorData?.itemcodeNotExist?.map(list => {
        return {
            pR_Number: list.pR_Number,
            pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
            pO_Number: list.pO_Number,
            pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
            item_Code: list.itemCode,
            item_Description: list.itemDescription,
            ordered: list.ordered,
            delivered: list.delivered,
            billed: list.billed,
            uom: list.uom,
            unit_Price: list.unitPrice,
            vendor_Name: list.vendorName
        }
    })

    const supplierNotExistData = errorData?.supplierNotExist?.map(list => {
        return {
            pR_Number: list.pR_Number,
            pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
            pO_Number: list.pO_Number,
            pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
            item_Code: list.itemCode,
            item_Description: list.itemDescription,
            ordered: list.ordered,
            delivered: list.delivered,
            billed: list.billed,
            uom: list.uom,
            unit_Price: list.unitPrice,
            vendor_Name: list.vendorName
        }
    })

    const uomCodeNotExistData = errorData?.uomCodeNotExist?.map(list => {
        return {
            pR_Number: list.pR_Number,
            pR_Date: moment(list.pR_Date).format("YYYY-MM-DD"),
            pO_Number: list.pO_Number,
            pO_Date: moment(list.pO_Date).format("YYYY-MM-DD"),
            item_Code: list.itemCode,
            item_Description: list.itemDescription,
            ordered: list.ordered,
            delivered: list.delivered,
            billed: list.billed,
            uom: list.uom,
            unit_Price: list.unitPrice,
            vendor_Name: list.vendorName
        }
    })

    const available = availableImportData
    const duplicate = duplicateListData
    const itemCodes = itemcodeNotExistData
    const supplier = supplierNotExistData
    const uom = uomCodeNotExistData

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='6xl'>
            <ModalOverlay />
            <ModalContent color="white" bg="linear-gradient(rgba(0, 0, 0, 0.800),rgba(0, 0, 0, 0.5))">
                <ModalHeader>
                    <Flex justifyContent='left'>

                        <Text fontSize="11px">
                            Error: File was not imported due to the following reasons:
                        </Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <PageScrollImportModal>

                    <ModalBody>
                        <Accordion allowToggle>

                            {/* Duplicated */}
                            {duplicate?.length > 0 ?
                                <AccordionItem bgColor='gray.200'>
                                    <Flex>
                                        <AccordionButton color='white' fontWeight='semibold'>
                                            <Box flex='1' textAlign='left' color='#dc2f02' fontWeight='semibold' fontSize="13px">
                                                <Badge fontSize="10px" color='red'>{duplicate?.length}</Badge> Duplicated Lists
                                            </Box>
                                            <AccordionIcon color='secondary' />
                                        </AccordionButton>
                                    </Flex>

                                    <AccordionPanel pb={4}>
                                        <PageScrollModalErrorList>

                                            {
                                                duplicate?.length > 0 ? (

                                                    <Table variant='striped' size="sm" bg="white">
                                                        <Thead bgColor='gray.600'>
                                                            <Tr>
                                                                {/* <Th color='white'>ID</Th> */}
                                                                <Th color='white' fontSize="9px">PR Number</Th>
                                                                <Th color='white' fontSize="9px">PR Date</Th>
                                                                <Th color='white' fontSize="9px">PO Number</Th>
                                                                <Th color='white' fontSize="9px">PO Date</Th>
                                                                <Th color='white' fontSize="9px">Item Code</Th>
                                                                <Th color='white' fontSize="9px">Item Description</Th>
                                                                <Th color='white' fontSize="9px">Ordered</Th>
                                                                <Th color='white' fontSize="9px">Delivered</Th>
                                                                <Th color='white' fontSize="9px">Billed</Th>
                                                                <Th color='white' fontSize="9px">UOM</Th>
                                                                <Th color='white' fontSize="9px">Unit Price</Th>
                                                                <Th color='white' fontSize="9px">Supplier Name</Th>
                                                            </Tr>
                                                        </Thead>

                                                        <Tbody>
                                                            {duplicate?.map((d, i) =>
                                                                <Tr key={i}>
                                                                    <Td color="gray.600" fontSize="11px">
                                                                    {/* <Td>{ }</Td> */}
                                                                    {
                                                                       d?.pR_Number === 0 ? (
                                                                        <Text fontWeight="semibold" color="danger">
                                                                            Empty field
                                                                        </Text>
                                                                       ) : (
                                                                        d?.pR_Number   
                                                                       )
                                                                    }
                                                                    </Td>
                                                                    <Td color="gray.600" fontSize="11px">
                                                                    {
                                                                       d?.pR_Date === 0 ? (
                                                                        <Text fontWeight="semibold" color="danger">
                                                                            Empty field
                                                                        </Text>
                                                                       ) : (
                                                                        d?.pR_Date  
                                                                       )
                                                                    }  
                                                                    </Td>
                                                                    <Td color="gray.600" fontSize="11px">
                                                                    {
                                                                       d?.pO_Number === 0 ? (
                                                                        <Text fontWeight="semibold" color="danger">
                                                                            Empty field
                                                                        </Text>
                                                                       ) : (
                                                                        d?.pO_Number
                                                                       )
                                                                    }  
                                                                    </Td>
                                                                    <Td color="gray.600" fontSize="11px">
                                                                    {
                                                                       d?.pO_Date === 0 ? (
                                                                        <Text fontWeight="semibold" color="danger">
                                                                            Empty field
                                                                        </Text>
                                                                       ) : (
                                                                        d?.pO_Date
                                                                       )
                                                                    }  
                                                                    </Td>
                                                                    <Td color="gray.600" fontSize="11px">{d?.item_Code}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{d?.item_Description}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{d?.ordered}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{d?.delivered}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{d?.billed}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{d?.uom}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{d?.unit_Price}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{d?.vendor_Name}</Td>
                                                                </Tr>
                                                            )}
                                                        </Tbody>
                                                    </Table>

                                                )
                                                    :
                                                    <Flex justifyContent='center' mt='30px'>
                                                        <VStack>
                                                            <RiFileList3Fill fontSize='200px' />
                                                            <Text color='white'>There are no duplicated lists on this file</Text>
                                                        </VStack>
                                                    </Flex>
                                            }

                                        </PageScrollModalErrorList>
                                    </AccordionPanel>
                                </AccordionItem>
                                : ''}

                            {/* Item Code */}
                            {itemCodes?.length > 0 ?
                                <AccordionItem bgColor='gray.200'>
                                    <Flex>
                                        <AccordionButton color='white' fontWeight='semibold'>
                                            <Box flex='1' textAlign='left' color='#dc2f02' fontWeight='semibold' fontSize="13px">
                                                <Badge fontSize="10px" color='red'>{itemCodes?.length}</Badge> Item Code does not exist
                                            </Box>
                                            <AccordionIcon color='secondary' />
                                        </AccordionButton>
                                    </Flex>

                                    <AccordionPanel pb={4}>

                                        <PageScrollModalErrorList>

                                            {
                                                itemCodes?.length > 0 ? (

                                                    <Table variant='striped' size="sm" bg="white">

                                                        <Thead bgColor='gray.600'>
                                                            <Tr>
                                                                {/* <Th color='white'>ID</Th> */}
                                                                <Th color='white' fontSize="9px">PR Number</Th>
                                                                <Th color='white' fontSize="9px">PR Date</Th>
                                                                <Th color='white' fontSize="9px">PO Number</Th>
                                                                <Th color='white' fontSize="9px">PO Date</Th>
                                                                <Th color='white' fontSize="9px">Item Code</Th>
                                                                <Th color='white' fontSize="9px">Item Description</Th>
                                                                <Th color='white' fontSize="9px">Ordered</Th>
                                                                <Th color='white' fontSize="9px">Delivered</Th>
                                                                <Th color='white' fontSize="9px">Billed</Th>
                                                                <Th color='white' fontSize="9px">UOM</Th>
                                                                <Th color='white' fontSize="9px">Unit Price</Th>
                                                                <Th color='white' fontSize="9px">Supplier Name</Th>
                                                            </Tr>
                                                        </Thead>

                                                        <Tbody>
                                                            {itemCodes?.map((ne, i) =>
                                                                <Tr key={i}>
                                                                    {/* <Td>{ }</Td> */}
                                                                    <Td color="gray.600" fontSize="11px">{ne?.pR_Number}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.pR_Date}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.pO_Number}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.pO_Date}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.item_Code}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.item_Description}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.ordered}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.delivered}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.billed}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.uom}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.unit_Price}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.vendor_Name}</Td>
                                                                </Tr>
                                                            )}
                                                        </Tbody>

                                                    </Table>

                                                )
                                                    :
                                                    <Flex justifyContent='center' mt='30px'>
                                                        <VStack>
                                                            <RiFileList3Fill fontSize='200px' />
                                                            <Text color='white'>There are no lists with unregistered item code.</Text>
                                                        </VStack>
                                                    </Flex>
                                            }

                                        </PageScrollModalErrorList>

                                    </AccordionPanel>
                                </AccordionItem>
                                : ''}

                            {/* Supplier */}
                            {supplier?.length > 0 ?
                                <AccordionItem bgColor='gray.200'>
                                    <Flex>
                                        <AccordionButton color='white' fontWeight='semibold'>
                                            <Box flex='1' textAlign='left' color='#dc2f02' fontWeight='semibold' fontSize="13px">
                                                <Badge color='red' fontSize="10px">{supplier?.length}</Badge> Supplier does not exist
                                            </Box>
                                            <AccordionIcon color='secondary' />
                                        </AccordionButton>
                                    </Flex>

                                    <AccordionPanel pb={4}>

                                        <PageScrollModalErrorList>

                                            {
                                                supplier?.length > 0 ? (

                                                    <Table variant='striped' size="sm" bg="white">

                                                        <Thead bgColor='gray.600'>
                                                            <Tr>
                                                                {/* <Th color='white'>ID</Th> */}
                                                                <Th color='white' fontSize="9px">PR Number</Th>
                                                                <Th color='white' fontSize="9px">PR Date</Th>
                                                                <Th color='white' fontSize="9px">PO Number</Th>
                                                                <Th color='white' fontSize="9px">PO Date</Th>
                                                                <Th color='white' fontSize="9px">Item Code</Th>
                                                                <Th color='white' fontSize="9px">Item Description</Th>
                                                                <Th color='white' fontSize="9px">Ordered</Th>
                                                                <Th color='white' fontSize="9px">Delivered</Th>
                                                                <Th color='white' fontSize="9px">Billed</Th>
                                                                <Th color='white' fontSize="9px">UOM</Th>
                                                                <Th color='white' fontSize="9px">Unit Price</Th>
                                                                <Th color='white' fontSize="9px">Supplier Name</Th>
                                                            </Tr>
                                                        </Thead>

                                                        <Tbody>
                                                            {supplier?.map((ne, i) =>
                                                                <Tr key={i}>
                                                                    {/* <Td>{ }</Td> */}
                                                                    <Td color="gray.600" fontSize="11px">{ne?.pR_Number}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.pR_Date}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.pO_Number}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.pO_Date}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.item_Code}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.item_Description}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.ordered}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.delivered}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.billed}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.uom}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.unit_Price}</Td>
                                                                    <Td color="gray.600" fontSize="11px">{ne?.vendor_Name}</Td>
                                                                </Tr>
                                                            )}
                                                        </Tbody>

                                                    </Table>

                                                )
                                                    :
                                                    <Flex justifyContent='center' mt='30px'>
                                                        <VStack>
                                                            <RiFileList3Fill fontSize='200px' />
                                                            <Text color='white'>There are no lists with unregistered suppliers.</Text>
                                                        </VStack>
                                                    </Flex>
                                            }

                                        </PageScrollModalErrorList>

                                    </AccordionPanel>
                                </AccordionItem>
                                : ''}

                            {/* UOM */}
                            {uom?.length > 0 ?
                                <AccordionItem bgColor='gray.200'>
                                    <Flex>
                                        <AccordionButton color='white' fontWeight='semibold'>
                                            <Box flex='1' textAlign='center' color='#dc2f02' fontWeight='semibold'>
                                                UOM does not exist <Badge color='danger'>{uom?.length}</Badge>
                                            </Box>
                                            <AccordionIcon color='secondary' />
                                        </AccordionButton>
                                    </Flex>

                                    <AccordionPanel pb={4}>

                                        <PageScrollModalErrorList>

                                            {
                                                uom?.length > 0 ? (

                                                    <Table variant='striped' size="sm">

                                                        <Thead bgColor='secondary'>
                                                            <Tr>
                                                                {/* <Th color='white'>ID</Th> */}
                                                                <Th color='white'>PR Number</Th>
                                                                <Th color='white'>PR Date</Th>
                                                                <Th color='white'>PO Number</Th>
                                                                <Th color='white'>PO Date</Th>
                                                                <Th color='white'>Item Code</Th>
                                                                <Th color='white'>Item Description</Th>
                                                                <Th color='white'>Ordered</Th>
                                                                <Th color='white'>Delivered</Th>
                                                                <Th color='white'>Billed</Th>
                                                                <Th color='white'>UOM</Th>
                                                                <Th color='white'>Unit Price</Th>
                                                                <Th color='white'>Supplier Name</Th>
                                                            </Tr>
                                                        </Thead>

                                                        <Tbody>
                                                            {uom?.map((ne, i) =>
                                                                <Tr key={i}>
                                                                    {/* <Td>{ }</Td> */}
                                                                    <Td>{ne?.pR_Number}</Td>
                                                                    <Td>{ne?.pR_Date}</Td>
                                                                    <Td>{ne?.pO_Number}</Td>
                                                                    <Td>{ne?.pO_Date}</Td>
                                                                    <Td>{ne?.item_Code}</Td>
                                                                    <Td>{ne?.item_Description}</Td>
                                                                    <Td>{ne?.ordered}</Td>
                                                                    <Td>{ne?.delivered}</Td>
                                                                    <Td>{ne?.billed}</Td>
                                                                    <Td>{ne?.uom}</Td>
                                                                    <Td>{ne?.unit_Price}</Td>
                                                                    <Td>{ne?.vendor_Name}</Td>
                                                                </Tr>
                                                            )}
                                                        </Tbody>

                                                    </Table>

                                                )
                                                    :
                                                    <Flex justifyContent='center' mt='30px'>
                                                        <VStack>
                                                            <RiFileList3Fill fontSize='200px' />
                                                            <Text color='white'>There are no lists with unregistered UOM.</Text>
                                                        </VStack>
                                                    </Flex>
                                            }

                                        </PageScrollModalErrorList>

                                    </AccordionPanel>
                                </AccordionItem>
                                : ''}

                        </Accordion>

                        <HStack mt={20} textAlign='center' fontWeight='semibold'>
                            {/* <TiWarning color='red' /> */}
                            <Text fontSize="9px">Disclaimer: There were no PO imported.</Text>
                        </HStack>

                    </ModalBody>

                </PageScrollImportModal>

                <ModalFooter>
                    <Button mr={3} onClick={onClose} color="gray.600" fontSize="11px">
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ErrorList