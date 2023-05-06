import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
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
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { RiFileList3Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import { ToastComponent } from "../../../components/Toast";
import request from "../../../services/ApiClient";
import PageScroll from "../../../utils/PageScroll";

import axios from "axios";
import { ListOfCustomers } from "./ListOfCustomers";

const fetchGenusApi = async () => {
  // const fromDateFormatted = moment(fromDate).format("yyyy-MM-DD");
  // const toDateFormatted = moment(toDate).format("yyyy-MM-DD");
  const res = await axios.get(
    `http://pretestomega.rdfmis.ph/genus-etd/backend/public/api/customer`,
    {
      headers: {
        Authorization: "Bearer " + process.env.REACT_APP_GENUS_TOKEN,
      },
    }
  );
  return res.data;
};

// FETCH API REASON:
const fetchElixirApi = async () => {
  const response = await request.get(
    `https://localhost:7151/api/Customer/GetAllCustomerWithPagination/true?PageNumber=1&PageSize=4000`
  );

  return response.data;
};

const CustomerNew = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [genusCustomers, setGenusCustomers] = useState([]);
  const [elixirCustomers, setElixirCustomers] = useState([]);
  const [search, setSearch] = useState("");

  // GET GENUS SUPPLIERS
  const fetchGenusCustomer = () => {
    fetchGenusApi().then((res) => {
      setGenusCustomers(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchGenusCustomer();

    return () => {
      setGenusCustomers([]);
    };
  }, []);

  // GET ELIXIR SUPPLIERS
  const fetchElixirCustomers = () => {
    fetchElixirApi().then((res) => {
      setElixirCustomers(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchElixirCustomers();

    return () => {
      setElixirCustomers([]);
    };
  }, []);

  //console.log(elixirCustomers);

  return (
    <ListOfCustomers
      fetchElixirCustomers={fetchElixirCustomers}
      elixirCustomers={elixirCustomers}
      setElixirCustomers={setElixirCustomers}
      genusCustomers={genusCustomers}
      setGenusCustomers={setGenusCustomers}
      search={search}
      fetchingData={isLoading}
    />
  );
};

export default CustomerNew;