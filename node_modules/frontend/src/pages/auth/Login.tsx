import {
  TextField,
  Button,
  Container
} from "@mui/material";

import {
  useState
} from "react";

import api from "../../services/api";

import {
  useDispatch
} from "react-redux";

import {
  loginSuccess
} from "../../store/slices/authSlice";

const Login = () => {

  const dispatch =
    useDispatch();

  const [email,setEmail] =
    useState("");

  const [password,setPassword] =
    useState("");

  const submit = async () => {

    const res =
      await api.post(
        "/auth/login",
        {
          email,
          password
        }
      );

    dispatch(
      loginSuccess({
        user:
          res.data.data.user,

        token:
          res.data.data.accessToken
      })
    );
  };

  return (
    <Container>

      <TextField
        fullWidth
        label="Email"
        onChange={e =>
          setEmail(
            e.target.value
          )
        }
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        onChange={e =>
          setPassword(
            e.target.value
          )
        }
      />

      <Button
        onClick={submit}
      >
        Login
      </Button>

    </Container>
  );
};

export default Login;