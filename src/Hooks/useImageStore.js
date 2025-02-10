
import { create } from 'zustand';

const useImageStore = create((set) => ({
    relatedImages: [],
    setRelatedImages: (images) => set({ relatedImages: Array.isArray(images) ? images : [] }),
    deleteImage: (imageId) =>
        set((state) => ({
        relatedImages: state.relatedImages.filter((img) => img.imageId !== imageId),
        })),
    updateExceptionStatus: (imageIds, status) =>
        set((state) => ({
        relatedImages: state.relatedImages.map((img) =>
            imageIds.includes(img.imageId)
            ? { ...img, exception_status: status }
            : img
        ),
        })),

    updateIsClassified: (imageIds) =>
        set((state) => ({
          relatedImages: state.relatedImages.map((img) =>
            imageIds.includes(img.imageId) ? { ...img, is_classified: true } : img
          ),
        })),
}));

export default useImageStore;