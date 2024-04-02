import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthenticationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException('Authorization header not found');
      }

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer') {
        throw new UnauthorizedException('Invalid authorization header format. Format is: Bearer <token>');
      }

      const secret = process.env.JWT_SECRET;
      const algorithm = process.env.JWT_ALG;

      console.log("jwt secret: ", secret)
      console.log("jwt algo: ", algorithm)

      // Verify the token
      jwt.verify(token, secret, { algorithms: [algorithm] }, (err, user) => {
        if (err) {
          throw new UnauthorizedException('Invalid token');
        }

        /* toggle when more information about user is needed */
        // req.user = user;
        next();
      });

    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }
}
