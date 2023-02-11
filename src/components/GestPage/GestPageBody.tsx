import {
  Alert,
  Box,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { FC, useState } from "react";
import calenderData from "./calenderData.json";
import eventData from "./eventData.json";
import { Button } from "../Button";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/router";
import { authClient, eventClient } from "@/service/api-client/client";
import {
  GetEventResponse,
  RegisterAnswerRequest,
} from "@/service/api-client/protocol/event_pb";
import { useSnackbar } from "notistack";

type GuestPageBodyProps = {
  eventDetail: GetEventResponse.AsObject;
};
const GuestPageBody: FC<GuestPageBodyProps> = ({ eventDetail }) => {
  const router = useRouter();

  const [CalenderBarOpen, setCalenderBarOpen] = useState<Boolean>(true);
  const [NameText, setNameText] = useState<String>("");
  const [LoginFlg, setLoginFlg] = useState<Boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  const Submit = async () => {
    const request = new RegisterAnswerRequest();
    // TODO: id取得
    request.setId(eventDetail.id);
    // TODO: トークン入れる
    request.setToken("hogehoge");
    // TODO: 答え登録
    request.setAnswer();
    eventClient
      .registerAnswer(request, null)
      .then((res) => console.log(res))
      .then(() => {
        enqueueSnackbar("回答を記録しました。", {
          autoHideDuration: 2000,
          variant: "success",
        });
        router.push("/");
      });
  };

  return (
    <>
      {/* カレンダーバー */}
      {CalenderBarOpen ? (
        <Stack
          sx={{ p: 3, pb: 0.5, bgcolor: "primary.main" }}
          style={{ overflowX: "auto", whiteSpace: "nowrap", width: "100%" }}
        >
          <Stack direction="row" spacing={1}>
            {calenderData.map((calenderInfo) => {
              return (
                <Stack
                  key={calenderInfo.id}
                  direction="column"
                  spacing={0.5}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 3,
                    minwidth: "120px",
                    height: "120px",
                    p: 2,
                  }}
                >
                  <Typography variant="caption" sx={{ textAlign: "center" }}>
                    {calenderInfo.dayNum}
                  </Typography>
                  {calenderInfo.schedule.map((scheduleInfo) => {
                    return (
                      <Stack
                        key={scheduleInfo.id}
                        sx={{
                          border: "solid",
                          borderWidth: 1,
                          borderRadius: 1,
                          borderColor: "primary.main",
                          bgcolor: "white",
                          p: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: "primary.main", lineHeight: "1.2" }}
                        >
                          {scheduleInfo.eventTitle}
                          <br />
                          {scheduleInfo.startTime}時〜{scheduleInfo.endTime}時
                        </Typography>
                      </Stack>
                    );
                  })}
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      ) : (
        <></>
      )}
      {/* カレンダーバー開閉 */}
      <Stack
        direction="row"
        justifyContent="center"
        sx={{ bgcolor: "primary.main", pb: 0.5 }}
      >
        <IconButton
          onClick={() => {
            setCalenderBarOpen(!CalenderBarOpen);
          }}
        >
          {CalenderBarOpen ? (
            <ExpandLessIcon sx={{ color: "secondary.main" }} />
          ) : (
            <ExpandMoreIcon sx={{ color: "secondary.main" }} />
          )}
        </IconButton>
      </Stack>
      {/* タイトル・名前入力 */}
      <Stack direction="column" sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ textAlign: "center", mb: 3 }}>
          {eventData.EventTitle}
        </Typography>
        <TextField
          label="表示名"
          variant="outlined"
          sx={{ mx: 7, mb: 3 }}
          value={NameText}
          onChange={(e) => {
            setNameText(e.target.value);
          }}
        />
        {/* 候補リスト */}
        <TableContainer
          sx={{
            border: "solid",
            borderWidth: 0.3,
            borderRadius: 5,
            p: 1,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="caption">日時</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption">参加</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventData.ScheduleList.map((ScheduleInfo) => {
                return (
                  <TableRow key={ScheduleInfo.id}>
                    <TableCell>
                      <Typography variant="body1">
                        {ScheduleInfo.day}
                        {ScheduleInfo.startTime}〜{ScheduleInfo.endTime}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Checkbox defaultChecked />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* 未ログイン */}
        <Box sx={{ m: 3 }}>
          {!LoginFlg ? (
            <Typography variant="caption" sx={{ textAlign: "center" }}>
              ※未ログインの為、後から予定を編集することができませんがよろしいでしょうか？
            </Typography>
          ) : (
            <></>
          )}
        </Box>
        {/* 決定 */}
        <Stack direction="row" justifyContent="center" sx={{ mx: 15 }}>
          <Button text="決定" isPrimary={true} onClick={Submit} />
        </Stack>
      </Stack>
    </>
  );
};

export default GuestPageBody;
