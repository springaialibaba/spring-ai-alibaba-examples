import { atom, useAtom } from "jotai";
import { getModels } from "../api/base";
import { ModelOption } from "../types";

const modelOptionListAtom = atom<ModelOption[]>([]);
const currentModelAtom = atom<ModelOption>();

export const useModelConfigContext = () => {
  const [modelOptionList, setModelOptionList] = useAtom(modelOptionListAtom);
  const [currentModel, setCurrentModel] = useAtom(currentModelAtom);

  const updateModelOptionList = (list: ModelOption[]) => {
    setModelOptionList(list);
  };

  const chooseModel = (model: ModelOption) => {
    setCurrentModel(model);
  };

  const initModelOptionList = async () => {
    const list = await getModels();
    console.log("list", list);
    updateModelOptionList(
      Array.from(list).map((item) => ({
        label: item.model,
        value: item.model,
        desc: item.desc,
      }))
    );
    const firstModel = {
      label: list[0].model,
      value: list[0].model,
      desc: list[0].desc,
    };
    chooseModel(firstModel);
  };

  return {
    currentModel,
    modelOptionList,
    chooseModel,
    setModelOptionList,
    initModelOptionList,
  };
};
