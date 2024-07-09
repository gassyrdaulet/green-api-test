import axios from "axios";
import { toast } from "react-toastify";

const requester = axios.create({ baseURL: "https://7103.api.greenapi.com" });

export const processError = (name, e) => {
  try {
    const showAlert = (name, message) =>
      toast.error("Ошибка. " + name + (message ? ": " + message : ""), {
        draggable: false,
        closeOnClick: true,
      });
    let message = null;
    if (e.message) message = e.message;
    if (e.request && !e.response)
      message = "Нет ответа от сервера. Проверьте введенные данные Instance.";
    if (e.response?.status === 403) message = "Доступ к ресурсу запрещен";
    if (e.response?.data?.message) {
      message = e.response?.data?.message;
    } else if (e.response?.data?.correspondentsStatus?.description) {
      message = e.response?.data?.correspondentsStatus?.description;
    }
    showAlert(name, message);
  } catch (e) {
    console.log("Ошибка при обработке ошибки:", e.message);
  }
};

export const run = async (
  setLoading = () => {},
  name,
  callback,
  extraProcessError = () => {}
) => {
  try {
    setLoading(true);
    try {
      await callback();
    } catch (e) {
      extraProcessError(e);
      processError(name, e);
    } finally {
      setLoading(false);
    }
  } catch (e) {
    extraProcessError(e);
    processError(name, e);
  }
};

const setResponseFromError = (setResponse, e) => {
  if (e.response?.data) {
    setResponse(e.response?.data);
  }
};

export const getSettings = async (setLoading, id, token, setResponse) => {
  run(
    setLoading,
    "Получение информации о настройках",
    async () => {
      const { data } = await requester.get(
        `waInstance${id}/getSettings/${token}`
      );
      setResponse(data);
    },
    (e) => setResponseFromError(setResponse, e)
  );
};

export const getState = async (setLoading, id, token, setResponse) => {
  run(
    setLoading,
    "Получение состояния инстанса",
    async () => {
      const { data } = await requester.get(
        `waInstance${id}/getStateInstance/${token}`
      );
      setResponse(data);
    },
    (e) => setResponseFromError(setResponse, e)
  );
};

export const sendMessage = async (
  setLoading,
  id,
  token,
  phone,
  message,
  domen,
  setResponse
) => {
  run(
    setLoading,
    "Отправка текстового сообщения",
    async () => {
      const { data } = await requester.post(
        `waInstance${id}/sendMessage/${token}`,
        { chatId: phone + domen, message },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(data);
    },
    (e) => setResponseFromError(setResponse, e)
  );
};

export const sendFile = async (
  setLoading,
  id,
  token,
  phone,
  urlFile,
  fileName,
  domen,
  setResponse
) => {
  run(
    setLoading,
    "Отправка файла",
    async () => {
      const { data } = await requester.post(
        `waInstance${id}/sendFileByUrl/${token}`,
        { chatId: phone + domen, urlFile, fileName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResponse(data);
    },
    (e) => setResponseFromError(setResponse, e)
  );
};
