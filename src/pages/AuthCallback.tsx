import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const error = searchParams.get('error');

    if (error) {
      // If there's an error, redirect to signin page with the error
      console.error('Authentication error:', error);
      navigate(`/Signin?error=${error}`);
      return;
    }

    if (token && username) {
      // Store authentication data
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      
      // Redirect to dashboard
      setTimeout(() => {
        navigate('/Dashboard');
      }, 1000);
    } else {
      // If no token or username, redirect to signin
      navigate('/Signin?error=Authentication failed');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-300 dark:bg-zinc-100">
      <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-600 mb-4" />
        <h1 className="text-xl font-semibold text-zinc-800">Completing authentication...</h1>
        <p className="text-zinc-500 mt-2">You'll be redirected shortly</p>
      </div>
    </div>
  );
}