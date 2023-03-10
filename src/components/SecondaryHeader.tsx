import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Container } from "@mui/system";
import Head from "next/head";
import { getUserInfo } from "@/libraries/userInfo";
import { login, revokeToken } from "@/libraries/authorization";
import LogoutIcon from "@mui/icons-material/Logout";
import { FC, useState } from "react";
import { Button, Stack } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

export const SecondaryHeader: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  // booleanとして認識させたいためlint避ける
  // rome-ignore lint/complexity/useSimplifiedLogicExpression: <explanation>
  const [isLogin, setIsLogin] = useState(getUserInfo() && true);
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
        <meta name='theme-color' content='#006A71' />
      </Head>
      <AppBar
        position='static'
        sx={{ backgroundColor: "primary.main", boxShadow: 0, px: 2, py: 0.8 }}
      >
        <Container disableGutters>
          <Stack direction='row' justifyContent='space-around'>
            <IconButton edge='start' size='large' disabled>
              <AccountCircle sx={{ color: "primary.main" }} />
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
              {isLogin ? <LogoutIcon /> : <AccountCircle sx={{ color: "black" }} />}
            </IconButton>
          </Stack>
        </Container>
      </AppBar>
    </>
  );
};
