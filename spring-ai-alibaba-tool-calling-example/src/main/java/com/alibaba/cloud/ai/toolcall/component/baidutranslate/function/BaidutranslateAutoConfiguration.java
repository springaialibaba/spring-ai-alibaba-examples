package com.alibaba.cloud.ai.toolcall.component.baidutranslate.function;

import com.alibaba.cloud.ai.toolcall.component.baidutranslate.BaidutranslateProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

@Configuration
@ConditionalOnClass(BaidutranslateService.class)
@ConditionalOnProperty(prefix = "spring.ai.toolcalling.baidutranslate", name = "enabled", havingValue = "true")
public class BaidutranslateAutoConfiguration {

    @Bean(name = "baiduTranslateFunction")
    @ConditionalOnMissingBean
    @Description("Baidu translation function for general text translation")
    public BaidutranslateService baiduTranslateFunction(BaidutranslateProperties properties) {
        return new BaidutranslateService(properties);
    }

}
