import { Flex, useMediaQuery } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import MainContent from "./MainContent";
import Header from "./Header";
import Sidebar from "./New-Sidebar";
// import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import PageScrollModalErrorList from "./PageScrollModalErrorList";
import PageScroll from "../utils/PageScroll";

const MainContainer = () => {
  const [navBarData, setNavbarData] = useState([]);
  const [isMobile] = useMediaQuery("(max-width: 1290px)");
  const [sidebarHandler, setSidebarHandler] = useState(false);

  useEffect(() => {
    setSidebarHandler(isMobile);
  }, [isMobile]);

  return (
    <Flex bgColor="form" maxHeight="100vh">
      {isMobile || sidebarHandler || <Sidebar setNavbarData={setNavbarData} />}
      <Flex flexDirection="column" width="full">
        <Header setSidebarHandler={setSidebarHandler} />
        {/* <Navbar navBarData={navBarData} /> */}
        <PageScroll maxHeight="100vh">
          <MainContent />
        </PageScroll>
      </Flex>
    </Flex>
  );
};

export default MainContainer;
