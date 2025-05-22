import SignUp from "@/components/sign-up";
export default function SignUPPage(){
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
              <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold">Market Desk</h1>
                  <p className="text-sm w-full mx-auto text-gray-500">Multi-Platform Marketing Analytics.🖊️</p>
                </div>                
                <SignUp/>
              </div>
            </div>
        
    )
}