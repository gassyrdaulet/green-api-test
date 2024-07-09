import {
  Box,
  TextField,
  Grid,
  Card,
  Typography,
  Button,
  Switch,
  InputAdornment,
  OutlinedInput,
  FormControl,
  InputLabel,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useCallback, useEffect, useMemo } from "react";
import Chapter from "./Chapter";
import ReactJson from "react-json-view";
import { getSettings, getState, sendFile, sendMessage } from "./Api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const noIdOrTokenText = "Сперва заполните «idInstance» и «ApiTokenInstance»";

function App() {
  const [saveData, setSaveData] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [phone1, setPhone1] = useState("");
  const [domen1, setDomen1] = useState("@c.us");
  const [messageText, setMessageText] = useState("");
  const [phone2, setPhone2] = useState("");
  const [domen2, setDomen2] = useState("@c.us");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});

  useEffect(() => {
    const savedIdInstance = localStorage.getItem("idInstance");
    const savedApiTokenInstance = localStorage.getItem("ApiTokenInstance");
    const savedSaveData = localStorage.getItem("saveData");
    setIdInstance(savedIdInstance ? savedIdInstance : "");
    setApiTokenInstance(savedApiTokenInstance ? savedApiTokenInstance : "");
    setSaveData(savedSaveData === "true");
  }, []);

  const noIdOrToken = useMemo(
    () => !idInstance || !apiTokenInstance,
    [idInstance, apiTokenInstance]
  );

  const handleChangeIdInstance = useCallback(
    (e) => {
      const { value } = e.target;
      setIdInstance(value);
      if (saveData) localStorage.setItem("idInstance", value);
    },
    [saveData]
  );

  const handleChangeApiTokenInstance = useCallback(
    (e) => {
      const { value } = e.target;
      setApiTokenInstance(value);
      if (saveData) localStorage.setItem("ApiTokenInstance", value);
    },
    [saveData]
  );

  const handleChangeSaveData = useCallback(
    (e) => {
      const { checked } = e.target;
      setSaveData(checked);
      localStorage.setItem("saveData", String(checked));
      if (!checked) {
        localStorage.removeItem("idInstance");
        localStorage.removeItem("ApiTokenInstance");
      } else {
        localStorage.setItem("idInstance", idInstance);
        localStorage.setItem("ApiTokenInstance", apiTokenInstance);
      }
    },
    [idInstance, apiTokenInstance]
  );

  return (
    <Box
      sx={{
        py: 5,
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#eee",
      }}
    >
      <Typography variant="h3" sx={{ mb: 1, textAlign: "center" }}>
        GREEN API TEST
      </Typography>
      <Card
        sx={{
          m: 0,
          display: "flex",
          minHeight: "50vh",
          p: "30px",
          width: "Calc(95% - 60px)",
          maxWidth: "800px",
          minWidth: "250px",
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} height={"931.5px"}>
            <Chapter label="Данные Instance" sx={{ mb: 6 }}>
              <TextField
                disabled={loading}
                value={idInstance}
                onChange={handleChangeIdInstance}
                fullWidth
                autoComplete="off"
                sx={{ mb: 1 }}
                size="small"
                label="idInstance"
              />
              <FormControl size="small" fullWidth autoComplete="off">
                <InputLabel>ApiTokenInstance</InputLabel>
                <OutlinedInput
                  disabled={loading}
                  autoComplete="new-password"
                  type={showToken ? "text" : "password"}
                  value={apiTokenInstance}
                  onChange={handleChangeApiTokenInstance}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        disabled={loading}
                        onClick={() => setShowToken(!showToken)}
                      >
                        {showToken ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  sx={{ mb: 1 }}
                  size="small"
                  label="ApiTokenInstance"
                />
              </FormControl>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Switch
                  disabled={loading}
                  color="success"
                  checked={saveData}
                  onChange={handleChangeSaveData}
                />
                <Typography variant="caption">Сохранить данные</Typography>
              </Box>
            </Chapter>
            <Chapter
              label="Получение основной информации"
              sx={{ mb: 6 }}
              tip={noIdOrToken && noIdOrTokenText}
            >
              <Button
                color="success"
                onClick={() =>
                  getSettings(
                    setLoading,
                    idInstance,
                    apiTokenInstance,
                    setResponse
                  )
                }
                disabled={loading || noIdOrToken}
                sx={{ mb: 2, textTransform: "none" }}
                fullWidth
                variant="contained"
              >
                getSettings
              </Button>
              <Button
                onClick={() =>
                  getState(
                    setLoading,
                    idInstance,
                    apiTokenInstance,
                    setResponse
                  )
                }
                disabled={loading || noIdOrToken}
                sx={{ textTransform: "none" }}
                fullWidth
                color="success"
                variant="contained"
              >
                getStateInstance
              </Button>
            </Chapter>
            <Chapter
              label="Отправить текст. сообщение"
              sx={{ mb: 6 }}
              tip={noIdOrToken && noIdOrTokenText}
            >
              <Box sx={{ mb: 1, display: "flex" }}>
                <TextField
                  disabled={loading || noIdOrToken}
                  value={phone1}
                  autoComplete="off"
                  onChange={(e) => setPhone1(e.target.value)}
                  size="small"
                  label="Номер телефона"
                  sx={{ width: "100%" }}
                />
                <FormControl
                  size="small"
                  sx={{ height: "100%", minWidth: "100px", ml: 1 }}
                >
                  <Select
                    sx={{
                      textAlign: "center",
                      minWidth: "60px",
                      height: "100%",
                    }}
                    size="small"
                    disabled={loading || noIdOrToken}
                    value={domen1}
                    onChange={(e) => setDomen1(e.target.value)}
                  >
                    <MenuItem value={"@c.us"}>@c.us</MenuItem>
                    <MenuItem value={"@g.us"}>@g.us</MenuItem>\
                  </Select>
                </FormControl>
              </Box>
              <TextField
                disabled={loading || noIdOrToken}
                value={messageText}
                autoComplete="off"
                onChange={(e) => setMessageText(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                size="small"
                rows={3}
                multiline
                label="Текст сообщения"
              />
              <Button
                disabled={loading || noIdOrToken}
                sx={{ textTransform: "none" }}
                fullWidth
                onClick={() =>
                  sendMessage(
                    setLoading,
                    idInstance,
                    apiTokenInstance,
                    phone1,
                    messageText,
                    domen1,
                    setResponse
                  )
                }
                color="success"
                variant="contained"
              >
                sendMessage
              </Button>
            </Chapter>
            <Chapter
              label="Отправить файл"
              tip={noIdOrToken && noIdOrTokenText}
            >
              <Box sx={{ mb: 1, display: "flex" }}>
                <TextField
                  disabled={loading || noIdOrToken}
                  value={phone2}
                  autoComplete="off"
                  onChange={(e) => setPhone2(e.target.value)}
                  size="small"
                  label="Номер телефона"
                  sx={{ width: "100%" }}
                />
                <FormControl
                  size="small"
                  sx={{ height: "100%", minWidth: "100px", ml: 1 }}
                >
                  <Select
                    sx={{
                      textAlign: "center",
                      minWidth: "60px",
                      height: "100%",
                    }}
                    size="small"
                    disabled={loading || noIdOrToken}
                    value={domen2}
                    onChange={(e) => setDomen2(e.target.value)}
                  >
                    <MenuItem value={"@c.us"}>@c.us</MenuItem>
                    <MenuItem value={"@g.us"}>@g.us</MenuItem>\
                  </Select>
                </FormControl>
              </Box>
              <TextField
                autoComplete="off"
                disabled={loading || noIdOrToken}
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                fullWidth
                sx={{ mb: 1 }}
                size="small"
                label="Ссылка на файл"
              />
              <TextField
                autoComplete="off"
                disabled={loading || noIdOrToken}
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                size="small"
                label="Название файла"
              />
              <Button
                color="success"
                onClick={() =>
                  sendFile(
                    setLoading,
                    idInstance,
                    apiTokenInstance,
                    phone2,
                    fileUrl,
                    fileName,
                    domen2,
                    setResponse
                  )
                }
                disabled={loading || noIdOrToken}
                sx={{ textTransform: "none" }}
                fullWidth
                variant="contained"
              >
                sendFileByUrl
              </Button>
            </Chapter>
          </Grid>
          <Grid item xs={12} sm={6} height={"931.5px"}>
            <Chapter label="Ответ" sx={{ height: "100%" }}>
              <ReactJson
                src={response}
                theme="bright:inverted"
                style={{
                  backgroundColor: "transparent",
                  overflow: "auto",
                  height: "100%",
                }}
                displayDataTypes={false}
                displayObjectSize={false}
                collapsed={2}
                indentWidth={2}
                name={false}
                enableClipboard={false}
                displayArrayKey={false}
              />
            </Chapter>
          </Grid>
        </Grid>
      </Card>
      <ToastContainer />
    </Box>
  );
}

export default App;
