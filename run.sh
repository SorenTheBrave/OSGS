#!/bin/sh

deno run --unstable --allow-run --allow-write --allow-read config/build.ts

deno run --allow-net --allow-read --inspect server.ts