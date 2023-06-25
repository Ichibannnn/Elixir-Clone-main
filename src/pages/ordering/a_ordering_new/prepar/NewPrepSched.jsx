import React, { useState, useEffect } from "react";
import { Box, Flex, Stack, VStack } from "@chakra-ui/react";
import request from "../../../../services/ApiClient";
import { ListOfOrders } from "./ListOfOrders";
import { ListOfMir } from "./ListOfMir";

const NewPrepSched = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [status, setStatus] = useState(false);
  const [selectedMIRIds, setSelectedMIRIds] = useState([]);
  const [search, setSearch] = useState();

  const [mirList, setMirList] = useState([]);
  const [rushOrders, setRushOrders] = useState([]);
  const [regularOrders, setRegularOrders] = useState([]);
  const [regularOrdersCount, setRegularOrdersCount] = useState(0);
  const [rushOrdersCount, setRushOrdersCount] = useState(0);

  const [lengthIndicator, setLengthIndicator] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);

  const [isAllChecked, setIsAllChecked] = useState(false);
  const [disableScheduleButton, setDisableScheduleButton] = useState(true);

  // Fetch customer names with pagination
  const fetchCustomerList = async () => {
    try {
      const response = await request.get(
        `Ordering/GetAllListofOrdersPaginationOrig?PageNumber=1&PageSize=20000`
      );
      setCustomerList(response.data);
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };

  // Fetch MIR IDs based on customer name and status
  const fetchMirList = async () => {
    try {
      const response = await request.get(
        `Ordering/GetAllListOfMir?customer=${customerName}&status=${status}&listofMirIds=${selectedMIRIds.join(
          "&listofMirIds="
        )}`
      );
      setMirList(response.data);

      const rushOrdersList = response.data.filter((mir) => mir.status);
      const newRushOrders = rushOrdersList.filter(
        (mir) => !rushOrders.find((order) => order.mirId === mir.mirId)
      );
      setRushOrders(rushOrdersList);
      setRushOrdersCount(newRushOrders.length);

      const regularOrdersList = response.data.filter((mir) => !mir.status);
      const newRegularOrders = regularOrdersList.filter(
        (mir) => !regularOrders.find((order) => order.mirId === mir.mirId)
      );
      setRegularOrders(regularOrdersList);
      setRegularOrdersCount(newRegularOrders.length);
    } catch (error) {
      console.error("Error fetching MIR list:", error);
    }
  };

  useEffect(() => {
    fetchCustomerList();
  }, []);

  useEffect(() => {
    if (customerName) {
      fetchMirList();
    }
  }, [customerName, selectedMIRIds, status]);

  // useEffect(() => {
  //   if (mirList.length !== 0) {
  //     setCustomerName("");
  //   }
  // }, [mirList.length, setCustomerName]);

  // useEffect(() => {
  //   if (customerName) {
  //     if (mirList?.length === 0) {
  //       setCustomerName("");
  //       fetchMirList();
  //       // fetchOrders();
  //     }
  //   }
  // }, [mirList, customerName]);

  // console.log(mirList?.length);

  return (
    <Flex
      color="fontColor"
      w="full"
      flexDirection="column"
      p={2}
      bg="form"
      boxShadow="md"
    >
      <VStack w="full">
        <ListOfMir
          customerName={customerName}
          setCustomerName={setCustomerName}
          status={status}
          setStatus={setStatus}
          selectedMIRIds={selectedMIRIds}
          setSelectedMIRIds={setSelectedMIRIds}
          customerList={customerList}
          setCustomerList={setCustomerList}
          mirList={mirList}
          regularOrdersCount={regularOrdersCount}
          rushOrdersCount={rushOrdersCount}
          isAllChecked={isAllChecked}
          setIsAllChecked={setIsAllChecked}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          setDisableScheduleButton={setDisableScheduleButton}
          search={search}
          setSearch={setSearch}
        />

        <ListOfOrders
          customerName={customerName}
          setCustomerName={setCustomerName}
          selectedMIRIds={selectedMIRIds}
          setSelectedMIRIds={setSelectedMIRIds}
          fetchCustomerList={fetchCustomerList}
          fetchMirList={fetchMirList}
          isAllChecked={isAllChecked}
          setIsAllChecked={setIsAllChecked}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          disableScheduleButton={disableScheduleButton}
          setDisableScheduleButton={setDisableScheduleButton}
        />
      </VStack>
    </Flex>
  );
};

export default NewPrepSched;

// NEWEST CODES ========================================================
// import React, { useState, useEffect } from "react";
// import { Box, Flex, Stack, VStack } from "@chakra-ui/react";
// import request from "../../../../services/ApiClient";
// import { ListOfOrders } from "./ListOfOrders";
// import { ListOfMir } from "./ListOfMir";

