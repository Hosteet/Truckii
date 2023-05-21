import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { confirmReset, loginUser, registerUser, resetPassword } from "../helper/apiHandler";
const AuthContext = React.createContext();
const unAuthRoute = ['/login', '/signup', '/reset-password'];
export function useAuth() {
  return useContext(AuthContext);
}

// eslint-disable-next-line react/prop-types
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const signup = async (email, password, name) => {
    setLoading(true);
    const response = await registerUser(email, password, name);

    if (response?.data) {
      setLoading(false);
      // localStorage.setItem("user", JSON.stringify(response.data));
      return setCurrentUser(response.data);
    }
    setLoading(false);
    return setError({ error: response.error });
  };

  const login = async (email, password) => {
    const response = await loginUser(email, password);
    console.log(response.error);
    if (response?.data) {
      // localStorage.setItem("user", JSON.stringify(response.data));
      return setCurrentUser(response.data);
    }
    return setError({ error: response.error.message });
  };

  const logout = () => {
    localStorage.clear();
  };

  const reset_password = async (email) => {
    const response = await resetPassword(email);
    console.log(response.error);
    if (response?.data) {
      console.log('response', email, response.data);
      localStorage.setItem("email", email);
      setEmail(email);
      window.location.href = `/reset-password/${response.data.resetCode}`
      // return setCurrentUser(response.data);
    }else{
      return setError({ error: response.error?.message });
    }
   
  };

  const confirm_password = async ({token, password, confirmPassword}) => {
    const email = localStorage.getItem('email');
    console.log(58, {token, password, confirmPassword, email})

    const response = await confirmReset({email, password, confirmPassword, token});
    console.log('confirm pass', response?.error, response.data);
    if (response?.data) {
      // localStorage.setItem("user", JSON.stringify(response.data));
      // setEmail(email);
      window.location.href = `/reset-password/${response.data.resetCode}`
    }
    return setError({ error: response.error.message });
  };
  useEffect(() => {
    console.log("location",location.host,location.pathname, location.href.split("/").pop());
    if (
      currentUser &&
      unAuthRoute.indexOf(
        location.pathname
      ) != -1
      && "/reset-password/".includes(location.pathname)
    ) {
      navigate("/");
    }
    if (
      !currentUser &&
      unAuthRoute.indexOf(
        location.pathname
      ) == -1
      && "/reset-password/".includes(location.pathname)
    ) {
      navigate("/login");
    }
  });

  const value = {
    currentUser,
    login,
    email,
    signup,
    reset_password,
    confirm_password,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
