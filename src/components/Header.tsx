import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { login, revokeToken } from "@/libraries/authorization";
import { getUserInfo } from "@/libraries/userInfo";
import { Button, Container } from "@mui/material";
import Head from "next/head";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import Image from "next/image";
import { Stack } from "@mui/system";
import { useRouter } from "next/router";

export const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(!!getUserInfo());
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    if (getUserInfo()) {
      revokeToken().then(() => setIsLogin(false));
    } else {
      login();
    }
    setAnchorEl(event.currentTarget);
  };
  return (
    <>
      <Head>
        <meta name='theme-color' content='#FFFFDD' />
      </Head>
      <AppBar
        position='static'
        sx={{ backgroundColor: "secondary.main", boxShadow: 0, px: 2, py: 0.8 }}
      >
        <Container disableGutters>
          <Stack direction='row' justifyContent='space-around'>
            <IconButton edge='start' size='large' disabled>
              <AccountCircle sx={{ color: "secondary.main" }} />
            </IconButton>
            <Button onClick={() => router.push("/")}>
              <Image
                src={"/images/logo.png"}
                alt={"logo"}
                height={40}
                width={200}
                style={{ objectFit: "contain" }}
              />
            </Button>
            <IconButton edge='end' size='large' color='inherit' onClick={handleMenu}>
              {isLogin ? (
                <>
                  <LogoutIcon sx={{ color: "black" }} />
                </>
              ) : (
                <AccountCircle sx={{ color: "black" }} />
              )}
            </IconButton>
          </Stack>
        </Container>
      </AppBar>
    </>
  );
};
