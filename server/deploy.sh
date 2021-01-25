yarn build
scp main.js api.mfro.me:server/tetris
ssh api.mfro.me "startup/tetris.sh"
