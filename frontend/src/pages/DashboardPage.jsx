import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'

function DashboardPage() {
  return (
    <div>
      DashboardPage
      <header>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    </div>
  )
}

export default DashboardPage