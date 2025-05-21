import { Loading } from "@/components/Loading";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/hooks/use-current-user";
import { CreateMultiFactorAuthentication } from "@/components/CreateMFAPage";

export default function MFAPage() {
    const currentUser = useCurrentUser();
    const router = useNavigate();

    if (currentUser === 'loading') {
        return <Loading />
    }

    if (!currentUser) {
        void router('/login');
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Market Desk</h1>
                    <p className="mt-2 text-gray-500">Multi-Platform Marketing Analytics</p>
                </div>
                <CreateMultiFactorAuthentication currentUser={currentUser} />
            </div>
        </div>
    )
}