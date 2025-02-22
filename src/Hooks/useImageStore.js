import { create } from 'zustand';
import axios from 'axios';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MDIwNDk2MywianRpIjoiMTMxZTc4ZDUtOTlhZi00NDM2LWExMDItZTQ0ZGQ3NWYzM2YxIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFkbWluIiwibmJmIjoxNzQwMjA0OTYzLCJjc3JmIjoiNzZjZWMyZDYtMDJlMC00MGY5LWE2YjktOTgxYzVhOTY0MzUwIiwiZXhwIjoxNzQwMjkxMzYzfQ.7RCYY69qvos2E5I7o3nhwtEl9GpuXA6ekZEqCS07tog";

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
    // 검색창에서 선택한 이미지 그룹의 전체 이미지 조회 (일반 검수)
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

    exceptionGroupImages: {},
    // 검색창에서 선택한 이미지 그룹의 전체 이미지 조회 (예외 검수)
    fetchExceptionGroupImages: async (evtnum) => {
        try {
            const response = await axios.get('http://localhost:5000/inspection/exception', {
                params: { evtnum },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const images = response.data.images;            
            set((state) => ({
                exceptionGroupImages: { ...state.exceptionGroupImages, [evtnum]: images }
            }));
            return images;
        } catch (error) {
            console.error("Exception Group images fetch error:", error);
            return [];
        }
    }
    
    
}));

export default useImageStore;
