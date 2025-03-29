package com.alibaba.cloud.ai.toolcall.component.baidutranslate.method;

import com.alibaba.cloud.ai.toolcall.component.baidutranslate.BaidutranslateProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.http.HttpHeaders;
import org.springframework.util.DigestUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

/**
 * @author yingzi
 * @date 2025/3/27:11:13
 */
public class BaidutranslateTools {

    private static final Logger logger = LoggerFactory.getLogger(BaidutranslateTools.class);

    private static final String TRANSLATE_HOST_URL = "https://fanyi-api.baidu.com/api/trans/vip/translate";

    private static final Random random = new Random();
    private final WebClient webClient;
    private final String appId;
    private final String secretKey;

    public BaidutranslateTools(BaidutranslateProperties properties) {
        assert StringUtils.hasText(properties.getAppId());
        this.appId = properties.getAppId();
        assert StringUtils.hasText(properties.getSecretKey());
        this.secretKey = properties.getSecretKey();

        this.webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/x-www-form-urlencoded")
                .build();
    }

    @Tool(description = "Baidu translation function for general text translation")
    public Map<String, String> baiduTranslateMethod(@ToolParam(description = "Content that needs to be translated") String q,
                                                    @ToolParam(description = "Source language that needs to be translated") String from,
                                                    @ToolParam(description = "Target language to translate into") String to) {
        if (!StringUtils.hasText(q) || !StringUtils.hasText(from)
                || !StringUtils.hasText(to)) {
            return null;
        }
        String salt = String.valueOf(random.nextInt(100000));
        String sign = DigestUtils.md5DigestAsHex((appId + q + salt + secretKey).getBytes());
        String url = UriComponentsBuilder.fromHttpUrl(TRANSLATE_HOST_URL).toUriString();
        try {
            MultiValueMap<String, String> body = constructRequestBody(q, from, to, salt, sign);
            Mono<String> responseMono = webClient.post().uri(url).bodyValue(body).retrieve().bodyToMono(String.class);

            String responseData = responseMono.block();
            assert responseData != null;
            logger.info("Translation request: {}, response: {}", q, responseData);

            return parseResponse(responseData);

        }
        catch (Exception e) {
            logger.error("Failed to invoke translate API due to: {}", e.getMessage());
            return null;
        }
    }

    private MultiValueMap<String, String> constructRequestBody(String q, String from, String to, String salt, String sign) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("q", q);
        body.add("from", from);
        body.add("to", to);
        body.add("appid", appId);
        body.add("salt", salt);
        body.add("sign", sign);
        return body;
    }

    private Map<String, String> parseResponse(String responseData) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            Map<String, String> translations = new HashMap<>();
            TranslationResponse responseList = mapper.readValue(responseData, TranslationResponse.class);
            String to = responseList.to;
            List<TranslationResult> translationsList = responseList.trans_result;
            if (translationsList != null) {
                for (TranslationResult translation : translationsList) {
                    String translatedText = translation.dst;
                    translations.put(to, translatedText);
                    logger.info("Translated text to {}: {}", to, translatedText);
                }
            }
            return translations;
        }
        catch (Exception e) {
            try {
                Map<String, String> responseList = mapper.readValue(responseData,
                        mapper.getTypeFactory().constructMapType(Map.class, String.class, String.class));
                logger.info(
                        "Translation exception, please inquire Baidu translation api documentation to info error_code:{}",
                        responseList);
                return responseList;
            }
            catch (Exception ex) {
                logger.error("Failed to parse json due to: {}", ex.getMessage());
                return null;
            }
        }
    }

    public record TranslationResult(String src, String dst) {
    }

    public record TranslationResponse(String from, String to, List<TranslationResult> trans_result) {
    }
}
