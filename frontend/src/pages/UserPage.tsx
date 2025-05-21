import { Loading } from '@/components/Loading'
import { Button } from '@/components/ui/button'
import { UserComponent } from '@/components/User'
import { logout } from '@/firebase/authentication'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function UserPage() {
    const [isUserLoggedOut, setIsUserLoggedOut] = useState(false)
    const navigate = useNavigate()

    async function userLogout() {
        try {
            const isLoggedOut = await logout()
            if (isLoggedOut) setIsUserLoggedOut(true)
        } catch (err) {
            console.error("Logout failed", err)
        }
    }
    useEffect(() => {
        if (isUserLoggedOut) {
            navigate('/login')
        }
    }, [isUserLoggedOut, navigate])

      const currentUser = useCurrentUser();
    

    if (currentUser === 'loading') {
        return <Loading />
    }

    if (!currentUser) {
        void navigate('/login');
    }

    


    return (
        <div>
            <h1>UserPage</h1>
            <Button onClick={userLogout}>
                Sign Out
            </Button>
            <UserComponent currentUser={currentUser} />
        </div>
    )
}


