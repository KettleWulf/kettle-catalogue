import prisma from "../prisma"
import { CreateOrUpdateAlbumData } from "../types/Album.types";
import { PhotoId, ValidatedPhotoData } from "../types/Photo.types"



// Get all albums on users account
export const getAlbumsByUserId = (userId: number) => {
	return prisma.album.findMany({
		where: {
			user_id: userId,
		},
	});
};

// Get single album from users account
export const getSingleAlbum = (albumId: number) => {
    return prisma.album.findUniqueOrThrow({
		where: {
			id: albumId,
		},
        include: {
            photos: true,
        }
	});
}

// Create new album
export const createAlbum = (data: CreateOrUpdateAlbumData, userId: number) => {
    return prisma.album.create({
        data: {
            ...data, 
            user: { connect: { id: userId } }, 
        },
    });
};

// Update an existing album
export const updateAlbum = (data: CreateOrUpdateAlbumData, albumId: number) => {
	return prisma.album.update({
		where: {
			id: albumId,
		},
		data,
	});
}

// Add photo or photos to album
export const addPhotoToAlbum = async (albumId: number, photoIdOrIds: PhotoId | PhotoId[]) => {
	return prisma.album.update({
		where: {
			id: albumId,
		},
		data: {
			photos: {
				connect: photoIdOrIds,
			},
		},
		include: {
			photos: true,
		},
	});
}

// Remove single photo from album
export const unlinkSinglePhoto = (albumId: number, photoId: number) => {
    return prisma.album.update({
        where: {
            id: albumId,
        },
        data: {
            photos: {
                disconnect: {
                    id: photoId
                }
            }
        }
    });
}

// Un-link album before deletion
export const unlinkAlbum = (albumId: number) => {
	return prisma.album.update({
        where: { id: albumId },
        data: { photos: { disconnect: [] } },
    });
}

// Delete album after being un-linked
export const deleteAlbum = (albumId: number) => {
	return prisma.album.delete({
        where: { id: albumId },
    });
}

export const validatePhotos = async (photoCollection: PhotoId[], userId: number) => {
    
    const photosInDB = await Promise.all(
        photoCollection.map(async (photo) => {
            const foundPhoto = await prisma.photo.findUnique({
                where: { id: photo.id },
                select: { id: true, user_id: true } 
            });
            return foundPhoto; 
        })
    );

    const existingPhotos = photosInDB.filter(photo => photo !== null) as ValidatedPhotoData[];

    const userPhotos = existingPhotos.filter(photo => photo.user_id === userId);

    return userPhotos;
};