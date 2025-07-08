import { Post } from "@/model/Post";
import { create } from "zustand";

interface ModalState {
  mode: "new" | "comment";
  data: Post | null;
  setMode: (mode: "new" | "comment") => void;
  setData: (data: Post | null | undefined) => void;
  reset: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  mode: "new",
  data: null,
  setMode(mode) {
    set({ mode });
  },
  setData(data) {
    set({ data });
  },
  reset() {
    set({
      mode: "new",
      data: null,
    });
  },
}));
