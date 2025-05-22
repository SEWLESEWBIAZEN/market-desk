import {
    ApplicationVerifier,
    Auth,
    browserPopupRedirectResolver,
    createUserWithEmailAndPassword,
    getAuth, getMultiFactorResolver,
    GoogleAuthProvider,
    multiFactor,
    MultiFactorError, MultiFactorResolver,
    PhoneAuthProvider,
    PhoneMultiFactorGenerator, sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User
} from "firebase/auth";
import { auth } from "@/firebase/init";
import { toast } from "sonner";

export async function signInWithGoogle(): Promise<any> {
    let errorMessage = ""
    try {
        await signInWithPopup(auth, new GoogleAuthProvider(), browserPopupRedirectResolver);
        return true;
    } catch (e) {
        switch(e.code){
            case 'auth/invalid-credential':
                errorMessage='Please try again!'
                break
            
            case 'auth/popup-blocked':
                errorMessage = 'Could not Process, Pop Up blocked by browser. Try use different browser.'
                break
            
            case 'auth/unauthorized-domain':
                errorMessage= "Domain is Unauthorized, contact Admin"
                break
            
            default:
                errorMessage = "Something went wrong while signing in with google!"
            
        }
        toast.error(`Signup Failed ${errorMessage}`)
        return false;
    }
}

export async function signUp(email: string, password: string): Promise<boolean> {
    let errorMessage = ""
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        return true;
    } catch (e) {
        switch (e.code) {
            case 'auth/email-already-in-use':
                errorMessage = `Signup failed. User registerd with ${email}. Please check and try again!`
                break
            case 'auth/invalid-email':
                errorMessage = 'The email address is malformed.'
                break
            case 'auth/operation-not-allowed':
                errorMessage = 'Email/password sign-up is disabled.'
                break
            case 'auth/weak-password':
                errorMessage = 'Password is too weak (e.g. less than 6 chars).'
                break
            default:
                errorMessage = "Something went wrong!"
        }
        toast.error(errorMessage)
        return false;
    }
}

export async function login(email: string, password: string): Promise<User | null> {
    let errorMessage = ""
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error: any) {
        // Optional: log or handle specific errors
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email.'
                break

            case 'auth/wrong-password':
                errorMessage = 'Incorrect password'
                break

            case 'auth/invalid-email':
                errorMessage = 'Enter Valid email'
                break

            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Try again later.'
                break

            case 'auth/user-disabled':
                errorMessage = 'User Account disabled. Contact the admin.'
                break
            case 'auth/invalid-credential':
                errorMessage = 'Login Failed, Invalid Credintials!'
                break

            default:
                errorMessage = 'Something went wrong'
        }
        toast.error(`Login Failed, ${errorMessage}`)
        return null;
    }
}

export async function logout(): Promise<boolean> {
    try {
        await signOut(auth);
        return true;
    } catch (e) {
        toast.error("Something went wrong!")
        return false;
    }
}

export function verifyIfUserIsEnrolled(user: User) {
    const enrolledFactors = multiFactor(user).enrolledFactors;
    return enrolledFactors.length > 0;
}

export async function verifyPhoneNumber(
    user: User,
    phoneNumber: string,
    recaptchaVerifier: ApplicationVerifier
): Promise<false | string> {
    const session = await multiFactor(user).getSession();
    const phoneInfoOptions = {
        phoneNumber,
        session
    }

    const phoneAuthProvider = new PhoneAuthProvider(auth);
    try {
        return await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
    } catch (e) {
        return false;
    }
}

export async function enrollUser(
    user: User,
    verificationCodeId: string,
    verificationCode: string
) {
    const phoneAuthCredential = PhoneAuthProvider.credential(verificationCodeId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(phoneAuthCredential);

    try {
        await multiFactor(user).enroll(multiFactorAssertion, 'Personal Phone Number');
        return true;
    } catch (e) {
        return false;
    }
}

// export async function verifyUserMFA(
//     error: MultiFactorError,
//     recaptchaVerifier: ApplicationVerifier,
//     selectedIndex: number
// ): Promise<false | { verificationId: string, resolver: MultiFactorResolver } | void> {
//     const resolver = getMultiFactorResolver(auth, error);

//     if (resolver.hints[selectedIndex].factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
//         const phoneInfoOptions = {
//             multiFactorHint: resolver.hints[selectedIndex],
//             session: resolver.session
//         }

//         const phoneAuthProvider = new PhoneAuthProvider(auth);
//         try {
//             const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
//             return { verificationId, resolver }
//         } catch (e) {
//             console.log(e)
//             return false
//         }
//     }
// }

export async function verifyUserEnrolled(
    verificationMFA: { verificationId: string, resolver: MultiFactorResolver },
    verificationCode: string
) {
    const { verificationId, resolver } = verificationMFA;
    const credentials = PhoneAuthProvider.credential(verificationId, verificationCode);
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(credentials);

    try {
        await resolver.resolveSignIn(multiFactorAssertion);
        return true;
    } catch (e) {
        return false;
    }
}

export async function verifyUserEmail(user: User): Promise<boolean> {
    try {
        await sendEmailVerification(user);
        return true;
    } catch (e) {
        return false;
    }
}