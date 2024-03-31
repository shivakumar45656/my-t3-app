import { useState } from "react";
import Header from "../../components/header";

import { api } from "~/utils/api";

export let token: string = "";

export default function signUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loginRedirect, setLoginRedirect] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const loginApi = api.user.login.useMutation();

  const loginUser = async (user: any) => {
    await loginApi.mutate(user, {
      onSettled(data, error) {
        if (error) {
          setErrMsg(error.message);
        } else if (data && data.status === 200) {
          token = data?.data?.accessToken as string;
          localStorage.setItem("auth-token", token);
          // console.log("onseeteld", data?.data.accessToken);
          setLoginRedirect(true);
        } else {
          setErrMsg("something went error");
        }
      },
    });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // handle form submission here, e.g., send data to backend for account creation
    loginUser({
      email: email,
      password: password,
    });
  };
  return (
    <>
      <Header />
      <div className="create-account">
        <div className="create-account-body">
          <div className="banner">
            <b style={{ fontSize: "small" }}>Get 10% off on business sign up</b>
          </div>
          <div className="container">
            <div className="formContainer">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h1
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  Login
                </h1>
                <p style={{ marginTop: "20px", fontWeight: 500 }}>
                  {" "}
                  Welcome back to ECOMMERCE{" "}
                </p>
                <small style={{ fontWeight: "400", marginTop: "5px" }}>
                  {" "}
                  The next gen business marketplace{" "}
                </small>
              </div>
              <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                  <label htmlFor="email">Email</label> <br />
                  <input
                    type="email"
                    id="email"
                    className="input"
                    value={email}
                    placeholder="Enter"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label> <br />
                  <input
                    type="password"
                    id="password"
                    className="input"
                    placeholder="Enter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <button type="submit" className="button">
                    LOGIN
                  </button>
                </div>
              </form>
              <hr></hr>
              <div className="footer" style={{}}>
                <p style={{ fontSize: "small" }}>
                  Don't have an Account?{" "}
                  <a href="/signup" style={{ fontWeight: 500 }}>
                    SIGN UP
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
