import React, { useEffect, useState } from "react";
import request from "../../../services/ApiClient";
import { CalendarList } from "./CalendarList";

const fetchForMoveOrderApi = async () => {
  const res = await request.get(`Ordering/GetAllApprovedOrdersForCalendar`);
  return res.data;
};

const CalendarPage = () => {
  const [forMOData, setForMOData] = useState([]);

  const fetchForMoveOrder = () => {
    fetchForMoveOrderApi().then((res) => {
      setForMOData(res);
    });
  };

  useEffect(() => {
    fetchForMoveOrder();

    return () => {
      setForMOData([]);
    };
  }, []);

  return <CalendarList forMOData={forMOData} />;
};

export default CalendarPage;
