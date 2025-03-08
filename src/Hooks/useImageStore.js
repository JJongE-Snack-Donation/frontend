import { create } from 'zustand';
import api from '../Api';

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
    
        const newRelatedImages = state.relatedImages.filter(img => !imageIds.includes(img.imageId));
    
        return {
            groupImages: newGroupImages,
            groupedImages: newGroupedImages,
            relatedImages: newRelatedImages
        };
    }),
    

    deleteGroup: (evtnum) =>
        set((state) => ({
            groupedImages: state.groupedImages.filter((group) => group.evtnum !== evtnum),
        })),


    // 예외 처리 후 모달창에서 없어진 이미지 데이터 관리
    removeExceptionImages: (imageIds, page) => set((state) => {
        if (page !== 'normal') return state;
      
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
      
        const newRelatedImages = state.relatedImages.filter(img => !imageIds.includes(img.imageId));
      
        return {
          groupImages: newGroupImages,
          groupedImages: newGroupedImages,
          relatedImages: newRelatedImages
        };
      }),
      
      


    updateExceptionStatus: (evtnum, status) =>
        set((state) => ({
            groupedImages: state.groupedImages.map((group) =>
                group.evtnum === evtnum ? { ...group, exception_status: status } : group
            ),
        })),

    updateIsClassified: (evtnum) =>
        set((state) => ({
            groupedImages: state.groupedImages.map((group) =>
                group.evtnum === evtnum ? { ...group, is_classified: true } : group
            ),
        })),

    updateImageCount: (evtnum, count) =>
        set((state) => ({
            groupedImages: state.groupedImages.map((group) =>
                group.evtnum === evtnum ? { ...group, imageCount: count } : group
            ),
        })),

    relatedImages: [],
    setRelatedImages: (images) => set({ relatedImages: Array.isArray(images) ? images : [] }),

    groupImages: {},

// 일반 검수 이미지 조회
fetchGroupImages: async (evtnum, projectId) => {
    if (get().groupImages[`${evtnum}-${projectId}`]) {
        set({ relatedImages: get().groupImages[`${evtnum}-${projectId}`] });
        return get().groupImages[`${evtnum}-${projectId}`];
    }
    try {
        const response = await api.get('/inspection/normal', {
            params: { evtnum, project_id: projectId },
            headers: { 
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        const images = response.data.images;
        set((state) => ({
            groupImages: { ...state.groupImages, [`${evtnum}-${projectId}`]: images },
            relatedImages: images
        }));
        return images;
    } catch (error) {
        console.error("Group images fetch error:", error);
        return [];
    }
},



    exceptionGroupImages: {},

// 예외 검수 이미지 조회
fetchExceptionGroupImages: async (evtnum, projectId) => {
    try {
        const response = await api.get('/inspection/exception', {
            params: { evtnum, project_id: projectId },
            headers: { 
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        const images = response.data.images;
        set((state) => ({
            exceptionGroupImages: { ...state.exceptionGroupImages, [`${evtnum}-${projectId}`]: images },
            relatedImages: images
        }));
        return images;
    } catch (error) {
        console.error("Exception Group images fetch error:", error);
        return [];
    }
},


    completedGroupImages: {},

// 검수 완료된 이미지 조회
fetchCompletedGroupImages: async (evtnum, projectId) => {
    try {
        const response = await api.get('/images', {
            params: { evtnum, project_id: projectId },
            headers: { 
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        
        console.log('완료된 이미지 응답:', response.data);

        const images = response.data.data?.groups[0].images || [];
        
        const processedImages = images.map(img => ({
            ...img,
            imageId: img.imageId || img._id,
            imageUrl: img.imageUrl || img.thumbnailUrl, // 올바른 필드를 사용
            thumbnail: img.thumbnailUrl,
            FileName: img.fileName || ''
        }));

        console.log('처리된 이미지 데이터:', processedImages);

        set((state) => ({
            completedGroupImages: { ...state.completedGroupImages, [`${evtnum}-${projectId}`]: processedImages },
            relatedImages: processedImages
        }));
        
        return processedImages;
    } catch (error) {
        console.error("Completed Group images fetch error:", error);
        return [];
    }
}






}));

export default useImageStore;
