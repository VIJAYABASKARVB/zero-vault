import { SignedIn, UserButton,SignedOut,SignInButton,SignUpButton } from "@clerk/clerk-react"
import logo from "../assets/logo.png"
import heroImage from "../assets/hero.png"

function HomePage() {
  return (
    <div>
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-50 p-4 sm:p-5 flex backdrop-blur-sm bg-black/20 justify-between items-center gap-3 sm:gap-5">
        {/* LOGO AND BRAND NAME */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Logo"
            className="w-11 h-7 sm:w-14 sm:h-9"
          />
          <h1 className="text-lg sm:text-2xl font-bold text-white font-jet">ZERO VAULT</h1>
        </div>

        {/* SIGNED OUT BUTTONS */}
        <SignedOut>
          <div className="flex gap-3 sm:gap-5">
            <SignInButton>
              <button className="cursor-pointer text-white font-jet text-sm sm:text-base">
                Login
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="border-[#008B1E] border-2 px-2 sm:px-3 py-1 cursor-pointer text-[#008B1E] rounded-lg font-jet text-sm sm:text-base">
                Register
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">

          {/* Left Content Section */}
          <div className="flex flex-col gap-6 sm:gap-8 order-2 lg:order-1">

            {/* Heading */}
            <div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight text-center lg:text-left">
                Manage Your Passwords With <span className="text-[#008B1E]">Zero Vault</span>
              </h1>

            </div>

            {/* Subheading */}
            <div>
              <p className="text-base sm:text-lg text-gray-400 text-center lg:text-left">
                Zero Vault helps you securely manage passwords,
                credentials, and sensitive information with
                end-to-end encryption.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              {/* Getting Started Button */}
              <SignUpButton>
                <button className="border-[#008B1E] border-2 px-4 sm:px-6 py-2 sm:py-3 cursor-pointer text-[#008B1E] rounded-lg font-jet text-sm sm:text-base">
                  Get Started
                </button>
              </SignUpButton>

              {/* Learn More Button */}
              <button className="px-4 sm:px-6 py-2 sm:py-3 border border-[#008B1E] text-[#008B1E] rounded-lg cursor-pointer font-jet text-sm sm:text-base">
                Learn More
              </button>
            </div>

          </div>

          {/* Right Image Section  */}
          <div className="flex justify-center order-1 lg:order-2">
            {/* Hero Image */}
            <img 
              src={heroImage} 
              alt="Zero Vault Hero" 
              className="w-full max-w-sm sm:max-w-lg object-contain rounded-2xl sm:rounded-3xl shadow-lg shadow-[#008B1E]/20"  
            />
          </div>

        </div>
        
      </section>
    </div>
  )
}

export default HomePage