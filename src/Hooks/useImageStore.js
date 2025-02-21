import { create } from 'zustand';
import axios from 'axios';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc0MDEyNzI0NCwianRpIjoiOGQ4YmNhY2YtZWI0My00ZjFhLTkxNDEtNjNiOTNjOWRiMTdhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6ImFkbWluIiwibmJmIjoxNzQwMTI3MjQ0LCJjc3JmIjoiNjA3OGRmNzktZWU2Ny00ZmMwLWJjMWMtOWQzOGFlOWJkYTdlIiwiZXhwIjoxNzQwMjEzNjQ0fQ.E5cmh2Y9El_MATXmNDsnH9wlhYbTlgJ7wD44Pyf30PQ";

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
        console.log('Fetching exception group images for evtnum:', evtnum); // 요청 시작 로그
        try {
            const response = await axios.get('http://localhost:5000/inspection/exception', {
                params: { evtnum },
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('API Response:', response); // 전체 응답 로그
            console.log('Fetched Exception Group Images:', response.data); // 응답 데이터 로그
            const images = response.data.images;
            console.log('Extracted images:', images); // 추출된 이미지 배열 로그
            set((state) => ({
                exceptionGroupImages: { ...state.exceptionGroupImages, [evtnum]: images }
            }));
            console.log('Updated state:', get().exceptionGroupImages); // 업데이트된 상태 로그
            return images;
        } catch (error) {
            console.error("Exception Group images fetch error:", error);
            console.error("Error details:", error.response ? error.response.data : 'No response data');
            return [];
        }
    }
    
    
}));

export default useImageStore;
