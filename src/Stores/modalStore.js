// 상태 유지용
import { create } from 'zustand';

export const useModalStore = create((set) => ({
  // 모달 상태
  checkedImages: [],
  relatedImages: [],
  
  // 검색 상태
  searchTerm: '',
  currentPage: 1,
  
  // 액션 함수
  setCheckedImages: (checked) => set({ checkedImages: checked }),
  setRelatedImages: (images) => set({ relatedImages: images }),
  setSearchState: (term, page) => set({ searchTerm: term, currentPage: page })
}));
