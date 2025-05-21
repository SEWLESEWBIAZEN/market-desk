import {Code} from "@/components/Code";
import {User} from "firebase/auth";
import {enrollUser} from "@/firebase/authentication";

import {notify} from "@/utils/notify";
import { useNavigate } from "react-router-dom";

type Props = {
    currentUser: User,
    verificationCodeId: string
}

export function CodeSignup({currentUser, verificationCodeId}: Props) {
    const router = useNavigate();

    async function getCode(code: string) {
        const response = await enrollUser(
            currentUser,
            verificationCodeId,
            code
        );

        if (response) {
            router('/user');
        }else {
            notify('Something went wrong.');
        }
    }

    return <Code getCode={getCode} />
}