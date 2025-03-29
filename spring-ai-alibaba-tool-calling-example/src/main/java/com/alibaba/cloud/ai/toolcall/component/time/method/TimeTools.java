package com.alibaba.cloud.ai.toolcall.component.time.method;

import com.alibaba.cloud.ai.toolcall.component.time.TimeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;

public class TimeTools {
    private static final Logger logger = LoggerFactory.getLogger(TimeTools.class);

    @Tool(description = "Get the time of a specified city.")
    public String  getCityTimeMethod(@ToolParam(description = "Time zone id, such as Asia/Shanghai") String timeZoneId) {
        logger.info("The current time zone is {}", timeZoneId);
        return String.format("The current time zone is %s and the current time is " + "%s", timeZoneId,
                TimeUtils.getTimeByZoneId(timeZoneId));
    }
}
