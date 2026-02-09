/**
 * Cloudinary Integration
 * 
 * This allows you to just upload photos to Cloudinary folders,
 * and they'll automatically appear in your portfolio.
 * 
 * Setup:
 * 1. Create a Cloudinary account
 * 2. Set your cloud name in .env: VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
 * 3. Upload photos to folders like: portfolio/paris/, portfolio/tokyo/
 * 4. Update trips.ts to use folder names instead of individual URLs
 */

// Your Cloudinary cloud name (set in .env file)
export const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';

/**
 * Generate a Cloudinary URL for an image
 */
export function getCloudinaryUrl(
    path: string,
    options: {
        width?: number;
        height?: number;
        quality?: 'auto' | number;
        format?: 'auto' | 'webp' | 'jpg' | 'png';
    } = {}
): string {
    const { width, height, quality = 'auto', format = 'auto' } = options;

    const transforms: string[] = [];

    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    if (quality) transforms.push(`q_${quality}`);
    if (format) transforms.push(`f_${format}`);

    const transformString = transforms.length > 0 ? transforms.join(',') + '/' : '';

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformString}${path}`;
}

/**
 * Generate full-size and thumbnail URLs for a photo
 */
export function getPhotoUrls(path: string): { url: string; thumbnail: string } {
    return {
        url: getCloudinaryUrl(path, { quality: 'auto', format: 'auto' }),
        thumbnail: getCloudinaryUrl(path, { width: 400, quality: 'auto', format: 'auto' }),
    };
}

/**
 * Simple helper to create a photo object from just a filename
 * 
 * Usage:
 *   createPhoto('paris/eiffel-tower.jpg', 'Eiffel Tower at sunset')
 */
export function createPhoto(
    path: string,
    caption: string,
    location?: string,
    date?: string
): {
    id: string;
    url: string;
    thumbnail: string;
    caption: string;
    location: string;
    date: string;
} {
    const urls = getPhotoUrls(path);
    const id = path.replace(/[\/\.]/g, '-').replace(/-+/g, '-');

    return {
        id,
        ...urls,
        caption,
        location: location || '',
        date: date || new Date().toISOString().split('T')[0],
    };
}

/**
 * Batch create photos from a list of filenames
 * 
 * Usage:
 *   createPhotosFromFolder('paris', [
 *     'eiffel-1.jpg',
 *     'louvre-1.jpg',
 *     'seine-1.jpg',
 *   ])
 */
export function createPhotosFromFolder(
    folder: string,
    filenames: string[],
    defaultLocation?: string
) {
    return filenames.map((filename, index) => {
        const path = `${folder}/${filename}`;
        const caption = filename
            .replace(/\.[^/.]+$/, '')  // Remove extension
            .replace(/[-_]/g, ' ')     // Replace dashes/underscores with spaces
            .replace(/\d+$/, '')       // Remove trailing numbers
            .trim();

        return createPhoto(
            path,
            caption || `Photo ${index + 1}`,
            defaultLocation
        );
    });
}
