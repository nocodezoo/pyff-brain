<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Vybord VPS Brain — MANDATORY READ

Before working on ANY Vybord-related task, read `VYBORD_BRAIN.md` — it contains:
- Complete VPS pipeline architecture (review_server.py, 4132 lines)
- Full API map (/api/generate, /api/upload, /api/status, etc.)
- Music pipeline (MUSIC_MAP, _mix_music, working ffmpeg command)
- Voice engine (VOICE_MAP, get_edge_voice, known bugs)
- Active issues (music not applied P0, voice ID mismatch P0)
- Job directory structure, pipeline stages
- All VPS HTML pages and their roles
- Service management commands
- Quick reference for video debugging

```
cat VYBORD_BRAIN.md
```

## Key Constraints for Vybord Work

1. **VPS pipeline lives at:** `/opt/video_pipeline_v3/` (NOT a git repo)
2. **GitHub repo:** https://github.com/nocodezoo/nocodezoo (VPS/ directory)
3. **V3 domain:** v3.vybord.com (SSL, Cloudflare proxied)
4. **Music keys mismatch:** Frontend sends `upbeat/chill/cinematic/positive` — VPS MUSIC_MAP has `ambient_piano/lofi_hip_hop/etc.` — P0 bug
5. **Voice IDs mismatch:** Frontend sends `CwhRBWXzGAHq8TQ4Fs17` — VPS VOICE_MAP keys are `Roger/Sarah/etc.` — P0 bug
6. **Disk at 96.6%** — be careful with large files on VPS
7. **start_v3.sh has secrets** — REDACTED on GitHub, never commit real keys
