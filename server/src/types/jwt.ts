import {JwtPayload} from 'jsonwebtoken'

export interface AuthTokenPayload extends JwtPayload {
  username: string
}