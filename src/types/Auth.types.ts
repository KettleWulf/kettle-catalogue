export type AuthenticatedUser = {
	id: number;
	email: string;
	first_name: string | null;
    last_name: string | null;
}