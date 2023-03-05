import { Application, Request, response, Response } from 'express';
import { addJwtToken, addUser, getLastedJwtTokenMatchedAddress, getUser, getUserWithTransaction } from '../database';
import { jwtDecodeWithHashSecret, jwtSignWithHashSecret } from '../hash';
import { JwtDecodedToken, JwtPayload, Session, SessionWithoutId, User } from '../type';

export const authenticationApi = (app: Application) => {
    app.post('/session-validate', async (req: Request, res: Response): Promise<void> => {
        let resBody: { user: User, jwtToken: string } | {} = {};
        try {
            const reqBody:
                {
                    token: string
                }
                = req.body;
                
            const token: string = reqBody.token;
            const decode: JwtDecodedToken | null = jwtDecodeWithHashSecret(token);
    
            if (decode != null) {
                const address: string = decode.address;
                const exp: number = decode.exp;
                const lastedToken: string | null = await getLastedJwtTokenMatchedAddress(address);

                if (lastedToken != null) {
                    const currentTime: number = Date.now();
               
                    if (exp*1000 > currentTime) {
                        console.log(exp*1000);
                        console.log(currentTime);
                        //session validate
                        const user: User | null = await getUser(address);
                        if (user != null) {
                            const payload: JwtPayload = {
                                address: address,
                                username: user.username
                            }
                            const newToken: string = jwtSignWithHashSecret(payload, 60);
                            resBody = {
                                user: user,
                                token: newToken
                            }
                            await addJwtToken(newToken);
                        }
                    }
                }
            }
        }
        finally {
            res.json(resBody);
        }
    })
    app.post('/sign-in', async (req: Request, res: Response): Promise<void> => {
        let resBody: {user: User, token: string} | {} = {};
        try {
            const reqBody:
                {
                    address: string,
                    username: string
                }
                = req.body;
            const address: string = reqBody.address;
            const username: string = reqBody.username
            let user: User | null = await getUserWithTransaction(address);
            if (user != null) {
                //if user is existed, then send the user to FE          
            } else {
                //if not, create new user
                user = {
                    address: address,
                    username: username,
                    asset: 0
                }
                await addUser(user);
            }
            const payload: JwtPayload = {
                address: address,
                username: username
            }
            const token: string = jwtSignWithHashSecret(payload, 60);
            await addJwtToken(token);
            resBody = {
                user: user,
                token: token
            }
        }
        finally {
            res.json(resBody);
        }
    })



} 
