import React, { useState } from 'react'
import { Button, ButtonGroup, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, toast, useDisclosure, useToast, VStack } from '@chakra-ui/react'
import { FcInfo } from 'react-icons/fc'
import request from '../../../services/ApiClient'
import { decodeUser } from '../../../services/decode-user'
import { ToastComponent } from '../../../components/Toast'
import { BsPatchQuestionFill } from 'react-icons/bs'

const currentUser = decodeUser()

export const AddConfirmation = ({ isOpen, onClose, closeAddModal, details, setDetails, rawMatsInfo, setRawMatsInfo,
    customerRef, warehouseId, setSelectorId, setWarehouseId, fetchActiveMiscIssues, customerData, remarks, setRemarks, remarksRef }) => {

    const [isLoading, setIsLoading] = useState(false)

    const toast = useToast()
    
    const submitHandler = () => {
            setIsLoading(true)
            try {
                const addSubmit = {
                    warehouseId: warehouseId,
                    itemCode: rawMatsInfo.itemCode,
                    itemDescription: rawMatsInfo.itemDescription,
                    uom: rawMatsInfo.uom,
                    customer: rawMatsInfo.customerName,
                    customerCode: customerData.customerCode,
                    // expirationDate: rawMatsInfo.expirationDate,
                    quantity: rawMatsInfo.quantity,
                    remarks: remarks,
                    details: details,
                    preparedBy: currentUser.fullName
                }
                const res = request.post(`Miscellaneous/AddNewMiscellaneousIssueDetails`, addSubmit)
                    .then(res => {
                        ToastComponent("Success", "Item added", "success", toast)
                        setRawMatsInfo({
                            itemCode: '',
                            itemDescription: '',
                            customer: rawMatsInfo.customerName,
                            uom: '',
                            warehouseId: '',
                            quantity: ''
                        })
                        setWarehouseId('')
                        setIsLoading(false)
                        fetchActiveMiscIssues()
                        onClose()
                        closeAddModal()
                    })
                    .catch(err => {
                        ToastComponent("Error", "Item was not added", "error", toast)
                    })
            } catch (error) {
        }
    }

    // console.log(rawMatsInfo)
    // console.log(customerData)


  return (
    <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
        <ModalOverlay />
        <ModalContent pt={10} pb={5}>
            <ModalHeader>
                <Flex justifyContent='center'>
                    <FcInfo fontSize='50px' />
                </Flex>
            </ModalHeader>
            <ModalCloseButton onClick={onClose} />

            <ModalBody mb={5}>
                <Text textAlign='center' fontSize='sm'>Are you sure you want to add this information?</Text>
            </ModalBody>

            <ModalFooter justifyContent="center">
                <ButtonGroup>
                    <Button size="sm" onClick={submitHandler} isLoading={isLoading} colorScheme='blue'>Yes</Button>
                    <Button size="sm" onClick={onClose} isLoading={isLoading} colorScheme='blackAlpha'>No</Button>
                </ButtonGroup>
            </ModalFooter>
        </ModalContent>
    </Modal>
  )
}

