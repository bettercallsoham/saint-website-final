/// <reference types="vite/client" />

declare module "virtual:gallery-images" {
	export interface GalleryImageAsset {
		url: string;
		name: string;
		modifiedAt: string;
	}

	const galleryImages: GalleryImageAsset[];
	export default galleryImages;
}
