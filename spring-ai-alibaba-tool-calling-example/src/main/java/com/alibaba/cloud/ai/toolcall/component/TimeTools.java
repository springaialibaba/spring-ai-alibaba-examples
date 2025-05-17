/*
 * Copyright 2024-2025 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.alibaba.cloud.ai.toolcall.component;

import com.alibaba.cloud.ai.toolcalling.time.GetCurrentTimeByTimeZoneIdService;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;

public class TimeTools {

    private final GetCurrentTimeByTimeZoneIdService timeService;

    public TimeTools(GetCurrentTimeByTimeZoneIdService timeService) {
        this.timeService = timeService;
    }

    @Tool(description = "Get the time of a specified city.")
    public String getCityTime(@ToolParam(description = "Time zone id, such as Asia/Shanghai")
                                    String timeZoneId) {
        return timeService.apply(new GetCurrentTimeByTimeZoneIdService.Request(timeZoneId)).description();
    }

}