export const CancelConfirmation = ({ isOpen, onClose, selectorId, setSelectorId, fetchActiveMiscIssues, fetchBarcodeNo }) => {

    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const cancelSubmitHandler = () => {
        setIsLoading(true)
        try {
            const res = request.put(`Miscellaneous/CancelItemCodeInMiscellaneousIssue`, [{ id: selectorId }])
                .then(res => {
                    ToastComponent("Success", "Item has been cancelled", "success", toast)
                    fetchActiveMiscIssues()
                    fetchBarcodeNo()
                    setIsLoading(false)
                    setSelectorId('')
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Item was not cancelled", "error", toast)
                    setIsLoading(false)
                })
        } catch (error) {
        }
    }

   
    console.log(selectorId)

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent bgColor='secondary' color='white' pt={10} pb={5}>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <BsPatchQuestionFill fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody mb={5}>
                    <Text textAlign='center' fontSize='lg'>Are you sure you want to cancel this information?</Text>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup>
                        <Button size="sm" onClick={cancelSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme='blue'>Yes</Button>
                        <Button size="sm" onClick={onClose} isLoading={isLoading} colorScheme='blackAlpha'>No</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export const SaveConfirmation = ({ isOpen, onClose, totalQuantity, details, customerData, setTotalQuantity, rawMatsInfo,
    miscData, fetchActiveMiscIssues, isLoading, setIsLoading, customerRef, setDetails, setRawMatsInfo, setHideButton, remarks, setRemarks, remarksRef
}) => {

    const toast = useToast()

    const saveSubmitHandler = () => {

        if (totalQuantity > 0) {
            setIsLoading(true)
            try {
                const res = request.post(`Miscellaneous/AddNewMiscellaneousIssue`, {
                    customercode: customerData.customerCode,
                    customer: customerData.customerName,
                    totalQuantity: totalQuantity,
                    preparedBy: currentUser.fullName,
                    remarks: remarks,
                    details: details,
                }
                )
                    .then(res => {
                        const issuePKey = res.data.id

                        //SECOND Update IF MAY ID
                        if (issuePKey) {
                            const arrayofId = miscData?.map(item => {
                                return {
                                    issuePKey: issuePKey,
                                    id: item.id
                                }
                            })
                            try {
                                const res = request.put(`Miscellaneous/UpdateMiscellaneousIssuePKey`, arrayofId)
                                    .then(res => {
                                        fetchActiveMiscIssues()
                                        ToastComponent("Success", "Information saved", "success", toast)
                                        onClose()
                                        setTotalQuantity('')
                                        customerRef.current.value = ''
                                        remarksRef.current.value = ''
                                        setDetails('')
                                        setRawMatsInfo({
                                            itemCode: '',
                                            itemDescription: '',
                                            supplier: '',
                                            uom: '',
                                            // expirationDate: '',
                                            quantity: ''
                                        })
                                        setIsLoading(false)
                                        setHideButton(false)
                                    })
                            } catch (error) {
                                console.log(error)
                                
                            }
                        }

                    })
                    .catch(err => {
                        ToastComponent("Error", "Information was not saved", "error", toast)
                        setIsLoading(false)
                    })
            } catch (error) {
            }
            setIsLoading(false)
        }
    }

    const closeHandler = () => {
        setHideButton(false)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalOverlay />
            <ModalContent pt={10} pb={5}>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <FcInfo fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={closeHandler} />

                <ModalBody mb={5}>
                    <Text textAlign='center' fontSize='sm'>Are you sure you want to save this information?</Text>
                </ModalBody>

                <ModalFooter justifyContent="center">
                    <ButtonGroup>
                        <Button size="sm" onClick={saveSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme='blue'>Yes</Button>
                        <Button size="sm" onClick={closeHandler} isLoading={isLoading} colorScheme='blackAlpha'>No</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export const AllCancelConfirmation = ({ isOpen, onClose, miscData, setSelectorId, fetchActiveMiscIssues, setHideButton, fetchBarcodeNo }) => {

    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()

    const allCancelSubmitHandler = () => {
        setIsLoading(true)
        const allId = miscData.map(item => {
            return {
                id: item.id
            }
        })
        try {
            const res = request.put(`Miscellaneous/CancelItemCodeInMiscellaneousIssue`, allId)
                .then(res => {
                    ToastComponent("Success", "Items has been cancelled", "success", toast)
                    fetchActiveMiscIssues()
                    fetchBarcodeNo()
                    setSelectorId('')
                    setHideButton(false)
                    setIsLoading(false)
                    onClose()
                })
                .catch(err => {
                    ToastComponent("Error", "Item was not cancelled", "error", toast)
                    setIsLoading(false)
                })
        } catch (error) {
        }
        
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} isCentered size='xl'>
            <ModalContent bgColor='secondary' color='white' pt={10} pb={5}>
                <ModalHeader>
                    <Flex justifyContent='center'>
                        <BsPatchQuestionFill fontSize='50px' />
                    </Flex>
                </ModalHeader>
                <ModalCloseButton onClick={onClose} />

                <ModalBody mb={5}>
                    <Text textAlign='center' fontSize='lg'>Are you sure you want to cancel all items in the list?</Text>
                </ModalBody>

                <ModalFooter>
                    <ButtonGroup>
                        <Button onClick={allCancelSubmitHandler} isLoading={isLoading} disabled={isLoading} colorScheme='blue'>Yes</Button>
                        <Button onClick={onClose} isLoading={isLoading} colorScheme='blackAlpha'>No</Button>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

