import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import FormHelperText from "@mui/material/FormHelperText";
import { useEffect, useState } from "react";
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

const UploadDocMockup: React.FC = (): JSX.Element => {
  // let location: any = useLocation();
  // //si hubo una ruta anterio la pone en la variable, en caso contrario lleva a la pronmcipal
  // let from = location.state?.from?.pathname || "/";

  const [url, setUrl] = useState("");

  const onClick = async () => {
    //e es el objeto evento normal
    try {
      let atributes = {
        comments: "best comment for my object",
        firstName: "luis alfonso",
        lastName: "apellidos",
      };

      const file = document.querySelector(
        'input[type="file"]'
      )! as HTMLInputElement;

      if (!file.files) {
        return;
      }

      console.log(file.files[0]);

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
            documentTransaction: "papeles ingreso",
            transaction: "venta",
            documentNumber: 1018491224,
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
    } catch (err: any) {
      console.log(err);
    }
  };

  // get by ulid

  const onClickGetByUlid = async () => {
    //e es el objeto evento normal
    try {
      const ulid = "01G8M84D090M9V8KXG5EYY81MP";

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

  // get by ulid

  const onClickGetRawByUlid = async () => {
    //e es el objeto evento normal
    try {
      const ulid = "01G8M84D090M9V8KXG5EYY81MP";

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

      // resultFetchJson.type transform from base 64 to file wuth resultfetchJson.type anddownload the resulting file
      let blob = new Blob([atob(resultFetchJson.type), resultFetchJson.type]);
      let url = URL.createObjectURL(blob);
      window.open(url);
      console.log(resultFetchJson.type);
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
    </Box>
  );
};

export default UploadDocMockup;
