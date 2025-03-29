package com.alibaba.cloud.ai.toolcall.component.weather;

import cn.hutool.extra.pinyin.PinyinUtil;

public class WeatherUtils {

    public static String preprocessLocation(String location) {
        if (containsChinese(location)) {
            return PinyinUtil.getPinyin(location, "");
        }
        return location;
    }

    public static boolean containsChinese(String str) {
        return str.matches(".*[\u4e00-\u9fa5].*");
    }
}
