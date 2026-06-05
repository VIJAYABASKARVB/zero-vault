import { SignedIn, UserButton,SignedOut,SignInButton,SignUpButton } from "@clerk/clerk-react"

function HomePage() {
  return (
    <div>
      Landing Page    
      <SignedOut>
          <SignInButton />
          <SignUpButton />
      </SignedOut>
    </div>
  )
}

export default HomePage