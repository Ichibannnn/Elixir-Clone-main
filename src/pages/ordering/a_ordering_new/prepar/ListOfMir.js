import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  Select,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import moment from "moment";
import PageScroll from "../../../../utils/PageScroll";
import request from "../../../../services/ApiClient";

export const ListOfMir = ({
  customerName,
  setCustomerName,
  status,
  setStatus,
  selectedMIRIds,
  setSelectedMIRIds,
  customerList,
  mirList,
  regularOrdersCount,
  rushOrdersCount,
  setCustomerList,
  selectedMIRIdsChange,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const handleAllCheckboxChange = () => {
    setIsAllChecked(!isAllChecked);
    setSelectedMIRIds(isAllChecked ? [] : mirList.map((mir) => mir.mirId));
  };

  const handleMIRCheckboxChange = (mirId) => {
    setSelectedMIRIds((prevSelectedMIRIds) => {
      if (prevSelectedMIRIds.includes(mirId)) {
        return prevSelectedMIRIds.filter((id) => id !== mirId);
      } else {
        return [...prevSelectedMIRIds, mirId];
      }
    });
    setIsAllChecked(false); // Uncheck "Select All" checkbox when individual checkboxes are clicked
  };

  console.log(selectedMIRIds);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    setSelectedMIRIds([]); // Reset selected MIR IDs when changing status
  };

  const handleCustomerButtonClick = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleCustomerNameClick = (name) => {
    setCustomerName(name);
    setIsDrawerOpen(false);
  };

  return (
    <Flex direction="column" p={4} w="full">
      <Button
        w="auto"
        variant="solid"
        colorScheme="gray"
        onClick={handleCustomerButtonClick}
        mb={3}
        borderRadius="none"
        fontSize="xs"
      >
        Customer Name: {customerName}
      </Button>
      <Flex direction="row" justifyContent="left">
        <Button
          size="xs"
          fontSize="xs"
          borderRadius="none"
          colorScheme={!status ? "blue" : "gray"}
          variant={!status ? "solid" : "outline"}
          onClick={() => handleStatusChange(false)}
        >
          Regular Orders
          {regularOrdersCount > 0 && (
            <Badge ml={2} colorScheme="red" variant="solid" borderRadius="40%">
              {regularOrdersCount}
            </Badge>
          )}
        </Button>
        <Button
          size="xs"
          fontSize="xs"
          borderRadius="none"
          colorScheme={status ? "blue" : "gray"}
          variant={status ? "solid" : "outline"}
          onClick={() => handleStatusChange(true)}
        >
          Rush Orders
          {rushOrdersCount > 0 && (
            <Badge ml={2} colorScheme="red" variant="solid" borderRadius="40%">
              {rushOrdersCount}
            </Badge>
          )}
        </Button>
      </Flex>

      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={handleCloseDrawer}
      >
        <DrawerOverlay />
        <DrawerContent spacing={4}>
          <DrawerCloseButton />
          <DrawerHeader>Customer Names</DrawerHeader>
          <DrawerBody>
            {customerList?.orders?.map((customer, i) => (
              <HStack key={i} spacing={2}>
                <Tag
                  onClick={() => handleCustomerNameClick(customer.customerName)}
                  cursor="pointer"
                  colorScheme={
                    customer.customerName === customerName ? "blue" : "gray"
                  }
                >
                  {customer.customerName}
                </Tag>
              </HStack>
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <Text
        textAlign="center"
        bgColor="secondary"
        color="white"
        fontSize="13px"
      >
        List of MIR IDs
      </Text>
      <PageScroll minHeight="200px" maxHeight="210px">
        <Table size="sm" variant="simple">
          <Thead bgColor="secondary">
            <Tr cursor="pointer">
              <Th color="white" fontSize="10px">
                <Checkbox
                  // size="sm"
                  isChecked={isAllChecked}
                  onChange={() => handleAllCheckboxChange()}
                />{" "}
                Line
              </Th>
              <Th color="white" fontSize="10px">
                MIR ID
              </Th>
              <Th color="white" fontSize="10px">
                Ordered Date
              </Th>
              <Th color="white" fontSize="10px">
                Ordered Needed
              </Th>
              <Th color="white" fontSize="10px">
                Customer Code
              </Th>
              <Th color="white" fontSize="10px">
                Customer Name
              </Th>
              <Th color="white" fontSize="10px">
                Customer Type
              </Th>
              <Th color="white" fontSize="10px">
                Total Quantity
              </Th>
              <Th color="white" fontSize="10px">
                Remarks
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {mirList?.map((mir, i) => (
              <Tr key={i}>
                <Td fontSize="xs">
                  <Checkbox
                    isChecked={
                      isAllChecked || selectedMIRIds.includes(mir.mirId)
                    }
                    onChange={() => handleMIRCheckboxChange(mir.mirId)}
                    // value={JSON.stringify(mir)}
                  >
                    <Text fontSize="xs">{i + 1}</Text>
                  </Checkbox>
                </Td>
                <Td fontSize="xs">{mir.mirId}</Td>
                <Td fontSize="xs">
                  {moment(mir.orderedDate).format("MM/DD/yyyy")}
                </Td>
                <Td fontSize="xs">
                  {moment(mir.dateNeeded).format("MM/DD/yyyy")}
                </Td>
                <Td fontSize="xs">{mir.customerCode}</Td>
                <Td fontSize="xs">{mir.customerName}</Td>
                <Td fontSize="xs">{mir.customerType}</Td>
                <Td fontSize="xs">{mir.totalQuantity}</Td>
                <Td fontSize="xs">{mir.rush}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PageScroll>
    </Flex>
  );
};

// NEWEST CODES =======================================================================================
// import React, { useEffect, useState } from "react";
// import {
//   Badge,
//   Checkbox,
//   Flex,
//   HStack,
//   Select,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
// } from "@chakra-ui/react";
// import moment from "moment";
// import PageScroll from "../../../../utils/PageScroll";
// import { set } from "react-hook-form";

// export const ListOfMir = ({
//   mirList,
//   customers,
//   setCustomers,
//   mirIds,
//   setMirIds,
//   mirOrderList,
//   selectedMirIds,
//   setSelectedMirIds,
//   handleMirSelection,
// }) => {
//   // const mirIdHandler = (mirId, customerName) => {
//   //   if (mirId && customerName) {
//   //     setMirIds(mirId);
//   //     setCustomers(customerName);
//   //   } else {
//   //     setMirIds("");
//   //     setCustomers("");
//   //   }
//   // };

//   const handleCheckboxChange = (mirId) => {
//     if (mirIds.includes(mirId)) {
//       // If mirId is already in the list, remove it
//       setMirIds((prevMirIds) => prevMirIds.filter((id) => id !== mirId));
//     } else {
//       // If mirId is not in the list, add it
//       setMirIds((prevMirIds) => [...prevMirIds, mirId]);
//     }
//   };

//   // Auto select index 0
//   useEffect(() => {
//     setMirIds(mirList?.mirId);
//     setCustomers(mirList?.customerName);
//   }, [mirList]);

//   // console.log(mirOrderList);

//   return (
//     <Flex w="95%" h="250px" flexDirection="column">
//       <Flex flexDirection="column">
//         <Text
//           textAlign="center"
//           bgColor="secondary"
//           color="white"
//           fontSize="13px"
//         >
//           List of Prepared Date
//         </Text>
//         <PageScroll minHeight="200px" maxHeight="210px">
//           <Table size="sm" variant="simple">
//             <Thead bgColor="secondary">
//               <Tr h="30px">
//                 <Th color="white" fontSize="10px">
//                   Line
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   MIR ID
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Ordered Date
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Date Needed
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Customer Code
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Customer Name
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Total Quantity Order
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Status
//                 </Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {mirList && mirList.length > 0 ? (
//                 mirList?.map((item, i) => (
//                   <Tr
//                     onClick={() =>
//                       handleMirSelection(item.mirId, item.customerName)
//                     }
//                     bgColor={selectedMirIds[item.mirId] ? "blue.100" : "none"}
//                     key={i}
//                     cursor="pointer"
//                   >
//                     <Td fontSize="xs">
//                       <Checkbox
//                         isChecked={selectedMirIds[item.mirId]}
//                         onChange={() => handleCheckboxChange(item.mirId)}
//                         // onChange={() =>
//                         //   mirIdHandler(item.mirId, item.customerName)
//                         // }
//                       />
//                       {i + 1}
//                     </Td>
//                     <Td fontSize="xs">{item.mirId}</Td>
//                     {/* <Td fontSize="xs">{item.department}</Td> */}
//                     <Td fontSize="xs">
//                       {moment(item.orderedDate).format("MM/DD/yyyy")}
//                     </Td>
//                     <Td fontSize="xs">
//                       {moment(item.dateNeeded).format("MM/DD/yyyy")}
//                     </Td>
//                     <Td fontSize="xs">{item.customerCode}</Td>
//                     <Td fontSize="xs">{item.customerName}</Td>
//                     <Td fontSize="xs">
//                       {item.totalQuantity.toLocaleString(undefined, {
//                         maximumFractionDigits: 2,
//                         minimumFractionDigits: 2,
//                       })}
//                     </Td>
//                     <Td fontSize="xs">
//                       {item.rush ? (
//                         <Badge
//                           fontSize="9.5px"
//                           colorScheme="orange"
//                           variant="solid"
//                           className="inputCapital"
//                         >
//                           Rush
//                         </Badge>
//                       ) : (
//                         ""
//                       )}
//                     </Td>
//                   </Tr>
//                 ))
//               ) : (
//                 <Tr>
//                   <Td colSpan={8}>No data available</Td>
//                 </Tr>
//               )}
//             </Tbody>
//           </Table>
//         </PageScroll>
//       </Flex>
//     </Flex>
//   );
// };

//  OLD CODES---------------------------------------------------------------
// import React, { useEffect } from "react";
// import {
//   Badge,
//   Flex,
//   HStack,
//   Select,
//   Table,
//   Tbody,
//   Td,
//   Text,
//   Th,
//   Thead,
//   Tr,
// } from "@chakra-ui/react";
// import moment from "moment";
// import PageScroll from "../../../../utils/PageScroll";
// import { set } from "react-hook-form";

// export const ListOfMir = ({
//   mirList,
//   customers,
//   setCustomers,
//   mirIds,
//   setMirIds,
//   mirOrderList,
// }) => {
//   const mirIdHandler = (mirId, customerName) => {
//     if ((mirId, customerName)) {
//       setMirIds(mirId);
//       setCustomers(customerName);
//     } else {
//       setMirIds("");
//       setCustomers("");
//     }
//     console.log(mirIds);
//     console.log(customers);
//   };

//   // Auto select index 0
//   useEffect(() => {
//     setMirIds(mirList?.mirId);
//     setCustomers(mirList?.customerName);
//   }, [mirList]);

//   console.log(mirOrderList);

//   return (
//     <Flex w="95%" h="250px" flexDirection="column">
//       <Flex flexDirection="column">
//         <Text
//           textAlign="center"
//           bgColor="secondary"
//           color="white"
//           fontSize="13px"
//         >
//           List of Prepared Date
//         </Text>
//         <PageScroll minHeight="200px" maxHeight="210px">
//           <Table size="sm" variant="simple">
//             <Thead bgColor="secondary">
//               <Tr h="30px">
//                 <Th color="white" fontSize="10px">
//                   Line
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   MIR ID
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Ordered Date
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Date Needed
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Customer Code
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Customer Name
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Total Quantity Order
//                 </Th>
//                 <Th color="white" fontSize="10px">
//                   Status
//                 </Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {mirList?.map((item, i) => (
//                 <Tr
//                   onClick={() => mirIdHandler(item.mirId, item.customerName)}
//                   bgColor={mirIds === item.mirId ? "blue.100" : "none"}
//                   key={i}
//                   cursor="pointer"
//                 >
//                   <Td fontSize="xs">{i + 1}</Td>
//                   <Td fontSize="xs">{item.mirId}</Td>
//                   {/* <Td fontSize="xs">{item.department}</Td> */}
//                   <Td fontSize="xs">
//                     {moment(item.orderedDate).format("MM/DD/yyyy")}
//                   </Td>
//                   <Td fontSize="xs">
//                     {moment(item.dateNeeded).format("MM/DD/yyyy")}
//                   </Td>
//                   <Td fontSize="xs">{item.customerCode}</Td>
//                   <Td fontSize="xs">{item.customerName}</Td>
//                   <Td fontSize="xs">
//                     {item.totalQuantity.toLocaleString(undefined, {
//                       maximumFractionDigits: 2,
//                       minimumFractionDigits: 2,
//                     })}
//                   </Td>
//                   <Td fontSize="xs">
//                     {item.rush ? (
//                       <Badge
//                         fontSize="9.5px"
//                         colorScheme="orange"
//                         variant="solid"
//                         className="inputCapital"
//                       >
//                         Rush
//                       </Badge>
//                     ) : (
//                       ""
//                     )}
//                   </Td>
//                 </Tr>
//               ))}
//             </Tbody>
//           </Table>
//         </PageScroll>
//       </Flex>
//     </Flex>
//   );
// };