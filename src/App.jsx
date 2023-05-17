import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useMediaQuery,
  useToast,
  VStack,
} from "@chakra-ui/react";
import request from "./services/ApiClient";
import { Navigate, Outlet } from "react-router-dom";
import { decodeUser } from "./services/decode-user";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastComponent } from "./components/Toast";
import { RiFileWarningFill } from "react-icons/ri";

//Component Main Container
import MainContainer from "./components/MainContainer";
import UomManagement from "./pages/setup/UomManagement";
import LotManagement from "./pages/setup/LotManagement";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import ErrorPage from "./pages/ErrorPage";
import Login from "./components/Login";
import MaterialsManagement from "./pages/setup/MaterialsManagement";
import CustomersManagement from "./pages/setup/CustomersManagement";
import SuppliersManagement from "./pages/setup/SuppliersManagement";
import ItemCategory from "./pages/setup/ItemCategory";
import { Context } from "./components/context/Context";

//LANDING PAGE
import UserManagementPage from "./UserManagementPage";
import SetupManagementPage from "./SetupManagementPage";
import LotCategory from "./pages/setup/LotCategory";
import CustomerType from "./pages/setup/CustomerType";
import ReasonManagement from "./pages/setup/ReasonManagement";
import CompanyManagement from "./pages/account_title/CompanyManagement";

import UserAccount from "./pages/user_management/UserAccount";
import UserRole from "./pages/user_management/UserRole";
import ModuleManagement from "./pages/user_management/ModuleManagement";
import MenuManagement from "./pages/user_management/MenuManagement";

// Account Title
import AccTDepartment from "./pages/setup/AccTDepartment";
import AccTLocation from "./pages/setup/AccTLocation";
import AccTAccount from "./pages/setup/AccTAccount";
import ImportPage from "./ImportPage";
import ImportPO from "./pages/import/ImportPO";
import ReceivingModule from "./ReceivingModule";
import WarehouseReceiving from "./pages/receiving/WarehouseReceiving";
import CancelledPO from "./pages/receiving/CancelledPO";
import ReceivedMaterials from "./pages/receiving/ReceivedMaterials";
import ApprovalRejectMaterials from "./pages/receiving/ApprovalRejectMaterials";
import WarehouseConfirmReject from "./pages/receiving/WarehouseConfirmReject";
import ItemSubCategory from "./pages/setup/ItemSubCategory";
import OrderingPage from "./OrderingPage";
import Orders from "./pages/ordering/orders/Orders";
import ImportOrder from "./pages/import/import_orders/ImportOrder";
import PreparationSchedule from "./pages/ordering/preparation_schedule/PreparationSchedule";
import ApprovalPage from "./pages/ordering/approval/ApprovalPage";
import CalendarPage from "./pages/ordering/calendar/CalendarPage";
import InventoryPage from "./InventoryPage";
import MoveOrderPage from "./MoveOrderPage";
import MoveOrder from "./pages/inventory/MoveOrder";
import ForApprovalMo from "./pages/move_order/forapprovalmo/ForApprovalMo";
import MrpPage from "./pages/inventory/mrp/MrpPage";
import ApprovedMoPage from "./pages/move_order/approvedmo/ApprovedMoPage";
import RejectMoveOrder from "./pages/move_order/reject_moveorder/RejectMoveOrder";
import TransactMoveOrderPage from "./pages/move_order/transact_moveorder/TransactMoveOrderPage";
import MiscellaneousTransactions from "./MiscellaneousTransactions";
import MiscReceiptPage from "./pages/misc_transactions/misc_receipt/MiscReceiptPage";
import MiscIssuePage from "./pages/misc_transactions/misc_issue/MiscIssuePage";
import { useEffect } from "react";
import { FcHighPriority } from "react-icons/fc";
import BorrowedTransactionPage from "./BorrowedTransactionPage";
import BorrowedMaterialsPage from "./pages/borrowed_transaction/BorrowedMaterialsPage";
import ReportsPage from "./ReportsPage";
import Reports from "./pages/reports/Reports";
import SupplierNew from "./pages/setup/suppliers_new/SupplierNew";
import CustomerNew from "./pages/setup/customer_new/CustomerNew";
import TransactionType from "./pages/setup/TransactionType";

