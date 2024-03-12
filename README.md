npx wrangler vectorize create pdfdb --preset @cf/baai/bge-large-en-v1.5
https://www.cloudflare.com/es-es/plans/developer-platform/

curl -X POST \
 'https://localhost/chat/llama' \
 --header 'Accept: _/_' \
 --header 'Content-Type: application/json' \
 --data-raw '{
"question": "Quisiera que me ayuden con mis temas migratorios"
}'

curl -X POST \
 'http://127.0.0.1:8787/ingest/data' \
 --header 'Accept: _/_' \
 --form 'file=@c:\Ficha Abogado .txt'
