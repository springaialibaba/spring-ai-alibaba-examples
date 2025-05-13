### Spring Ai Alibaba Rag Pgvector Example ###

This section will describe how to create example and call rag service. 

##### Rag Example #####

Local rag example includes two main flows, import document and rag.

Import document includes the following steps:
1. Parse document.
2. Split document to chunks with proper chunk size and delimiters.
3. Convert chunk text to embed vector.
4. Save text and embed vector to vector db including metadata if needed.

Rag includes the following steps:
1. Retrieval trunks from vector db with query.
2. Rerank the retrieved trunks to get score of relevance between query and retrieved trunks.
3. Generate result based on filtered trunks.

For how to run and test local rag example, please refer to the following instructions:



```code
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS vector_store (
id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
content text,
metadata json,
embedding vector(1536)
);

CREATE INDEX ON vector_store USING HNSW (embedding vector_cosine_ops);
```

#### Import File
```bash
curl -X POST http://localhost:8080/ai/rag/importFileV2 \
  -F "file=@/path/to/your/file" 
```
This endpoint allows you to import a file for RAG processing. The file will be processed and stored in the vector database.

#### Search with File ID
```bash
curl -G 'http://localhost:8080/ai/rag/search' \
  --data-urlencode 'messages=what is alibaba?' \
  --data-urlencode 'fileId={fileId}'
```
This endpoint performs a search query within a specific file's content. Replace `{fileId}` with the actual file ID.

#### Delete Files
```bash
curl -X DELETE 'http://localhost:8080/ai/rag/deleteFiles?fileId={fileId}'
```
This endpoint allows you to delete a specific file from the vector database. Replace `{fileId}` with the actual file ID you want to delete.




### Pgvector DockerFile
to [README.md](../../docker-compose/pgvector/README.md)
