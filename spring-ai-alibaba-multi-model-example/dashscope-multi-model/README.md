# Spring AI Alibaba Dashscope Multi Model Example

此示例演示了如何使用 Spring AI Alibaba Starter 与 Dashscope 的多模态服务。

## 导入依赖

在此项目中，需要依次导入以下依赖项。

> 其中，javacv 是为了提取视频中的图片帧。

```xml

<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
<groupId>com.alibaba.cloud.ai</groupId>
<artifactId>spring-ai-alibaba-starter</artifactId>
<version>${spring-ai-alibaba.version}</version>
</dependency>

<dependency>
<groupId>org.bytedeco</groupId>
<artifactId>javacv-platform</artifactId>
<version>1.5.9</version>
</dependency>
```

## 初始化客户端

接着，需要初始化一个 Spring AI Alibaba 的 ChatClient 对象实例：

```java
public MultiModelController(ChatModel chatModel){

		this.dashScopeChatClient=ChatClient.builder(chatModel).build();
		}
```

## Image

对图片的识别为：

```java
@GetMapping("/image")
public String image(
@RequestParam(value = "prompt", required = false, defaultValue = DEFAULT_PROMPT)
        String prompt
				)throws Exception{

				List<Media> mediaList=List.of(
		new Media(
		MimeTypeUtils.IMAGE_PNG,
		new URI("https://dashscope.oss-cn-beijing.aliyuncs.com/images/dog_and_girl.jpeg").toURL()
		)
		);

		UserMessage message=new UserMessage(prompt,mediaList);
		message.getMetadata().put(DashScopeChatModel.MESSAGE_FORMAT,MessageFormat.IMAGE);

		ChatResponse response=dashScopeChatClient.prompt(
		new Prompt(
		message,
		DashScopeChatOptions.builder()
		.withModel(DEFAULT_MODEL)
		.withMultiModel(true)
		.build()
		)
		).call().chatResponse();

		return response.getResult().getOutput().getText();
		}
```

访问对应接口，可以看到如下输出：

```text
这是一张在海滩上拍摄的照片，照片中有一位女士和一只狗。女士坐在沙滩上，微笑着与狗互动，狗伸出前爪与她握手。背景是大海和天空，阳光洒在她们身上，营造出温暖和谐的氛围。
```

JSON 数据如下所示：

```json
{
  "result": {
    "output": {
      "messageType": "ASSISTANT",
      "metadata": {
        "finishReason": "STOP",
        "role": "ASSISTANT",
        "id": "da85f27b-7809-968d-9a00-232529d1ad98",
        "messageType": "ASSISTANT"
      },
      "toolCalls": [],
      "content": "这是一张在海滩上拍摄的照片，照片中有一位女士和一只狗。女士坐在沙滩上，微笑着与狗互动，狗伸出前爪与她握手。背景是大海和天空，阳光洒在她们身上，营造出温暖和谐的氛围。"
    },
    "metadata": {
      "contentFilterMetadata": null,
      "finishReason": "STOP"
    }
  },
  "metadata": {
    "id": "da85f27b-7809-968d-9a00-232529d1ad98",
    "model": "",
    "rateLimit": {
      "tokensLimit": 0,
      "tokensRemaining": 0,
      "requestsReset": "PT0S",
      "tokensReset": "PT0S",
      "requestsLimit": 0,
      "requestsRemaining": 0
    },
    "usage": {
      "promptTokens": 1271,
      "totalTokens": 1326,
      "generationTokens": 55
    },
    "promptMetadata": [],
    "empty": true
  },
  "results": [
    {
      "output": {
        "messageType": "ASSISTANT",
        "metadata": {
          "finishReason": "STOP",
          "role": "ASSISTANT",
          "id": "da85f27b-7809-968d-9a00-232529d1ad98",
          "messageType": "ASSISTANT"
        },
        "toolCalls": [],
        "content": "这是一张在海滩上拍摄的照片，照片中有一位女士和一只狗。女士坐在沙滩上，微笑着与狗互动，狗伸出前爪与她握手。背景是大海和天空，阳光洒在她们身上，营造出温暖和谐的氛围。"
      },
      "metadata": {
        "contentFilterMetadata": null,
        "finishReason": "STOP"
      }
    }
  ]
}
```

## Video

在对 Video 的识别中，我们需要提取其中的图片帧，而后将图片帧作为输入获得输出：

> Note: 在启动此示例项目，不要立即访问 video 接口。因为需要等待图片帧提取完成，否则会报错。

帧提取代码如下（为了演示效果，我们以 10 为间隔，挑选图片集合输入给大模型）：

```java
public static void getVideoPic() {

    List<String> strList = new ArrayList<>();
    File dir = new File(framePath);
    if (!dir.exists()) {
        dir.mkdirs();
    }

    try (
            FFmpegFrameGrabber ff = new FFmpegFrameGrabber(videoUrl.getPath());
            Java2DFrameConverter converter = new Java2DFrameConverter()
    ) {
        ff.start();
        ff.setFormat("mp4");

        int length = ff.getLengthInFrames();

        Frame frame;
        for (int i = 1; i < length; i++) {
            frame = ff.grabFrame();
            if (frame.image == null) {
                continue;
            }
            BufferedImage image = converter.getBufferedImage(frame); ;
            String path = framePath + i + ".png";
            File picFile = new File(path);
            ImageIO.write(image, "png", picFile);
            strList.add(path);
        }
        IMAGE_CACHE.put("img", strList);
        ff.stop();
    }
    catch (Exception e) {
        log.error(e.getMessage());
    }

}
```

```java
@GetMapping("/video")
public String video(
        @RequestParam(value = "prompt", required = false, defaultValue = DEFAULT_PROMPT)
        String prompt
) {

    List<Media> mediaList = FrameExtraHelper.createMediaList(10);

    UserMessage message = new UserMessage(prompt, mediaList);
    message.getMetadata().put(DashScopeChatModel.MESSAGE_FORMAT, MessageFormat.VIDEO);

    ChatResponse response = dashScopeChatClient.prompt(
            new Prompt(
                    message,
                    DashScopeChatOptions.builder()
                            .withModel(DEFAULT_MODEL)
                            .withMultiModel(true)
                            .build()
            )
    ).call().chatResponse();

    return response.getResult().getOutput().getText();
}
```

输出如下：

```text
这组图片展示了一位女士坐在沙滩上，背对着镜头，面向大海。她穿着一件粉色的连衣裙，头发自然垂下。背景是广阔的海洋和蓝天白云，天气晴朗，海面平静。这位女士似乎在享受宁静的海滩时光，可能是在思考或放松。整个场景给人一种宁静和平静的感觉。
```
