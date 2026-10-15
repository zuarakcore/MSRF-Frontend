# Website deployment

Production: **https://malabarchallengersfc.com** (`www.` redirects to it), on the same Hostinger VPS as the
backend (`187.126.124.243`). Server access, accounts, backups and security are described in the backend
runbook: `MSRF-Backend/deploy/README.md`.

## How a change reaches production

```
git push origin main
  └─ GitHub Actions (.github/workflows/ci-cd.yml)
       1. build    Docker image (npm ci, next build) -> ghcr.io/zuarakcore/msrf-website:<commit sha>
       2. deploy   scp compose.yml + deploy.sh -> /srv/msrf/website, then deploy.sh <sha>
                     unhealthy? -> previous version is started again and the job fails
       3. check    https://malabarchallengersfc.com/
```

Pull requests run step 1 without pushing the image. The API address the browser uses
(`NEXT_PUBLIC_API_BASE_URL`) is baked in at build time from `.env.production`.

## On the server

```
/srv/msrf/website/            owned by `deploy`
├── compose.yml               replaced by CI on every deploy (source: deploy/website/compose.yml)
├── deploy.sh                 replaced by CI on every deploy
└── .deploy-history           one line per successful deploy: <time> <sha>
```

Container `msrf-website-web-1` (Next.js standalone, port 3000, read-only, non-root, 512 MB) joins the
`edge` network as `msrf-website`. Caddy (`/srv/msrf/proxy/Caddyfile`) terminates HTTPS:

```caddyfile
malabarchallengersfc.com {
	import access_log
	encode zstd gzip
	header {
		Strict-Transport-Security "max-age=31536000"
		X-Content-Type-Options "nosniff"
		X-Frame-Options "SAMEORIGIN"
		Referrer-Policy "strict-origin-when-cross-origin"
		Permissions-Policy "camera=(), microphone=(), geolocation=()"
	}
	reverse_proxy msrf-website:3000
}

www.malabarchallengersfc.com {
	redir https://malabarchallengersfc.com{uri} permanent
}
```

## Everyday commands (as root)

```bash
cd /srv/msrf/website && export IMAGE_TAG=$(tail -n1 .deploy-history | awk '{print $2}')
docker compose ps                       # "Up (healthy)"
docker compose logs -f --tail 100 web   # logs
```

Roll back: GitHub → Actions → last good run on `main` → **Re-run all jobs**, or on the server
`sudo -u deploy /srv/msrf/website/deploy.sh <older sha>` (from `.deploy-history`; the 5 newest images are kept).
