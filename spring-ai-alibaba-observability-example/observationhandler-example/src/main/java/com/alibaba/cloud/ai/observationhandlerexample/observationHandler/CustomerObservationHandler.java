package com.alibaba.cloud.ai.observationhandlerexample.observationHandler;

import io.micrometer.observation.Observation;
import io.micrometer.observation.ObservationHandler;
import org.springframework.ai.chat.observation.ChatModelObservationContext;

/**
 * @Author: XiaoYunTao
 * @Date: 2024/12/31
 */
public class CustomerObservationHandler implements ObservationHandler<ChatModelObservationContext> {

    @Override
    public void onStart(ChatModelObservationContext context) {
        System.out.println("CustomerObservationHandler Star! ChatModelObservationContext: " + context.toString() );
    }

    @Override
    public void onStop(ChatModelObservationContext context) {
        System.out.println("CustomerObservationHandler onStop! ChatModelObservationContext: " + context.toString() );
    }

    @Override
    public boolean supportsContext(Observation.Context context) {
        return true;
    }
}
