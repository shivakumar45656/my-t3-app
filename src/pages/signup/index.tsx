import { useEffect, useState } from "react";
import Header from "../../components/header";
// import "./signup.css";

import { api } from "~/utils/api";

export default function signUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginRedirect, setLoginRedirect] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const userCreationApi = api.user.create.useMutation();

  const createUser = async (user: any) => {
    userCreationApi.mutate(user, {
      onSettled(data, error, variables, context) {
        if (error) {
          setErrMsg(error.message);
        } else if (data && data.status === 201) {
          setLoginRedirect(true);
        } else {
          setErrMsg(data?.message as string);
        }
      },
    });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    createUser({
      name: name,
      email: email,
      password: password,
    });
  };

  useEffect(() => {
    if (loginRedirect) {
      location.href = "/login";
    }
  }, [loginRedirect]);

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
              <h2 style={{ textAlign: "center" }}>Create your account</h2>
              <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <br />
                  <input
                    type="text"
                    id="name"
                    className="input"
                    value={name}
                    placeholder="Enter"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
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
                    CREATE ACCOUNT
                  </button>
                </div>
              </form>
              <p>{errMsg.length > 1 ? errMsg : ""}</p>
              <div className="footer" style={{}}>
                <p style={{ fontSize: "small" }}>
                  Have an Account? <a href="/login">LOGIN</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