const App = () => {
  const [menu, setMenu] = useState(null);
  const user = decodeUser();

  //Miscellaneous Issue Fetch and Cancel Feature
  const [miscData, setMiscData] = useState([]);
  const [navigation, setNavigation] = useState("");

  //Borrowed Mats Fetch and Cancel Feature
  const [borrowedData, setBorrowedData] = useState([]);
  const [borrowedNav, setBorrowedNav] = useState("");

  //Get Added Misc Issues per Item
  const userId = user?.id;
  const fetchActiveMiscIssuesApi = async (userId) => {
    const res = await request.get(
      `Miscellaneous/GetAllActiveMiscellaneousIssueTransaction?empId=${userId}`
    );
    return res.data;
  };

  //Get Added Borrowed per Item
  const borrowedUserId = user?.id;
  const fetchActiveBorrowedApi = async (borrowedUserId) => {
    const res = await request.get(
      `Borrowed/GetAllActiveBorrowedIssueTransaction?empId=${borrowedUserId}`
    );
    return res.data;
  };

  //Misc Issue Data
  const fetchActiveMiscIssues = () => {
    fetchActiveMiscIssuesApi(userId).then((res) => {
      setMiscData(res);
    });
  };
  useEffect(() => {
    fetchActiveMiscIssues();

    return () => {
      setMiscData([]);
    };
  }, [userId]);

  //Misc Issue Data
  const fetchActiveBorrowed = () => {
    fetchActiveBorrowedApi(borrowedUserId).then((res) => {
      setBorrowedData(res);
    });
  };
  useEffect(() => {
    fetchActiveBorrowed();

    return () => {
      setBorrowedData([]);
    };
  }, [borrowedUserId]);

  // console.log(user)
  // Open modal to cancel all ID on table if re-routed without saving
  const {
    isOpen: isArrayCancel,
    onClose: closeArrayCancel,
    onOpen: openArrayCancel,
  } = useDisclosure();
  const path = useLocation();
  const pathMiscIssue = "/miscellaneous/misc-issue";
  useEffect(() => {
    if (path.pathname !== pathMiscIssue && miscData?.length > 0) {
      openArrayCancel();
    }
  }, [path.pathname !== pathMiscIssue]);

  // Open modal to cancel all ID on table if re-routed without saving (Borrowed Transaction)
  const {
    isOpen: isArrayBorrowedCancel,
    onClose: closeArrayBorrowedCancel,
    onOpen: openArrayBorrowedCancel,
  } = useDisclosure();
  const pathBorrowed = useLocation();
  const pathBorrowedMats = "/borrowed/borrowed-materials";
  useEffect(() => {
    if (
      pathBorrowed.pathname !== pathBorrowedMats &&
      borrowedData?.length > 0
    ) {
      openArrayBorrowedCancel();
    }
  }, [pathBorrowed.pathname !== pathBorrowedMats]);

  return (
    <Context.Provider value={{ menu, setMenu }}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<MainContainer />}>
            {/* SETUP */}
            <Route path="/setup" element={<SetupManagementPage />}>
              <Route path="/setup/uom" element={<UomManagement />} />
              <Route
                path="/setup/materials"
                element={<MaterialsManagement />}
              />
              <Route path="/setup/item-category" element={<ItemCategory />} />
              <Route
                path="/setup/item-subcategory"
                element={<ItemSubCategory />}
              />
              <Route path="/setup/suppliers" element={<SupplierNew />} />
              <Route path="/setup/customers" element={<CustomerNew />} />
              <Route path="/setup/customer-type" element={<CustomerType />} />
              <Route path="/setup/lot-name" element={<LotManagement />} />
              <Route path="/setup/lot-section" element={<LotCategory />} />
              <Route path="/setup/reasons" element={<ReasonManagement />} />
              <Route
                path="/setup/transaction-type"
                element={<TransactionType />}
              />
              <Route
                path="/setup/account_title-company"
                element={<CompanyManagement />}
              />
              <Route
                path="/setup/account_title-department"
                element={<AccTDepartment />}
              />
              <Route
                path="/setup/account_title-location"
                element={<AccTLocation />}
              />
              <Route
                path="/setup/account_title-account"
                element={<AccTAccount />}
              />
            </Route>

            {/* USER */}
            <Route path="/user" element={<UserManagementPage />}>
              <Route path="/user/user-account" element={<UserAccount />} />
              <Route path="/user/user-role" element={<UserRole />} />
              <Route
                path="/user/module-management"
                element={<ModuleManagement />}
              />
              <Route
                path="/user/menu-management"
                element={<MenuManagement />}
              />
            </Route>

            {/* IMPORT */}
            <Route path="/import" element={<ImportPage />}>
              <Route path="/import/import-po" element={<ImportPO />} />
              <Route path="/import/import-order" element={<ImportOrder />} />
            </Route>

            {/* RECEIVING */}
            <Route path="/receiving" element={<ReceivingModule />}>
              <Route
                path="/receiving/warehouse-receiving"
                element={<WarehouseReceiving />}
              />
              <Route path="/receiving/cancelled-po" element={<CancelledPO />} />
              <Route
                path="/receiving/received-materials"
                element={<ReceivedMaterials />}
              />
              <Route
                path="/receiving/approval-rejectmaterials"
                element={<ApprovalRejectMaterials />}
              />
              <Route
                path="/receiving/warehouse-confirmreject"
                element={<WarehouseConfirmReject />}
              />
            </Route>

            {/* ORDERING */}
            <Route path="/ordering" element={<OrderingPage />}>
              <Route path="/ordering/orders" element={<Orders />} />
              <Route
                path="/ordering/preparation"
                element={<PreparationSchedule />}
              />{" "}
              <Route path="/ordering/approval" element={<ApprovalPage />} />
              <Route path="/ordering/calendar" element={<CalendarPage />} />
            </Route>

            {/* INVENTORY */}
            <Route path="/inventory" element={<InventoryPage />}>
              <Route path="/inventory/mrp" element={<MrpPage />} />
            </Route>

            {/* MOVE ORDER */}
            <Route path="/move-order" element={<MoveOrderPage />}>
              <Route path="/move-order/mo-issue" element={<MoveOrder />} />
              <Route
                path="/move-order/forapprovalmo"
                element={<ForApprovalMo />}
              />
              <Route
                path="/move-order/approved-mo"
                element={<ApprovedMoPage />}
              />
              <Route
                path="/move-order/reject-mo"
                element={<RejectMoveOrder />}
              />
              <Route
                path="/move-order/transact-moveorder"
                element={<TransactMoveOrderPage />}
              />
            </Route>

            {/* MISCELLANEOUS */}
            <Route
              path="/miscellaneous"
              element={<MiscellaneousTransactions />}
            >
              <Route
                path="/miscellaneous/misc-receipt"
                element={<MiscReceiptPage />}
              />
              <Route
                path="/miscellaneous/misc-issue"
                element={
                  user ? (
                    <MiscIssuePage
                      miscData={miscData}
                      fetchActiveMiscIssues={fetchActiveMiscIssues}
                      navigation={navigation}
                      setNavigation={setNavigation}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Route>

            {/* BORROWED MATERIALS */}
            <Route path="/borrowed" element={<BorrowedTransactionPage />}>
              <Route
                path="/borrowed/borrowed-materials"
                element={
                  user ? (
                    <BorrowedMaterialsPage
                      borrowedData={borrowedData}
                      fetchActiveBorrowed={fetchActiveBorrowed}
                      borrowedNav={borrowedNav}
                      setBorrowedNav={setBorrowedNav}
                    />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Route>

            {/* REPORTS */}
            <Route path="/reports" element={<ReportsPage />}>
              <Route path="/reports/report-details" element={<Reports />} />
            </Route>

            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Route>
      </Routes>

      {isArrayCancel && (
        <CancelArrayModalConfirmation
          isOpen={isArrayCancel}
          onClose={closeArrayCancel}
          miscData={miscData}
          fetchActiveMiscIssues={fetchActiveMiscIssues}
          setNavigation={setNavigation}
        />
      )}

      {isArrayBorrowedCancel && (
        <CancelBorrowedArrayModalConfirmation
          isOpen={isArrayBorrowedCancel}
          onClose={closeArrayBorrowedCancel}
          borrowedData={borrowedData}
          fetchActiveBorrowed={fetchActiveBorrowed}
          setBorrowedNav={setBorrowedNav}
        />
      )}
    </Context.Provider>
  );
};

export default App;

//Misc Issue Cancel Array
const CancelArrayModalConfirmation = ({
  isOpen,
  onClose,
  miscData,
  fetchActiveMiscIssues,
  setNavigation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const cancelArraySubmitHandler = () => {
    setIsLoading(true);
    try {
      const cancelArray = miscData?.map((item) => {
        return {
          id: item.id,
        };
      });
      const res = request
        .put(`Miscellaneous/CancelItemCodeInMiscellaneousIssue`, cancelArray)
        .then((res) => {
          ToastComponent(
            "Warning",
            "Items has been cancelled",
            "success",
            toast
          );
          fetchActiveMiscIssues();
          onClose();
        })
        .catch((err) => {
          // ToastComponent("Error", "Item was not cancelled", "Error", toast)
        });
    } catch (error) {}
  };

  const noHandler = () => {
    setNavigation(1);
    navigate("/miscellaneous/misc-issue");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.50" pt={10} pb={5}>
        <ModalHeader>
          <VStack justifyContent="center">
            <FcHighPriority fontSize="50px" />
            <Text color="warning" textAlign="center" fontSize="lg">
              [Warning]
            </Text>
            <Text color="warning" textAlign="center" fontSize="sm">
              [Miscellaneous Issue]
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton onClick={noHandler} />

        <ModalBody mb={5}>
          <VStack spacing={0}>
            <Text textAlign="center" fontSize="sm">
              Your created lists will be cancelled.
            </Text>
            <Text textAlign="center" fontSize="xs">
              Are you sure you want to leave this page?
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button
              size="sm"
              onClick={cancelArraySubmitHandler}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="blue"
            >
              Yes
            </Button>
            <Button
              size="sm"
              onClick={noHandler}
              isLoading={isLoading}
              colorScheme="blackAlpha"
            >
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

//Borrowed Cancel Array
const CancelBorrowedArrayModalConfirmation = ({
  isOpen,
  onClose,
  borrowedData,
  fetchActiveBorrowed,
  setBorrowedNav,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigateBorrowed = useNavigate();

  const cancelArraySubmitHandler = () => {
    setIsLoading(true);
    try {
      const cancelArray = borrowedData?.map((item) => {
        return {
          id: item.id,
        };
      });
      const res = request
        .put(`Borrowed/CancelItemForTransactBorrow`, cancelArray)
        .then((res) => {
          ToastComponent(
            "Warning",
            "Items has been cancelled",
            "success",
            toast
          );
          fetchActiveBorrowed();
          onClose();
        })
        .catch((err) => {
          // ToastComponent("Error", "Item was not cancelled", "Error", toast)
        });
    } catch (error) {}
  };

  const noHandler = () => {
    setBorrowedNav(1);
    navigateBorrowed("/borrowed/borrowed-materials");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.50" pt={10} pb={5}>
        <ModalHeader>
          <VStack justifyContent="center">
            <FcHighPriority fontSize="50px" />
            <Text color="warning" textAlign="center" fontSize="lg">
              [Warning]
            </Text>
            <Text color="warning" textAlign="center" fontSize="sm">
              [Borrowed Materials]
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton onClick={noHandler} />

        <ModalBody mb={5}>
          <VStack spacing={0}>
            <Text textAlign="center" fontSize="sm">
              Your created lists will be cancelled.
            </Text>
            <Text textAlign="center" fontSize="xs">
              Are you sure you want to leave this page?
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="center">
          <ButtonGroup>
            <Button
              size="sm"
              onClick={cancelArraySubmitHandler}
              isLoading={isLoading}
              disabled={isLoading}
              colorScheme="blue"
            >
              Yes
            </Button>
            <Button
              size="sm"
              onClick={noHandler}
              isLoading={isLoading}
              colorScheme="blackAlpha"
            >
              No
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
