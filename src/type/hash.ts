export type JwtPayload = {
    address: string,
    username: string
}

export type JwtDecodedToken =
    {
        address: string,
        username: string,
        iat: number,
        exp: number
    }

    export type JwtToken = {
        token : string
    }

    export type VerifyToken = {
        token: string,
        available : boolean
    }