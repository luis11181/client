import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import {
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import FormHelperText from "@mui/material/FormHelperText";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { InputFiles } from "typescript";
import { log } from "console";

interface IValues {
  error: null | string;
}

interface IResponse {
  message: string;
}

interface IResponse2 {
  type: string;
  message: string;
  url: string;
}

interface IResponse3 {
  type: string;
  message: string;
  url: string;

  file: string;
}

const UploadDocMockup: React.FC = (): JSX.Element => {
  // let location: any = useLocation();
  // //si hubo una ruta anterio la pone en la variable, en caso contrario lleva a la pronmcipal
  // let from = location.state?.from?.pathname || "/";

  const [url, setUrl] = useState("");

  const param1 = useRef<HTMLInputElement>(null);

  const onClick = async () => {
    //e es el objeto evento normal
    try {
      let atributes = {
        comments: "best comment for my object",
        firstName: "luis alfonso",
        lastName: "apellidos",
        documentType: "cc",
      };

      const file = document.querySelector(
        'input[type="file"]'
      )! as HTMLInputElement;

      if (!file.files) {
        return;
      }

      //sconsole.log(file.files[0]);

      if (!file.files[0].name) {
        console.log("file with no name error");

        return;
      }

      let type = file.files[0].name.split(".").pop();

      const toBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (e) =>
            //@ts-ignore
            resolve(e.target?.result!.replace("data:", "").replace(/^.+,/, ""));
          reader.onerror = (error) => reject(error);
        });
      };

      console.log(type);

      let data = await toBase64(file.files[0]);

      let resultFetch = await fetch(
        `${process.env.REACT_APP_BACKENDURL}/upload/document`,
        {
          method: "PUT",
          // credentials: "include", // Don't forget to specify this if you need cookies
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.REACT_APP_ACCESSTOKEN,
          },
          body: JSON.stringify({
            type: type,
            atributes: atributes,
            file: data,
            documentTransaction: "cedula",
            transaction: "compra",
            documentNumber: 1018491225,
          }),
        }
      );

      let resultFetchJson = (await resultFetch.json()) as IResponse;

      if (resultFetch.status === 401) {
        throw new Error(resultFetchJson.message);
      }

      if (!resultFetch.ok) {
        throw new Error(resultFetchJson.message);
        // throw new Error("fallo el inicio de sesion!");
      }

      console.log(resultFetchJson);
    } catch (err: any) {
      console.log(err);
    }
  };

  // get by ulid

  const onClickGetByUlid = async () => {
    //e es el objeto evento normal
    try {
      const ulid = "01G909VMXVMWYWT1YKTEJGYNCD";

      let resultFetch = await fetch(
        `${process.env.REACT_APP_BACKENDURL}/download/ulidFile/${ulid}`,
        {
          method: "GET",
          // credentials: "include", // Don't forget to specify this if you need cookies
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.REACT_APP_ACCESSTOKEN,
          },
        }
      );

      let resultFetchJson = (await resultFetch.json()) as IResponse2;

      if (resultFetch.status === 401) {
        throw new Error(resultFetchJson.message);
      }

      if (!resultFetch.ok) {
        throw new Error(resultFetchJson.message);
        // throw new Error("fallo el inicio de sesion!");
      }

      setUrl(resultFetchJson.url);
    } catch (err: any) {
      console.log(err);
    }
  };

  // get by ulid raw 64

  const onClickGetRawByUlid = async () => {
    //e es el objeto evento normal
    try {
      const ulid = "01G909VMXVMWYWT1YKTEJGYNCD";

      let resultFetch = await fetch(
        `${process.env.REACT_APP_BACKENDURL}/download/ulidJsonDocument/${ulid}`,
        {
          method: "GET",
          // credentials: "include", // Don't forget to specify this if you need cookies
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + process.env.REACT_APP_ACCESSTOKEN,
          },
        }
      );

      let resultFetchJson = (await resultFetch.json()) as IResponse3;
      console.log("aqui");
      console.log(resultFetchJson);
      if (resultFetch.status === 401) {
        throw new Error(resultFetchJson.message);
      }

      if (!resultFetch.ok) {
        throw new Error(resultFetchJson.message);
        // throw new Error("fallo el inicio de sesion!");
      }
      //-------------------------------------
      const b64toBlob = (
        b64Data: string,
        contentType = "aplication/pdf",
        sliceSize = 512
      ) => {
        console.log(b64Data);
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (
          let offset = 0;
          offset < byteCharacters.length;
          offset += sliceSize
        ) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
      };
      //-------------------------------------

      // resultFetchJson.type transform from base 64 to file wuth resultfetchJson.type anddownload the resulting file
      console.log(resultFetchJson);
      let blob = b64toBlob(resultFetchJson.file); //base64 to blob
      let url = URL.createObjectURL(blob);
      window.open(url);
      console.log(resultFetchJson.type);
    } catch (err: any) {
      console.log(err);
    }

    // get by ulid
  };
  const onClickQueryDocument = async (
    transaction_doc: string | null = null
  ) => {
    //e es el objeto evento normal
    try {
      const documentNumber = 1018491224;
      let resultFetch;
      transaction_doc = "venta-cedula";
      if (transaction_doc === null) {
        resultFetch = await fetch(
          `${process.env.REACT_APP_BACKENDURL}/query/byDocument/${documentNumber}`,
          {
            method: "GET",
            // credentials: "include", // Don't forget to specify this if you need cookies
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + process.env.REACT_APP_ACCESSTOKEN,
            },
          }
        );
      } else {
        resultFetch = await fetch(
          `${process.env.REACT_APP_BACKENDURL}/query/byDocument/${documentNumber}?transaction_documentTransaction=${transaction_doc}`,
          {
            method: "GET",
            // credentials: "include", // Don't forget to specify this if you need cookies
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + process.env.REACT_APP_ACCESSTOKEN,
            },
          }
        );
      }

      let resultFetchJson = (await resultFetch.json()) as IResponse2;

      if (resultFetch.status === 401) {
        throw new Error(resultFetchJson.message);
      }

      if (!resultFetch.ok) {
        throw new Error(resultFetchJson.message);
        // throw new Error("fallo el inicio de sesion!");
      }

      console.log(resultFetchJson);
    } catch (err: any) {
      console.log(err);
    }
  };

  const onClickQueryTransaction = async (
    creationDate: string | null = null
  ) => {
    //e es el objeto evento normal
    try {
      const transaction_documentTransaction = "venta-cedula";
      let resultFetch;
      creationDate = "2022-07-27,"; // "2022-07-27, 11:54:39"
      if (creationDate === null) {
        resultFetch = await fetch(
          `${process.env.REACT_APP_BACKENDURL}/query/byTransaction/${transaction_documentTransaction}`,
          {
            method: "GET",
            // credentials: "include", // Don't forget to specify this if you need cookies
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + process.env.REACT_APP_ACCESSTOKEN,
            },
          }
        );
      } else {
        resultFetch = await fetch(
          `${process.env.REACT_APP_BACKENDURL}/query/byTransaction/${transaction_documentTransaction}?creationDate=${creationDate}`,
          {
            method: "GET",
            // credentials: "include", // Don't forget to specify this if you need cookies
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + process.env.REACT_APP_ACCESSTOKEN,
            },
          }
        );
      }

      let resultFetchJson = (await resultFetch.json()) as IResponse2;

      if (resultFetch.status === 401) {
        throw new Error(resultFetchJson.message);
      }

      if (!resultFetch.ok) {
        throw new Error(resultFetchJson.message);
        // throw new Error("fallo el inicio de sesion!");
      }

      console.log(resultFetchJson);
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <Box
    //center all the text fileds indie the div
    >
      <Typography
        variant="h1"
        component="h1"
        align="center"
        fontSize={30}
        fontWeight="bold"
        gutterBottom
      >
        Subir Documentos
      </Typography>
      <Box
        id="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        //noValidate
        //autoComplete="off"
      >
        <input type="file" id="file" name="file"></input>

        <Button
          onClick={() => {
            onClick();
          }}
        >
          send
        </Button>
      </Box>
      <Box sx={{ m: 1 }} />
      <Typography
        variant="h1"
        component="h1"
        align="center"
        fontSize={30}
        fontWeight="bold"
        gutterBottom
      >
        download file by ulid
      </Typography>
      <Button
        onClick={() => {
          onClickGetByUlid();
        }}
      >
        get
      </Button>
      <div>
        url:
        <a href={url}>{url.slice(0, 10)}..</a>
      </div>
      <Typography
        variant="h1"
        component="h1"
        align="center"
        fontSize={30}
        fontWeight="bold"
        gutterBottom
      >
        download raw blob by ulid
      </Typography>
      <Button
        onClick={() => {
          onClickGetRawByUlid();
        }}
      >
        get raw blob
      </Button>
      <Typography
        variant="h1"
        component="h1"
        align="center"
        fontSize={30}
        fontWeight="bold"
        gutterBottom
      >
        query an item by document number
      </Typography>
      optional parameter by transaction-document
      <Input ref={param1}></Input>
      <Button
        onClick={() => {
          onClickQueryDocument(param1.current?.value);
        }}
      >
        query by document
      </Button>
      <Typography
        variant="h1"
        component="h1"
        align="center"
        fontSize={30}
        fontWeight="bold"
        gutterBottom
      >
        query an item by transaction-document
      </Typography>
      optional parameter by date
      <Input ref={param1}></Input>
      <Button
        onClick={() => {
          onClickQueryTransaction();
        }}
      >
        query by transaction
      </Button>
    </Box>
  );
};

export default UploadDocMockup;
