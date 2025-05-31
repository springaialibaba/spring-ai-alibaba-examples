package com.alibaba.example.controller;

import com.alibaba.cloud.ai.graph.CompiledGraph;
import com.alibaba.cloud.ai.graph.OverAllState;
import com.alibaba.cloud.ai.graph.exception.GraphStateException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/graph")
public class GraphController {

    private final CompiledGraph graph;

    public GraphController(CompiledGraph graph) {
        this.graph = graph;
    }

    @PostMapping("/invoke")
    public ResponseEntity<Map<String, Object>> invoke(
            @RequestBody Map<String, Object> inputs) throws GraphStateException {

        // 执行图
        var resultFuture = graph.invoke(inputs);

        return ResponseEntity.ok(resultFuture.get().data());
    }

    @GetMapping(path = "/mock/http")
    public String mock(@RequestParam("ticketId") String ticketId,
                       @RequestParam("category") String category) {
        Map<String, String> resp = Map.of(
                "status", "OK",
                "ticketId", ticketId,
                "category", category
        );
        return resp.toString();
    }

}
