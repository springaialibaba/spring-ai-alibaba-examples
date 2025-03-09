# 使用 Spring AI Alibaba 执行 SQL

使用示例

```shell
curl localhost:10092/sql \
  -H"Content-type: application/json" \
  -d'{"question":"How many books has Craig Walls written?"}'
```

返回值

```json
{
  "sqlQuery": "SELECT COUNT(*) FROM Books INNER JOIN Authors ON Books.author_ref = Authors.id WHERE Authors.firstName = 'Craig' AND Authors.lastName = 'Walls'",
  "results": [
    {
      "COUNT(*)": 4
    }
  ]
}
```