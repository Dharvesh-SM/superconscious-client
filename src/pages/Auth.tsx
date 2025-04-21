import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CircleX, Loader2 } from "lucide-react";
import cfaeebc3ea50c461b550a8cea90b2bdc from "../assets/cfaeebc3ea50c461b550a8cea90b2bdc.jpg";
import signupimg from "../assets/07cd57c62930a45e8d19d9d8d36aa85c.jpg";
import { Eye , EyeClosed} from 'lucide-react';
// import logo from "../assets/logo.png";

const API_URL = import.meta.env.VITE_API_URL;

export function Auth() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const PasswordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string[]>([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [showPassword , setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSignUp = location.pathname === "/Signup";

  // Check for error in URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError([decodeURIComponent(errorParam)]);
    }
  }, [location.search]);

  useEffect(() => {
    usernameRef.current?.focus();
  }, [isSignUp]);

 
  const handleInputChange = () => {
    if (error.length > 0) {
      const newErrors = error.filter((_, index) => index > currentErrorIndex);
      setError(newErrors);
      setCurrentErrorIndex(0);
    }
  };

  async function handleAuth() {
    setLoading(true);
    const username = usernameRef.current?.value;
    const password = PasswordRef.current?.value;

    try {
      if (isSignUp) {
      
        
        await axios.post(`${API_URL}/api/v1/auth/signup`, {
          username,
          password,
        });
        setLoading(false);
        navigate("/Signin");
      } else {
        const response = await axios.post(`${API_URL}/api/v1/auth/signin`, {
          username,
          password,
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("username", response.data.username);
        setLoading(false);
        setInterval(() => {
          navigate("/Dashboard");
        }, 1000);
      }
    } catch (error: unknown) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        if (error.response?.data) {
          const errorData = error.response.data;
          if (Array.isArray(errorData.message)) {
            setError(errorData.message);
          } else if (Array.isArray(errorData.messages)) {
            setError(errorData.messages);
          } else if (typeof errorData.message === 'string') {
            setError([errorData.message]);
          } else {
            setError([`${isSignUp ? "Signup" : "Signin"} failed. Try again.`]);
          }
          setCurrentErrorIndex(0);
        } else if (error.request) {
          setError(["No response from server."]);
        } else {
          setError(["Something went wrong. Please try again."]);
        }
      } else {
        setError(["An unexpected error occurred. Please try again."]);
      }
    }
  }

  return (
    <div className="flex md:flex-row flex-col justify-center gap-2">
        <h1 className="absolute top-0  text-center text-gray-400 text-md text-xs  rounded p-2">Hosted on free instance, which may delay requests by 50 seconds or more due to inactivity, please wait. </h1>
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-zinc-300 border-gray-600 border dark:bg-zinc-100 flex rounded-xl p-[4px] relative">
          <div className="right-0 p-3 top-0 absolute z-50 justify-end flex-row  text-gray-700 md:text-gray-200">
            <Link to="/">
              <CircleX className="cursor-pointer size-5 hover:text-gray-400 md:hover:text-gray-500" />
            </Link>
          </div>

          <div className="flex flex-col p-5 bg-zinc-300 dark:bg-zinc-100 relative max-w-80 items-center justify-center gap-2 rounded-xl md:rounded-l-xl md:rounded-none">
            <div className="flex flex-col justify-center items-center mb-4">
              <img
                src="/logo.png"
                className="h-8 rounded-full mb-5 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                alt=""
              />
              <h1 className="font-semibold text-2xl text-zinc-600">
                {isSignUp ? "Sign up and get started!" : "Welcome back!"}
              </h1>
              <p className="text-zinc-500 text-xs">
                {isSignUp ? (
                  <>
                    Already have an account?{" "}
                    <Link to="/Signin" className="text-zinc-800 font-semibold">
                      Sign in
                    </Link>
                  </>
                ) : (
                  <>
                    First time here?{" "}
                    <Link to="/Signup" className="text-zinc-800 font-semibold">
                      Sign up for free
                    </Link>
                  </>
                )}
              </p>
            </div>

            <Input
              placeholder="Username"
              reference={usernameRef}
              variant={"secondary"}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              onChange={handleInputChange}
            />
            <Input
              type={showPassword? "text" : "password"}
              placeholder="Password"
              reference={PasswordRef}
              variant={"secondary"}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              onChange={handleInputChange}
              endICon={<button className="flex justify-center pointer-events-auto " onClick={(e)=>{
                e.preventDefault();
                setShowPassword(prev => !prev)
              }}>
                { showPassword ?<Eye size={20} color="gray"/> : <EyeClosed size={20} color="gray"/> }</button>}
            />

            <Button
              variant={"new"}
              children={
                loading ? (
                  <div className="flex gap-2 items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin" />{" "}
                    {isSignUp ? "Signing Up..." : "Logging In..."}
                  </div>
                ) : isSignUp ? (
                  "Sign Up"
                ) : (
                  "Sign In"
                )
              }
              size={"md"}
              loading={loading}
              onClick={handleAuth}
            />
            
            {!isSignUp && (
              <div className="w-full">
                <div className="flex items-center my-3">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-2 text-xs text-gray-500">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                
                <a href={`${API_URL}/api/v1/auth/google`} className="w-full">
                  <button 
                    className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    Sign in with Google
                  </button>
                </a>
              </div>
            )}

            {error.length > 0 && (
              <p className="text-red-500 font-semibold text-center text-xs animate-smoothLanding">
                {error[currentErrorIndex]}
              </p>
            )}

            <p className="text-zinc-500 text-xs w-full text-justify mt-3 align-middle">
              By {isSignUp ? "signing up" : "signing in"}, you agree to our{" "}
              <a href="#" className="text-zinc-800">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-zinc-800">
                Privacy Policy
              </a>
              .
            </p>
          </div>
          <div className="hidden h-96 w-64 md:block rounded-r-xl overflow-hidden relative">
            <img
              className="contrast-75 backdrop-contrast-50"
              src={isSignUp ? signupimg : cfaeebc3ea50c461b550a8cea90b2bdc}
              alt="images conscious"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
