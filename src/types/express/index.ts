import { AuthenticatedUser } from "../Auth.types"

declare global {
	namespace Express {
		export interface Request {
			user?: AuthenticatedUser;
		}
	}
}

