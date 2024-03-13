# cloudflare-42

cloudflare-42 is a Cloudflare Workers project powered by Vectorize, designed to handle PDF documents related to Legal and Migration domains with the ultimate goal of text extraction, indexing, and search capabilities.

## Getting Started

To get started, follow these steps:

**Clone** the repository and navigate into the project directory:

```bash
git https://github.com/leifermendez/cloudflare-42
cd cloudflare-42
```

**Install** dependencies:

```bash
pnpm install
```

**Setup DB Index**

> For this step you need previous pay [developer plan](https://www.cloudflare.com/es-es/plans/developer-platform/)

```
npx wrangler vectorize create your_db_index --preset @cf/baai/bge-large-en-v1.5
```

**Configure** your environment variables by creating a `wrangler.toml` file with the necessary parameters:

```
cp wrangler-example.toml wrangler.toml
```

```
[[vectorize]]
binding = "VECTORIZE_INDEX"
index_name = "your_db_index"

[vars]
CLOUDFLARE_ACCOUNT_ID = ""
CLOUDFLARE_API_TOKEN = ""

```

4. Start the development server:

```bash
pnpm run dev
```

## Endpoints

### Text Extraction

POST ingest PDF

```bash
curl  -X POST \
  'http://127.0.0.1:8787/ingest/data' \
  --header 'Accept: */*' \
  --form 'file=@c:\Ficha Abogado .txt'
```

### Text Search

Search for specific text in PDF documents:

```bash
curl  -X POST \
  'http://localhost:8787/chat/llama' \
  --header 'Accept: */*' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "question":"Que servicios ofrecen?"
}'
```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.
