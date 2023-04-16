import {
    Badge,
    Box,
    Button,
    Flex,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    Skeleton,
    Stack,
    Table,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    useDisclosure,
    Tbody,
    Td,
    useToast,
    } from "@chakra-ui/react";
    import React, { useState } from "react";
    import { TiArrowSync } from "react-icons/ti";
    import PageScrollImport from "../../../components/PageScrollImport";
    import { FiSearch } from "react-icons/fi";
    import PageScroll from "../../../utils/PageScroll";
    import { ToastComponent } from "../../../components/Toast";
    import Swal from "sweetalert2";
    import request from "../../../services/ApiClient";
    import moment from "moment";
import { ListOfErrors } from "./ListOfErrors";
    // import OrdersConfirmation from "./OrdersConfirmation";
    
    export const ListOfSuppliers = ({genusSupplier, fetchingData}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [errorData, setErrorData] = useState([]);
    
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    // ARRAY FOR THE LIST DATA OF SUPPLIERS
    const resultArray = genusSupplier?.result?.suppliers?.map((item) => {
        return {
            supplier_No: item?.id,
            supplierCode: item?.code,
            supplierName: item?.name
        }
    })
    
      // SYNC ORDER BUTTON
      const syncHandler = () => {
        Swal.fire({
          title: "Confirmation!",
          text: "Are you sure you want to sync these suppliers?",
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
            try {
              setIsLoading(true);
              const res = request
                .put(
                  `Supplier/AddNewSupplier`,
                  resultArray.map((item) => {
                    return {
                        supplier_No: item?.supplier_No,
                        supplierCode: item?.supplierCode,
                        supplierName: item?.supplierName,

                    };
                  })
                )
                .then((res) => {
                  ToastComponent("Success", "Orders Synced!", "success", toast);
                  // fetchNotification();
                  // onClose();
                  setIsLoading(false);
                })
                .catch((err) => {
                  setIsLoading(false);
                  setErrorData(err.response.data);
                  if (err.response.data) {
                    // onClose();
                    onOpen();
                  }
                });
            } catch (error) {}
          }
        });
      };
    
    
    
      return (
        <Flex
          color="fontColor"
          h="auto"
          w="full"
          flexDirection="column"
          p={2}
          bg="form"
          boxShadow="md"
        >
          <Flex p={2} flexDirection="column">
    
    
            
                <Flex justifyContent="space-between" w="100%" p={4} mt={-3}>
                  <HStack>
                    {/* <Text>Search</Text> */}
                    <InputGroup size="sm">
                      <InputLeftElement
                        pointerEvents="none"
                        children={<FiSearch bg="black" fontSize="18px" />}
                      />
                      <Input
                        fontSize="13px"
                        size="sm"
                        type="text"
                        placeholder="Search: ex. Supplier Name"
                        onChange={(e) => setKeyword(e.target.value)}
                        disabled={isLoading}
                        borderColor="gray.200"
                        _hover={{ borderColor: "gray.400" }}
                      />
                    </InputGroup>
                  </HStack>
    
                  <HStack>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      fontSize="13px"
                      borderRadius="none"
                      leftIcon={<TiArrowSync fontSize="19px" />}
                      onClick={() => syncHandler()}
                    >
                      Sync
                    </Button>
                  </HStack>
                </Flex>
    
                <Flex p={4}>
                  <VStack bg="primary" alignItems="center" w="100%" p={1} mt={-7}>
                    <Text color="white" fontSize="13px" textAlign="center">
                      LIST OF SUPPLIERS
                    </Text>
                  </VStack>
                </Flex>
    
                <Flex p={4}>
                  <VStack w="100%" mt={-8}>
                    <PageScroll>
                      {fetchingData ? (
                        <Stack width="full">
                          <Skeleton height="20px" />
                          <Skeleton height="20px" />
                          <Skeleton height="20px" />
                          <Skeleton height="20px" />
                          <Skeleton height="20px" />
                          <Skeleton height="20px" />
                          <Skeleton height="20px" />
                          <Skeleton height="20px" />
                          <Skeleton height="20px" />
                          <Skeleton height="20px" />
                          <Skeleton height="20px" />
                          <Skeleton height="20px" />
                        </Stack>
                      ) : (
                        <Table
                          size="sm"
                        //   width="full"
                          // height="100%"
                          border="none"
                          boxShadow="md"
                          bg="gray.200"
                          variant="striped"
                        >
                          <Thead bg="secondary" position="sticky" top={0}>
                            <Tr h="30px">
                              <Th color="#D6D6D6" fontSize="10px" pl="100px">
                                ID
                              </Th>
                              <Th color="#D6D6D6" fontSize="10px" pl="100px">
                                Supplier No.
                              </Th>
                              {/* <Th color="#D6D6D6" fontSize="10px" pl="100px">
                               
                              </Th> */}
                              <Th color="#D6D6D6" fontSize="10px" pl="100px">
                                Supplier Code
                              </Th>
                              <Th color="#D6D6D6" fontSize="10px" pl="200px">
                                Supplier Name
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {genusSupplier?.result
                              ?.suppliers?.filter((val) => {
                                const newKeyword = new RegExp(
                                  `${keyword.toLowerCase()}`
                                );
                                return val?.name
                                  ?.toLowerCase()
                                  .match(newKeyword, "*");
                              })
                              ?.map((supp, i) => (
                                <Tr key={i}>
                                  <Td fontSize="12px" pl="100px">{i + 1}</Td>
                                  <Td fontSize="12px" pl="100px">
                                    {supp.id}
                                  </Td>
                                  {/* <Td fontSize="12px" pl="100px"></Td> */}
                                  <Td fontSize="12px" pl="100px">
                                    {supp.code}
                                  </Td>
                                  <Td fontSize="12px" pl="200px">{supp.name}</Td>
                                </Tr>
                              ))}
                          </Tbody>
                        </Table>
                      )}
                    </PageScroll>
                  </VStack>
                </Flex>
            
    
            
              <Flex>
                <HStack>
                  <Badge colorScheme="cyan">
                    <Text color="secondary">
                      Number of Records: {genusSupplier?.result?.suppliers?.length}
                    </Text>
                  </Badge>
                </HStack>
              </Flex>
    
    
            {isOpen && (
              <ListOfErrors
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                resultArray={resultArray}
                errorData={errorData}
                setErrorData={setErrorData}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
          </Flex>
        </Flex>
      );
    }
    