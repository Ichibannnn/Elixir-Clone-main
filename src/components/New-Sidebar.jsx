import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import request from "../services/ApiClient";
import { decodeUser } from "../services/decode-user";
import { Context } from "./context/Context";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import PageScroll from "../utils/PageScroll";

const currentUser = decodeUser();

const fetchTagModuleApi = async () => {
  const currentSelectedRole = currentUser?.role;
  const res = await request.get(
    `Role/GetRoleModuleWithId/${currentSelectedRole}`
  );
  // console.log(res.data);
  return res.data;
};

//Main
const Sidebar = () => {
  return (
    <Flex
      h="100vh"
      width="15rem"
      bg="primary"
      color="#D1D2D5"
      justifyContent="space-between"
      flexDirection="column"
    >
      <Flex flexDirection="column" w="full">
        <SidebarHeader />
        <SidebarList />
      </Flex>
      <SidebarFooter />
    </Flex>

    // <div>Sidebar</div>
  );
};

export default Sidebar;

//Navigation
const SidebarList = () => {
  const { pathname } = useLocation();
  const [tagModules, setTagModules] = useState([]);
  const { menu, setMenu } = useContext(Context);

  const fetchTagged = () => {
    fetchTagModuleApi(tagModules).then((res) => {
      const unique = [];
      const map = new Map();
      for (const item of res) {
        if (!map.has(item.mainMenuId)) {
          map.set(item.mainMenuId, true);
          const submenu = res.filter(
            (s) =>
              s.mainMenuId === item.mainMenuId && s.subMenu !== item.mainMenu
          );
          unique.push({
            mainMenuId: item.mainMenuId,
            mainMenu: item.mainMenu,
            path: item.menuPath,
            subMenu: submenu.map((sub) => {
              return {
                title: sub.subMenu,
                path: sub.moduleName,
              };
            }),
          });
        }
      }
      setTagModules(unique);
    });

    // console.log(tagModules);
  };

  useEffect(() => {
    fetchTagged();

    return () => {
      setTagModules([]);
    };
  }, []);

  return (
    <Flex w="full">
      <Accordion allowToggle w="full">
        {tagModules?.map((sidebarMenu) => (
          <AccordionItem
            key={sidebarMenu.path}
            border="none"
            // boxShadow={
            //   pathname.includes(sidebarMenu.path)
            //     ? "0px 3px 10px 0px rgba(40,40,43,1)"
            //     : "none"
            // }
            bgColor={pathname.includes(sidebarMenu.path) ? "accent" : ""}
            fontWeight="semibold"
            color="white"
          >
            <AccordionButton
              onClick={() => setMenu(sidebarMenu.subMenu)}
              w="full"
              justifyContent="space-between"
              color="white"
              fontSize="xs"
            >
              <Text fontWeight="semibold" textAlign="start" color="white">
                {sidebarMenu.mainMenu}
              </Text>
              <AccordionIcon color="white" />
            </AccordionButton>
            {/* </Link> */}
            <AccordionPanel bgColor="secondary" p={2}>
              <PageScroll minHeight="auto" maxHeight="160px">
                {menu?.map((sub, i) => (
                  <Link to={sub.path} key={sub.path}>
                    <Box w="full" justifyContent="start" cursor="pointer">
                      <Text
                        p={1}
                        m={1}
                        fontSize="xs"
                        bgColor={
                          pathname.includes(sub.path) ? "blue.600" : "secondary"
                        }
                        textAlign="left"
                        borderStyle={
                          pathname.includes(sub.path) ? "groove" : "dashed"
                        }
                        _focus={{ bg: "buttonColor" }}
                        _hover={{
                          bg: "whiteAlpha.200",
                          color: "white",
                        }}
                      >
                        {sub.title}
                      </Text>
                    </Box>
                  </Link>
                ))}
              </PageScroll>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Flex>
  );
};

//Header
const SidebarHeader = () => {
  return (
    <Flex
      h="150px"
      flexDirection="column"
      alignItems="center"
      gap={1}
      mt={3}
      pt={2}
    >
      <Image
        boxSize="100px"
        objectFit="cover"
        src="/images/elixirlogos.png"
        alt="etheriumlogo"
        mt={1}
      />
      <Text className="logo-title" mt={-1}>
        ELIXIR ETD
      </Text>
    </Flex>
  );
};

//Footer
const SidebarFooter = () => {
  return (
    <Flex h="40px" fontSize="10px" textAlign="center" p={2}>
      © 2023, Elixir ETD Powered by Process Automation (MIS)
    </Flex>
  );
};
