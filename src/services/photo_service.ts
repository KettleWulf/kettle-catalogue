import prisma from "../prisma"
import { CreatePhotoData, UpdatePhotoData } from "../types/Photo.types";



// Get all photos on users account
export const getPhotosByUserId = (userId: number) => {
	return prisma.photo.findMany({
		where: {
			user_id: userId,
		},
	});
};

// Get single photo from users account
export const getSinglePhoto = (photoId: number) => {
    return prisma.photo.findUniqueOrThrow({
		where: {
			id: photoId,
		},
	});
}

// Create new photo
export const createPhoto = (data: CreatePhotoData, userId: number) => {
    return prisma.photo.create({
        data: {
            ...data, 
            user: { connect: { id: userId } }, 
        },
    });
};

// Update an existing photo
export const updatePhoto = (data: UpdatePhotoData, photoId: number) => {
	return prisma.photo.update({
		where: {
			id: photoId,
		},
		data,
	});
}

// Un-link photo
export const unlinkPhoto = (photoId: number) => {
	return prisma.photo.update({
        where: { id: photoId },
        data: { albums: { disconnect: [] } },
    });
}

// Delete photo
export const deletePhoto = (photoId: number) => {
	return prisma.photo.delete({
        where: { id: photoId },
    });
}