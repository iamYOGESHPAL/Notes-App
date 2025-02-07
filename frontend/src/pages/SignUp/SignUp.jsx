import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Please enter your name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    setError("");
    // SignUp Api Call
    try {
      const response = await api.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // Handle Successful SignUp Response
      if (response?.data?.error) {
        setError(response?.data?.message);
        return;
      }
      if (response?.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("SignUp Error:", error);
      setError(
        error?.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    }
  };
  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center mt-28">
        <div className="border-gray-300 bg-white py-10 p-7 border rounded w-96">
          <form onSubmit={handleSignUp}>
            <h4 className="mb-7 text-2xl">SignUp</h4>
            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="pb-1 text-red-500 text-sm">{error}</p>}
            <button type="submit" className="btn-primary">
              Create Account
            </button>
            <p className="mt-4 text-center text-sm">
              Already have an Account?{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
