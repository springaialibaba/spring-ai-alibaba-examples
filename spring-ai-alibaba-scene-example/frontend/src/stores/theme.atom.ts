import { atom } from "jotai";
import { atomWithStorage } from "jotai/vanilla/utils";

// 基础原子 可读写
const theme = atomWithStorage("theme", "light");

const readOnlyTheme = atom((get) => {
    return get(theme);
});

const editableTheme = atom(
    (get) => get(theme),
    (get, set, newValue: string) => {
        set(theme, newValue);
    },
);

export { readOnlyTheme, editableTheme };
