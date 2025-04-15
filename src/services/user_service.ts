import prisma from "../prisma";
import { CreateUserData, UpdateUserData } from "../types/User.types";

// Create a User
export const createUser = (data: CreateUserData) => {
    return prisma.user.create({
        data,
    });
}

// Updated User
export const updateUser = (userId: number, data: UpdateUserData) => {
	return prisma.user.update({
		where: {
			id: userId,
		},
		data,
	});
}

// Find user by email
export const getUserByEmail = (email: string) => {
	return prisma.user.findUnique({
		where: {
			email: email,
		},
	});
}

// Find user by ID
export const getUserById = (userId: number) => {
	return prisma.user.findUnique({
		where: {
			id: userId,
		},
	});
}
