import { atom, useAtom } from "jotai";

// 知识库类型定义
export interface KnowledgeBase {
  id: string;
  name: string;
  createdAt: number;
}

// 本地存储键
const STORAGE_KEY = "rag_knowledge_bases";

// 从localStorage加载知识库列表
const loadKnowledgeBasesFromStorage = (): KnowledgeBase[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load knowledge bases from localStorage:", error);
  }
  return [];
};

// 初始化时从localStorage加载数据
const initialKnowledgeBases = loadKnowledgeBasesFromStorage();

// 定义atom存储知识库列表
const knowledgeBasesAtom = atom<KnowledgeBase[]>(initialKnowledgeBases);
const activeKnowledgeBaseAtom = atom<KnowledgeBase | null>(null);

// 创建Hook用于管理知识库
export const useKnowledgeBaseStore = () => {
  const [knowledgeBases, setKnowledgeBases] = useAtom(knowledgeBasesAtom);
  const [activeKnowledgeBase, setActiveKnowledgeBase] = useAtom(
    activeKnowledgeBaseAtom
  );

  // 保存知识库列表到localStorage
  const saveKnowledgeBases = (bases: KnowledgeBase[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bases));
    } catch (error) {
      console.error("Failed to save knowledge bases to localStorage:", error);
    }
  };

  // 创建新知识库
  const createKnowledgeBase = (name: string, id?: string): KnowledgeBase => {
    const timestamp = Date.now();
    const newKnowledgeBase: KnowledgeBase = {
      id: id || `kb_${timestamp}`,
      name,
      createdAt: timestamp,
    };

    const updatedBases = [...knowledgeBases, newKnowledgeBase];
    setKnowledgeBases(updatedBases);
    saveKnowledgeBases(updatedBases);

    return newKnowledgeBase;
  };

  // 删除知识库
  const deleteKnowledgeBase = (id: string) => {
    const updatedBases = knowledgeBases.filter((kb) => kb.id !== id);
    setKnowledgeBases(updatedBases);
    saveKnowledgeBases(updatedBases);

    // 如果删除的是当前选中的知识库，清除当前选择
    if (activeKnowledgeBase?.id === id) {
      setActiveKnowledgeBase(null);
    }

    // 同时删除该知识库的消息历史
    try {
      localStorage.removeItem(`rag_messages_${id}`);
    } catch (error) {
      console.error("Failed to remove knowledge base messages:", error);
    }
  };

  // 更新知识库
  const updateKnowledgeBase = (updatedBase: KnowledgeBase) => {
    const updatedBases = knowledgeBases.map((kb) =>
      kb.id === updatedBase.id ? updatedBase : kb
    );
    setKnowledgeBases(updatedBases);
    saveKnowledgeBases(updatedBases);

    // 如果更新的是当前选中的知识库，也更新当前选择
    if (activeKnowledgeBase?.id === updatedBase.id) {
      setActiveKnowledgeBase(updatedBase);
    }
  };

  // 选择知识库
  const selectKnowledgeBase = (id: string) => {
    const selected = knowledgeBases.find((kb) => kb.id === id);
    if (selected) {
      setActiveKnowledgeBase(selected);
    }
  };

  // 清除选择
  const clearSelection = () => {
    setActiveKnowledgeBase(null);
  };

  return {
    knowledgeBases,
    activeKnowledgeBase,
    createKnowledgeBase,
    deleteKnowledgeBase,
    updateKnowledgeBase,
    selectKnowledgeBase,
    clearSelection,
  };
};
