import jwt, {JwtPayload as JwtLibraryPayload} from 'jsonwebtoken';
import { decode } from 'punycode';
import { JwtDecodedToken, JwtPayload } from '../type';


export const jwtSignWithHashSecret
  = (payload: JwtPayload, 
    expiredInSecond: number): string => {
    let result: string = '';

    const hashSecret: string | undefined = process.env.HASH_SECRET;
    if (typeof hashSecret != 'undefined') {
      result = jwt.sign(payload, hashSecret, {expiresIn: expiredInSecond});
    }
    return result;
  }

export const jwtDecodeWithHashSecret =
    (token: string) => {

      let result: JwtDecodedToken|null = null;
      let rawResult: JwtLibraryPayload | string = '';
      const hashSecret: string | undefined = process.env.HASH_SECRET;
      if (typeof hashSecret != 'undefined') {
       try {
        rawResult = jwt.verify(token, hashSecret);
       } catch(err: any){
       }
      }
      if (typeof rawResult != 'string' 
      && typeof rawResult.iat != 'undefined' 
      && typeof rawResult.exp != 'undefined'){
        result = {
          address: rawResult.address,
          username: rawResult.username,
          iat: rawResult.iat,
          exp: rawResult.exp
        }
      }
      return result;
    }