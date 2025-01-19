yarn build
docker build -t "$MFRO_DEPLOY_REGISTRY/tetris" build/
docker push "$MFRO_DEPLOY_REGISTRY/tetris"

ssh "$MFRO_DEPLOY_HOST" "cd server; sudo docker compose pull; sudo docker compose up -d"
