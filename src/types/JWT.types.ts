import { JwtPayload } from "jsonwebtoken";

export interface JwtAccessTokenPayload extends JwtPayload {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
}

export interface JwtRefreshTokenPayload extends JwtPayload {
    id: number;
}