#!/bin/sh

# deno run --unstable --allow-run --allow-write --allow-read --allow-net config/build.ts

deno run --allow-net=0.0.0.0:8000 --allow-read server.ts