# 使用 Spring AI Alibaba 进行文本分类

调用大模型进行文本分类，每个 endpoint 的 prompt 都逐步改进，以提高文本分类任务的质量。

## 使用示例

1. Class Names

    ```bash
    curl -X POST http://localhost:10093/classify/class-names \
      -H "Content-Type: application/json" \
      -d '{"text": "Basketball fans can now watch the game on the brand-new NBA app for Apple Vision Pro."}' 
      
    ```

2. Class Descriptions

    ```bash
    curl -X POST http://localhost:10093/classify/class-descriptions \
      -H "Content-Type: application/json" \
      -d '{"text": "Basketball fans can now watch the game on the brand-new NBA app for Apple Vision Pro."}'
    ```
3. Few Shots Prompt
    
    ```bash
    curl -X POST http://localhost:10093/classify/few-shots-prompt \
      -H "Content-Type: application/json" \
      -d '{"text": "Basketball fans can now watch the game on the brand-new NBA app for Apple Vision Pro."}'
    ```

4. Few Shots History

    ```bash
     curl -X POST http://localhost:10093/classify/few-shots-history \
      -H "Content-Type: application/json" \
      -d '{"text": "Basketball fans can now watch the game on the brand-new NBA app for Apple Vision Pro."}'
    ```

5. Structured Output
    
    ```bash
    curl -X POST http://localhost:10093/classify/structured-output \
      -H "Content-Type: application/json" \
      -d '{"text": "Basketball fans can now watch the game on the brand-new NBA app for Apple Vision Pro."}'
    ```
