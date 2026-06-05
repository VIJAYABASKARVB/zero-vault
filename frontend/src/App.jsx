import './App.css'
import { Show, SignInButton, SignUpButton, UserButton,useAuth} from '@clerk/react'

function App() {

  const {getToken} = useAuth();

  const testProtectedRoute = async () =>{
    const token = await getToken();
    const res = await fetch('https://your-backend-domain.vercel.app/protected',
                           {headers:{Authorization:`Bearer ${token}`}
    });

    const data = await res.text();
    alert(data);
  }
  
  return (
    <>
      <header>
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
          <button onClick={testProtectedRoute}>Test Protected Route</button>
        </Show>
      </header>
    </>
  )
}

export default App