// const NewPrepSched = () => {
//   const [customers, setCustomers] = useState("Swine Breeder Farms");
//   const [mirIds, setMirIds] = useState("");
//   const [mirList, setMirList] = useState([]);
//   const [mirOrderList, setmirOrderList] = useState([]);
//   const [status, setStatus] = useState(false);
//   const [selectedMirIds, setSelectedMirIds] = useState({});

//   // MIR List
//   useEffect(() => {
//     const fetchMIRList = async () => {
//       try {
//         const res = await request.get(
//           `Ordering/GetAllListOfMir?customer=${customers}&status=${status}`
//         );
//         console.log(res.data); // Add this line
//         setMirList(res.data);
//       } catch (error) {
//         console.error("Error fetching MIR list:", error);
//       }
//     };

//     fetchMIRList();
//   }, [customers, status]);

//   // MIR Order List
//   useEffect(() => {
//     const fetchMirOrderList = async () => {
//       try {
//         const response = await request.get(
//           `Ordering/GetAllListOfMirOrdersByMirIds?customerName=${customers}&listofMirIds=${encodeURIComponent(
//             JSON.stringify(mirIds)
//           )}`
//         );
//         setmirOrderList(response.data);

//         console.log(response.data);
//       } catch (error) {
//         console.error("Error fetching MIR order list:", error);
//       }
//     };

//     fetchMirOrderList();
//   }, [customers]); // Add customers as a dependency

//   const mirIdHandler = (mirId, customerName) => {
//     if (mirId && customerName) {
//       setMirIds(mirId);
//       setCustomers(customerName);
//     } else {
//       setMirIds("");
//       setCustomers("");
//     }
//   };

//   return (
//     <Flex
//       color="fontColor"
//       w="full"
//       flexDirection="column"
//       p={2}
//       bg="form"
//       boxShadow="md"
//     >
//       <VStack w="full">
//         <ListOfMir
//           mirList={mirList}
//           customers={customers}
//           setCustomers={setCustomers}
//           mirIds={mirIds}
//           setMirIds={setMirIds}
//           handleMirSelection={mirIdHandler}
//           selectedMirIds={selectedMirIds}
//           setSelectedMirIds={setSelectedMirIds}
//         />

//         <ListOfOrders
//           mirOrderList={mirOrderList}
//           customers={customers}
//           setCustomers={setCustomers}
//           selectedMirIds={selectedMirIds}
//         />
//       </VStack>
//     </Flex>
//   );
// };

// export default NewPrepSched;

// OLD CODE------------------------------------------------------------
// import React, { useState, useEffect } from "react";
// import { Box, Flex, Stack, VStack } from "@chakra-ui/react";
// import request from "../../../../services/ApiClient";
// import { ListOfOrders } from "./ListOfOrders";
// import { ListOfMir } from "./ListOfMir";

// // FETHC CUSTOMER API
// const fetchCustomerApi = async () => {
//   const res = await request.get(
//     `Ordering/GetAllListofOrdersPaginationOrig?pageNumber=${2000}&pageSize=${1}`
//   );
//   return res.data;
// };

// const NewPrepSched = () => {
//   const [customers, setCustomers] = useState("Swine Breeder Farms");
//   const [mirIds, setMirIds] = useState("");
//   const [mirList, setMirList] = useState([]);
//   const [mirOrderList, setmirOrderList] = useState([]);
//   const [status, setStatus] = useState(false);

//   // MIR List
//   useEffect(() => {
//     const fetchMIRList = async () => {
//       try {
//         const res = await request.get(
//           `Ordering/GetAllListOfMir?customer=${customers}&status=${status}`
//         );
//         setMirList(res.data);
//       } catch (error) {
//         console.error("Error fetching MIR list:", error);
//       }
//     };

//     fetchMIRList();
//   }, []);

//   // MIR Order List
//   useEffect(() => {
//     const fetchMirOrderList = async () => {
//       try {
//         const response = await request.get(
//           `Ordering/GetAllListOfMirOrdersByMirIds?customerName=${customers}&listofMirIds=${encodeURIComponent(
//             JSON.stringify(mirIds)
//           )}`
//         );
//         setmirOrderList(response.data);

//         console.log(response.data);
//       } catch (error) {
//         console.error("Error fetching MIR order list:", error);
//       }
//     };

//     fetchMirOrderList();
//   }, []);

//   return (
//     <Flex
//       color="fontColor"
//       w="full"
//       flexDirection="column"
//       p={2}
//       bg="form"
//       boxShadow="md"
//     >
//       <VStack w="full">
//         <ListOfMir
//           mirList={mirList}
//           customers={customers}
//           setCustomers={setCustomers}
//           mirIds={mirIds}
//           setMirIds={setMirIds}
//         />

//         <ListOfOrders
//           mirOrderList={mirOrderList}
//           customers={customers}
//           setCustomers={setCustomers}
//         />
//       </VStack>
//     </Flex>
//   );
// };

// export default NewPrepSched;
