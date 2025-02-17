import { create } from 'zustand';
import axios from 'axios';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTczOTc2MTA1MCwianRpIjoiMWZiNTg2MzktZjcyMi00Y2I3LWI3MzAtZGQ0OTRkOTE2M2NmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFkbWluIiwibmJmIjoxNzM5NzYxMDUwLCJjc3JmIjoiZTNkNGU1MjYtOWIyOS00ZWQ0LWFkMmQtMGM0ZWRmNzczYTliIiwiZXhwIjoxNzM5ODQ3NDUwfQ.upcExpHp2m_XzX4cbQqn82h1Yjh2aVfGeOL2sRBm9N4";

const useImageStore = create((set, get) => ({
    groupedImages: [],
    setGroupedImages: (groups) => set({ groupedImages: Array.isArray(groups) ? groups : [] }),
    deleteImage: (imageId) => set((state) => ({
        groupImages: Object.fromEntries(
          Object.entries(state.groupImages).map(([evtnum, images]) => [
            evtnum,
            images.filter(img => img.imageId !== imageId)
          ])
        ),
        groupedImages: state.groupedImages.map(group => ({
          ...group,
          imageCount: group.imageCount - 1
        })).filter(group => group.imageCount > 0)
      })),
    
      deleteMultipleImages: (imageIds) => set((state) => {
        const newGroupImages = Object.fromEntries(
          Object.entries(state.groupImages).map(([evtnum, images]) => [
            evtnum,
            images.filter(img => !imageIds.includes(img.imageId))
          ])
        );
        
        const newGroupedImages = state.groupedImages.map(group => ({
          ...group,
          imageCount: (newGroupImages[group.evtnum] || []).length
        })).filter(group => group.imageCount > 0);
    
        return {
          groupImages: newGroupImages,
          groupedImages: newGroupedImages
        };
      }),

    deleteGroup: (evtnum) =>
        set((state) => ({
            groupedImages: state.groupedImages.filter((group) => group.evtnum !== evtnum),
        })),
    updateExceptionStatus: (evtnum, status) =>
        set((state) => ({
            groupedImages: state.groupedImages.map((group) =>
                group.evtnum === evtnum
                    ? { ...group, exception_status: status }
                    : group
            ),
        })),
    updateIsClassified: (evtnum) =>
        set((state) => ({
            groupedImages: state.groupedImages.map((group) =>
                group.evtnum === evtnum
                    ? { ...group, is_classified: true }
                    : group
            ),
        })),
    updateImageCount: (evtnum, count) =>
        set((state) => ({
            groupedImages: state.groupedImages.map((group) =>
                group.evtnum === evtnum
                    ? { ...group, imageCount: count }
                    : group
            ),
        })),
    groupImages: {},
    fetchGroupImages: async (evtnum) => {
        if (get().groupImages[evtnum]) {
            return get().groupImages[evtnum];
        }
        try {
            const response = await axios.get('http://localhost:5000/inspection/normal', {
                params: { evtnum },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const images = response.data.images;
            set((state) => ({
                groupImages: { ...state.groupImages, [evtnum]: images }
            }));
            return images;
        } catch (error) {
            console.error("Group images fetch error:", error);
            return [];
        }
    },
}));

export default useImageStore;
