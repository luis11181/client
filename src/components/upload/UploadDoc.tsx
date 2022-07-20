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

interface IValues {
  error: null | string;
}

interface IResponse {
  token: string;
  userId: string;
  role: string;
  firstName: string;
  message: string;
}

type FormValues = {
  tipoComprobante: "egreso" | "ingresos" | "gastos";
  numero: string;
  observaciones: string;
  formaPago: string;
  banco: string;
  fechaAplica: string;
  chequeNumero: string;
  codigoPuc: string;
  concepto: string;
  valor: number;
  lista: {
    codigoPuc: string;
    concepto: string;
    valor: number;
  }[];
};

const UploadDoc: React.FC = (): JSX.Element => {
  // let location: any = useLocation();
  // //si hubo una ruta anterio la pone en la variable, en caso contrario lleva a la pronmcipal
  // let from = location.state?.from?.pathname || "/";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [values, setValues] = useState<IValues>({
    error: null,
  });
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();
  //const [items, setItems] = useState<Array<any>>([]);

  //! react hook form methods %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    clearErrors,
    reset,
    control,
  } = useForm<FormValues>();

  const {
    fields,
    append,
    remove, //swap, move,  prepend,insert
  } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "lista", // unique name for your Field Array
  });

  //! end react hook form methods %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

  const onSubmit: SubmitHandler<FormValues> = async (data, e) => {
    //e es el objeto evento normal
    //console.log(data);
    setLoading(true);

    //alert(JSON.stringify(resultado));

    try {
      const formData = new FormData();

      const photos = document.querySelector(
        'input[type="file"][multiple]'
      )! as HTMLInputElement;

      if (photos.files) {
        formData.append("title", "My Vegas Vacation");
        for (let i = 0; i < photos.files.length; i++) {
          formData.append(`photos_${i}`, photos.files[i]);
        }

        let resultFetch = await fetch(
          `${process.env.REACT_APP_BACKENDURL}/upload/document`,
          {
            method: "POST",
            credentials: "include", // Don't forget to specify this if you need cookies
            // headers: {
            //   "Content-Type": "application/json",
            // },
            body: formData,
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

        console.log("Success:", resultFetchJson);
      }
      setLoading(false);

      // navigate(`/detalle/${tipoComprobante}/${year}/${numero}`);
    } catch (error: any) {
      setLoading(false);
      if (error.message && typeof error.message === "string") {
        setValues((anterior) => ({ ...anterior, error: error.message }));
      } else {
        setValues((anterior) => ({ ...anterior, error: "Error inesperado" }));
      }
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
        component="form"
        id="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
        //noValidate
        //autoComplete="off"
      >
        <Grid
          container //grid contenedor que define prorpiedades de la grilla
          //spacing={1}
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 2 }}
        >
          <Grid item xs={6} md={6} textAlign={"center"}>
            <FormControl fullWidth>
              <InputLabel id="tipoComprobante-label">Tipo Elemento</InputLabel>
              <Select
                autoWidth={true}
                //sx={{ width: "max-content" }}
                labelId="tipoComprobante-label"
                id="tipoComprobante"
                error={errors.tipoComprobante && true}
                defaultValue=""
                //value={age}
                label="tipoComprobante"
                {...register("tipoComprobante", {
                  required: { value: true, message: "requerido" },
                  // maxLength: { value: 15, message: "nombre muy largo" },
                })}
                //onChange={handleChange}
              >
                <MenuItem value={"egreso"}>Cedula</MenuItem>
                <MenuItem value={"gastos"}>Transaccion</MenuItem>
                <MenuItem value={"ingresos"}>Otro</MenuItem>
              </Select>
              <FormHelperText error={errors.tipoComprobante && true}>
                {errors.tipoComprobante && errors.tipoComprobante.message}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box //sx={{ border: 1, borderColor: "primary.main" }}
            >
              <Grid
                container //grid contenedor que define prorpiedades de la grilla
                //spacing={1}
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 2 }}
              >
                <Grid item xs={6} md={3}>
                  <TextField
                    id="codigoPuc"
                    //required // le pone un asterisco para saber  que es obligatoria
                    label="codigoPuc"
                    type="text"
                    variant="outlined"
                    error={errors.codigoPuc ? true : false}
                    helperText={errors.codigoPuc && true}
                    //variant="outlined"
                    //defaultValue="Hello World"
                    {...register("codigoPuc")}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    id="concepto"
                    //required // le pone un asterisco para saber  que es obligatoria
                    label="concepto"
                    type="text"
                    variant="outlined"
                    error={errors.concepto ? true : false}
                    helperText={errors.concepto && true}
                    //variant="outlined"
                    //defaultValue="Hello World"
                    {...register("concepto", {
                      required: { value: true, message: "requerido" },
                      // maxLength: { value: 15, message: "nombre muy largo" },
                    })}
                  />
                </Grid>
                <Grid item xs={6} md={3}>
                  <TextField
                    id="valor"
                    //required // le pone un asterisco para saber  que es obligatoria
                    label="valor"
                    type="number"
                    variant="outlined"
                    error={errors.valor ? true : false}
                    helperText={errors.valor && true}
                    //variant="outlined"
                    //defaultValue="Hello World"
                    {...register("valor", {
                      required: { value: true, message: "requerido" },
                      // maxLength: { value: 15, message: "nombre muy largo" },
                    })}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {fields.map((item: any, index: number) => {
            return (
              <Grid item xs={12} key={item.id}>
                <Box
                  key={item.id}
                  //sx={{ border: 1, backgroundColor: "primary.light" }}
                >
                  <Grid
                    container //grid contenedor que define prorpiedades de la grilla
                    //spacing={1}
                    key={item.id}
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 2 }}
                  >
                    <Grid item xs={6} md={3} key={item.id}>
                      <TextField
                        id={`codigoPuc${index}`}
                        //required // le pone un asterisco para saber  que es obligatoria
                        label={`codigoPuc${index}`}
                        type="text"
                        variant="outlined"
                        error={errors?.lista?.[index]?.codigoPuc ? true : false}
                        helperText={
                          errors?.lista?.[index]?.codigoPuc &&
                          errors?.lista?.[index]?.codigoPuc?.message
                        }
                        //variant="outlined"
                        //defaultValue="Hello World"

                        {...register(`lista.${index}.codigoPuc` as const, {
                          // maxLength: { value: 15, message: "nombre muy largo" },
                        })}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        id={`concepto${index}`}
                        //required // le pone un asterisco para saber  que es obligatoria
                        label={`concepto${index}`}
                        type="text"
                        variant="outlined"
                        error={errors?.lista?.[index]?.concepto ? true : false}
                        helperText={
                          errors?.lista?.[index]?.concepto &&
                          errors?.lista?.[index]?.concepto?.message
                        }
                        //variant="outlined"
                        //defaultValue="Hello World"
                        {...register(`lista.${index}.concepto` as const, {
                          required: { value: true, message: "requerido" },
                          // maxLength: { value: 15, message: "nombre muy largo" },
                        })}
                      />
                    </Grid>

                    <Grid item xs={6} md={3}>
                      <IconButton
                        aria-label="delete"
                        type="button"
                        color="secondary"
                        size="large"
                        onClick={() => remove(index)}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            );
          })}

          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              //justifyContent: "right",
              alignItems: "end",
            }}
          >
            <Button
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
              type="button"
              variant="contained"
              onClick={() =>
                append({
                  codigoPuc: "",
                  concepto: "",
                  valor: undefined,
                })
              }
            >
              Agregar
            </Button>
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              id="observaciones"
              //required // le pone un asterisco para saber  que es obligatoria
              label="Documentos"
              type="file"
              variant="outlined"
              error={errors.observaciones ? true : false}
              helperText={errors.observaciones && errors.observaciones.message}
              //variant="outlined"
              //defaultValue="Hello World"
              {...register("observaciones", {
                required: { value: true, message: "requerido" },
                // maxLength: { value: 15, message: "nombre muy largo" },
              })}
            />
            <input type="file" id="files" name="files" multiple></input>
          </Grid>
        </Grid>

        <Box sx={{ m: 1 }} />

        <Box>
          <Button
            variant="contained"
            type="reset"
            onClick={() => {
              clearErrors();
              reset();
            }}
          >
            Cancelar
          </Button>
          {"   "}
          <LoadingButton
            color="secondary"
            loading={loading}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            type="submit"
          >
            Save
          </LoadingButton>
        </Box>
      </Box>
      <Box sx={{ m: 1 }} />

      <Typography variant="body1" sx={{ color: "red" }}>
        {values.error}
      </Typography>
    </Box>
  );
};

export default UploadDoc;
