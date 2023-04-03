import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  useToast,
  Thead,
  Tr,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  VStack,
  Portal,
  Image,
} from "@chakra-ui/react";
import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AiTwotoneEdit } from "react-icons/ai";
import { GiChoice } from "react-icons/gi";
import { FiSearch } from "react-icons/fi";
import { RiAddFill } from "react-icons/ri";
import PageScroll from "../../utils/PageScroll";
import request from "../../services/ApiClient";
import { ToastComponent } from "../../components/Toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { decodeUser } from "../../services/decode-user";
import {
  Pagination,
  usePagination,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
  PaginationContainer,
  PaginationPageGroup,
} from "@ajna/pagination";
import { BsCheckLg } from "react-icons/bs";

const MaterialsManagement = () => {
  const [materials, setMaterials] = useState([]);
  const [editData, setEditData] = useState([]);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const toast = useToast();
  const currentUser = decodeUser();

  const [isLoading, setIsLoading] = useState(true);
  const [pageTotal, setPageTotal] = useState(undefined);
  const [disableEdit, setDisableEdit] = useState(false);
  const itemCategoryRef = useRef();

  // FETCH API MATERIALS:
  const fetchMaterialApi = async (pageNumber, pageSize, status, search) => {
    const response = await request.get(
      `Material/GetAllMaterialWithPaginationOrig/${status}?PageNumber=${pageNumber}&PageSize=${pageSize}&search=${search}`
    );

    return response.data;
  };

  //PAGINATION
  const outerLimit = 2;
  const innerLimit = 2;
  const {
    currentPage,
    setCurrentPage,
    pagesCount,
    pages,
    setPageSize,
    pageSize,
  } = usePagination({
    total: pageTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: { currentPage: 1, pageSize: 5 },
  });

  const handlePageChange = (nextPage) => {
    setCurrentPage(nextPage);
  };

  const handlePageSizeChange = (e) => {
    const pageSize = Number(e.target.value);
    setPageSize(pageSize);
  };

  //SHOW MAIN MENU DATA----
  const getMaterialHandler = () => {
    fetchMaterialApi(currentPage, pageSize, status, search).then((res) => {
      setIsLoading(false);
      setMaterials(res);
      setPageTotal(res.totalCount);
    });
  };

  useEffect(() => {
    getMaterialHandler();

    return () => {
      setMaterials([]);
    };
  }, [currentPage, pageSize, status, search]);

  //STATUS
  const statusHandler = (data) => {
    setStatus(data);
  };

  const changeStatusHandler = (id, isActive) => {
    let routeLabel;
    if (isActive) {
      routeLabel = "InActiveMaterial";
    } else {
      routeLabel = "ActivateMaterial";
    }

    request
      .put(`Material/${routeLabel}`, { id: id })
      .then((res) => {
        ToastComponent("Success", "Status updated", "success", toast);
        getMaterialHandler();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // SEARCH
  const searchHandler = (inputValue) => {
    setSearch(inputValue);
    // console.log(inputValue)
  };

  //ADD MAIN MENU HANDLER---
  const addMaterialHandler = () => {
    setEditData({
      id: "",
      itemCode: "",
      itemDescription: "",
      subCategoryId: "",
      uomId: "",
      bufferLevel: "",
      addedBy: currentUser.userName,
      modifiedBy: "",
    });
    onOpen();
    setDisableEdit(false);
  };

  //EDIT ROLE--
  const editMaterialHandler = (materials) => {
    setDisableEdit(true);
    setEditData(materials);
    onOpen();
    // console.log(mod.mainMenu)
  };

  //FOR DRAWER (Drawer / Drawer Tagging)
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex
      color="fontColor"
      h="full"
      w="full"
      flexDirection="column"
      p={2}
      bg="form"
      boxShadow="md"
    >
      <Flex p={2} w="full">
        <Flex flexDirection="column" gap={1} w="full">
          <Flex justifyContent="space-between" alignItems="center">
            <HStack w="25%" mt={3}>
              <InputGroup size="sm">
                <InputLeftElement
                  pointerEvents="none"
                  children={<FiSearch bg="black" fontSize="18px" />}
                />
                <Input
                  borderRadius="lg"
                  fontSize="13px"
                  type="text"
                  border="1px"
                  bg="#E9EBEC"
                  placeholder="Search Item Code"
                  borderColor="gray.400"
                  _hover={{ borderColor: "gray.400" }}
                  onChange={(e) => searchHandler(e.target.value)}
                />
              </InputGroup>
            </HStack>

            <HStack flexDirection="row">
              <Text fontSize="12px">STATUS:</Text>
              <Select
                fontSize="12px"
                onChange={(e) => statusHandler(e.target.value)}
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </Select>
            </HStack>
          </Flex>

          <Flex w="full" flexDirection="column" gap={2}>
            <PageScroll maxHeight="470px">
              {isLoading ? (
                <Stack width="full">
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
                  width="full"
                  border="none"
                  boxShadow="md"
                  bg="gray.200"
                  variant="striped"
                >
                  <Thead bg="secondary">
                    <Tr fontSize="15px">
                      <Th color="#D6D6D6" fontSize="10px">
                        ID
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Item Code
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Item Description
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Item Sub Category
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Item Category
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        UOM
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Buffer Level
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Date Added
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Added By
                      </Th>
                      <Th color="#D6D6D6" fontSize="10px">
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {materials?.materials?.map((mats, i) => (
                      <Tr key={i}>
                        <Td fontSize="11px">{mats.id}</Td>
                        <Td fontSize="11px">{mats.itemCode}</Td>
                        <Td fontSize="11px">{mats.itemDescription}</Td>
                        <Td fontSize="11px">{mats.subCategoryName}</Td>
                        <Td fontSize="11px">{mats.itemCategoryName}</Td>
                        <Td fontSize="11px">{mats.uom}</Td>
                        <Td fontSize="11px">{mats.bufferLevel}</Td>
                        <Td fontSize="11px">{mats.dateAdded}</Td>
                        <Td fontSize="11px">{mats.addedBy}</Td>

                        <Td pl={0}>
                          <Flex>
                            <HStack>
                              <Button
                                bg="none"
                                size="sm"
                                onClick={() => editMaterialHandler(mats)}
                              >
                                <AiTwotoneEdit fontSize="15px" />
                              </Button>

                              <Popover>
                                {({ onClose }) => (
                                  <>
                                    <PopoverTrigger>
                                      {mats.isActive === true ? (
                                        <Button bg="none" size="md" p={0}>
                                          <Image
                                            boxSize="20px"
                                            src="/images/turnon.png"
                                            title="active"
                                          />
                                        </Button>
                                      ) : (
                                        <Button bg="none" size="md" p={0}>
                                          <Image
                                            boxSize="20px"
                                            src="/images/turnoff.png"
                                            title="inactive"
                                          />
                                        </Button>
                                      )}
                                    </PopoverTrigger>
                                    <Portal>
                                      <PopoverContent bg="primary" color="#fff">
                                        <PopoverArrow bg="primary" />
                                        <PopoverCloseButton />
                                        <PopoverHeader>
                                          Confirmation!
                                        </PopoverHeader>
                                        <PopoverBody>
                                          <VStack onClick={onClose}>
                                            {mats.isActive === true ? (
                                              <Text>
                                                Are you sure you want to set
                                                this Material inactive?
                                              </Text>
                                            ) : (
                                              <Text>
                                                Are you sure you want to set
                                                this Material active?
                                              </Text>
                                            )}
                                            <Button
                                              colorScheme="green"
                                              size="sm"
                                              onClick={() =>
                                                changeStatusHandler(
                                                  mats.id,
                                                  mats.isActive
                                                )
                                              }
                                            >
                                              Yes
                                            </Button>
                                          </VStack>
                                        </PopoverBody>
                                      </PopoverContent>
                                    </Portal>
                                  </>
                                )}
                              </Popover>
                            </HStack>
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}

              <Flex justifyContent="space-between" mt={2}>
                <Button
                  size="sm"
                  colorScheme="blue"
                  fontSize="13px"
                  fontWeight="normal"
                  _hover={{ bg: "blue.400", color: "#fff" }}
                  w="auto"
                  leftIcon={<RiAddFill fontSize="20px" />}
                  borderRadius="none"
                  onClick={addMaterialHandler}
                >
                  New Material
                </Button>
                <Stack>
                  <Pagination
                    pagesCount={pagesCount}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  >
                    <PaginationContainer>
                      <PaginationPrevious
                        bg="primary"
                        color="white"
                        p={1}
                        _hover={{ bg: "btnColor", color: "white" }}
                        size="sm"
                      >
                        {"<<"}
                      </PaginationPrevious>
                      <PaginationPageGroup ml={1} mr={1}>
                        {pages.map((page) => (
                          <PaginationPage
                            _hover={{ bg: "btnColor", color: "white" }}
                            _focus={{ bg: "btnColor" }}
                            p={3}
                            bg="primary"
                            color="white"
                            key={`pagination_page_${page}`}
                            page={page}
                            size="sm"
                          />
                        ))}
                      </PaginationPageGroup>
                      <HStack>
                        <PaginationNext
                          bg="primary"
                          color="white"
                          p={1}
                          _hover={{ bg: "btnColor", color: "white" }}
                          size="sm"
                          mb={2}
                        >
                          {">>"}
                        </PaginationNext>
                        <Select
                          onChange={handlePageSizeChange}
                          bg="#FFFFFF"
                          // size="sm"
                          mb={2}
                          variant="outline"
                        >
                          <option value={Number(5)}>5</option>
                          <option value={Number(10)}>10</option>
                          <option value={Number(25)}>25</option>
                          <option value={Number(50)}>50</option>
                        </Select>
                      </HStack>
                    </PaginationContainer>
                  </Pagination>
                </Stack>

                {/* PROPS */}
                {isOpen && (
                  <DrawerComponent
                    itemCategoryRef={itemCategoryRef}
                    isOpen={isOpen}
                    onClose={onClose}
                    fetchMaterialApi={fetchMaterialApi}
                    getMaterialHandler={getMaterialHandler}
                    editData={editData}
                    disableEdit={disableEdit}
                  />
                )}
              </Flex>
            </PageScroll>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MaterialsManagement;

const schema = yup.object().shape({
  formData: yup.object().shape({
    id: yup.string().uppercase(),
    itemCode: yup.string().uppercase().required("Item code is required"),
    itemDescription: yup.string().uppercase().required("Description is required"),
    subCategoryId: yup.number().required("Sub Category is required"),
    // itemCategoryId: yup.number().required("Sub Category is required"),
    uomId: yup.number().required("UOM is required"),
    bufferLevel: yup
      .number()
      .required("Buffer level is required")
      .typeError("Must be a number")
      .positive("Negative value is not valid")
      .integer()
      .min(1, "Bufffer level must be greater than or equal to 1"),
    addedBy: yup.string().uppercase().uppercase(),
  }),
    
});

const currentUser = decodeUser();

const DrawerComponent = (props) => {
  const {
    isOpen,
    onClose,
    getMaterialHandler,
    editData,
    disableEdit,
    itemCategoryRef,
  } = props;

  const [subCategory, setSubCategory] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [itemCategoryName, setItemCategory] = useState("");
  const [uom, setUom] = useState([]);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      formData: {
        id: "",
        itemCode: "",
        itemDescription: "",
        subCategoryId: "",
        itemCategoryId: "",
        uomId: "",
        bufferLevel: "",
        addedBy: currentUser?.userName,
        modifiedBy: "",
      },
    },
  });

  const fetchSubCat = async () => {
    try {
      const res = await request.get("Material/GetAllActiveSubcategoryDropDown");
      setSubCategory(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    try {
      fetchSubCat();
    } catch (error) {}
  }, []);

  const categoryStatusHandler = (data) => {
    const newData = JSON.parse(data);
    if (data) {
      setItemCategory(newData.subcategoryName);
    } else {
      setItemCategory("");
    }
  };

  const categoryCategoryStatusHandler = (data) => {
    const newData = JSON.parse(data);
    if (data) {
      setValue("formData.subCategoryId", newData.subCategoryId);
      setValue("formData.itemCategoryName", newData.categoryName);
    } else {
      setValue("formData.subCategoryId", "");
      setValue("formData.itemCategoryName", "");
    }
    console.log(newData);
  };

  // useEffect(() => {
  //   console.log(itemCategoryRef);
  // }, [watch("formData.subCategoryId")]);

  const fetchItemCat = async () => {
    try {
      const res = await request.get(
        `Material/GetAllSubcategoriesmaterial?category=${itemCategoryName}`
      );
      setCategoryData(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    try {
      fetchItemCat();
    } catch (error) {}
  }, [itemCategoryName]);

  const fetchUom = async () => {
    try {
      const res = await request.get("Uom/GetAllActiveUoms");
      setUom(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    try {
      fetchUom();
    } catch (error) {}
  }, []);

  const submitHandler = async (data) => {
    console.log(data);
    try {
      if (data.formData.id === "") {
        delete data.formData["id"];
        const res = await request
          .post(`Material/AddNewMaterial`, data.formData)
          .then((res) => {
            ToastComponent(
              "Success",
              "New Material created!",
              "success",
              toast
            );
            getMaterialHandler();
            onClose();
          })
          .catch((err) => {
            ToastComponent("Error", err.response.data, "error", toast);
            data.formData.id = "";
          });
      } else {
        const res = await request
          .put(`Material/UpdateMaterials`, data.formData)
          .then((res) => {
            ToastComponent("Success", "Material Updated", "success", toast);
            getMaterialHandler();
            onClose(onClose);
          })
          .catch((error) => {
            ToastComponent(
              "Update Failed",
              error.response.data,
              "warning",
              toast
            );
          });
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (editData.id) {
      setValue(
        "formData",
        {
          id: editData.id,
          itemCode: editData?.itemCode,
          itemDescription: editData?.itemDescription,
          subCategoryId: editData?.subCategoryId,

          uomId: editData?.uomId,
          bufferLevel: editData?.bufferLevel,
          modifiedBy: currentUser.userName,
        },
        { shouldValidate: true }
      );
    }
  }, [editData]);

  console.log(watch("formData"));

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <form onSubmit={handleSubmit(submitHandler)}>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Material Form</DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>
              <Stack spacing="7px">
                <Box>
                  <FormLabel>Item Code:</FormLabel>
                  <Input
                    {...register("formData.itemCode")}
                    placeholder="Please enter Item Code"
                    autoComplete="off"
                    autoFocus
                    disabled={disableEdit}
                    readOnly={disableEdit}
                    _disabled={{ color: "black" }}
                    bgColor={disableEdit && "gray.300"}
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.itemCode?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Item Description:</FormLabel>
                  <Input
                    {...register("formData.itemDescription")}
                    placeholder="Please enter Description"
                    autoComplete="off"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.itemDescription?.message}
                  </Text>
                </Box>

                <Flex mt={3}></Flex>

                <Box>
                  <FormLabel>Item Sub Category:</FormLabel>
                  {subCategory.length > 0 ? (
                    <Select
                      // {...register("formData.subCategoryId")}
                      placeholder="Select Sub Category"
                      onChange={(e) => categoryStatusHandler(e.target.value)}
                    >
                      {subCategory.map((subCat, i) => (
                        <option key={i} value={JSON.stringify(subCat)}>
                          {subCat.subcategoryName}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    "loading"
                  )}
                  <Text color="red" fontSize="xs">
                    {errors.formData?.subCategoryId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Item Category:</FormLabel>
                  {categoryData.length > 0 ? (
                    <Select
                      ref={itemCategoryRef}
                      // {...register("formData.itemCategoryId")}
                      placeholder="Select Item Category"
                      onChange={(e) =>
                        categoryCategoryStatusHandler(e.target.value)
                      }
                    >
                      {categoryData.map((itemCat, i) => (
                        <option key={i} value={JSON.stringify(itemCat)}>
                          {itemCat.categoryName}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Select>
                      <option>Select Item Category</option>
                    </Select>
                  )}
                  <Text color="red" fontSize="xs">
                    {errors.formData?.itemCategoryId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>UOM:</FormLabel>
                  {uom.length > 0 ? (
                    <Select
                      {...register("formData.uomId")}
                      placeholder="Select UOM"
                    >
                      {uom.map((uoms) => (
                        <option key={uoms.id} value={uoms.id}>
                          {uoms.uomCode}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    "loading"
                  )}
                  <Text color="red" fontSize="xs">
                    {errors.formData?.uomId?.message}
                  </Text>
                </Box>

                <Box>
                  <FormLabel>Buffer Level:</FormLabel>
                  <Input
                    {...register("formData.bufferLevel")}
                    type="number"
                    placeholder="Please enter Buffer Level"
                    autoComplete="off"
                    // type="number"
                  />
                  <Text color="red" fontSize="xs">
                    {errors.formData?.bufferLevel?.message}
                  </Text>
                </Box>
              </Stack>
            </DrawerBody>
            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue" disabled={!isValid}>
                Submit
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </form>
      </Drawer>
    </>
  );
};
