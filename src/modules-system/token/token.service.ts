import { Injectable } from '@nestjs/common';
import {
  ACCESS_TOKEN_SECRET
} from '../../common/constant/app.constant';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService {
  createTokens(user: Omit<any, 'mat_khau'>) {
    const accessToken = jwt.sign({ ...user }, ACCESS_TOKEN_SECRET as string, {
      expiresIn: '1h',
    });
    return {
      accessToken: accessToken
    };
  }

  verifyAccessToken(accessToken: string, options?: jwt.VerifyOptions) {
    const decode = jwt.verify(accessToken, ACCESS_TOKEN_SECRET as string, options);
    return decode;
  }

}
