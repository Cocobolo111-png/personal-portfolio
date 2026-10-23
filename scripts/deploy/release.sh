#!/usr/bin/env bash
# Install root-owned at /usr/local/libexec/portfolio-release; run as portfolio-deploy.
set -euo pipefail
umask 022
base=/srv/www/sites/portfolio
domain=create.byheyang.cn
mode=${1:-}
release=${2:-}
sha=${3:-}
[[ "$mode" == activate || "$mode" == rollback ]] || exit 2
[[ "$release" =~ ^[a-f0-9]{40}-[0-9]+-[0-9]+$ ]] || exit 2
[[ "$sha" =~ ^[a-f0-9]{40}$ && "$release" == "$sha"-* ]] || exit 2
exec 9>"$base/.deploy.lock"
flock -w 120 9
target="$base/releases/$release"
if [[ "$mode" == activate ]]; then
  [[ ! -e "$target" ]] || { echo 'Release already exists'; exit 1; }
  candidate="$base/incoming/$release"
else
  candidate="$target"
  [[ -f "$candidate/.verified" ]] || { echo 'Rollback requires a previously healthy release'; exit 1; }
fi
[[ -d "$candidate" && ! -L "$candidate" ]]
[[ -z "$(find "$candidate" -type l -print -quit)" ]] || exit 1
(
  cd "$candidate"
  # Reject absolute/traversal names before letting sha256sum read files.
  awk 'length($1)!=64 || $1 ~ /[^a-f0-9]/ || substr($0,65,2)!="  " || substr($0,67) ~ /(^\/|(^|\/)\.\.(\/|$)|\\)/ {exit 1}' SHA256SUMS
  sha256sum --strict -c SHA256SUMS >/dev/null
  grep -Fq '"commit":"'"$sha"'"' deployment.json
  for route in traintrace love-journal ai-content-growth-os ai-video-workbench panliangxia; do
    test -s "work/$route/index.html"
  done
  test -s index.html
  test -s favicon.svg
)
old=$(readlink "$base/current" || true)
if [[ -n "$old" ]]; then
  [[ "$old" =~ ^releases/[a-f0-9]{40}-[0-9]+-[0-9]+$ ]] || exit 1
  # Preserve hashed assets so already-open tabs survive an atomic switch/rollback.
  cp -a --update=none "$base/$old/assets/." "$candidate/assets/"
fi
if [[ "$mode" == activate ]]; then mv "$candidate" "$target"; fi
switch() {
  ln -s "$1" "$base/.current-next"
  mv -Tf "$base/.current-next" "$base/current"
}
switched=false
restore() {
  rc=$?
  trap - EXIT HUP INT TERM
  if [[ "$rc" != 0 && "$switched" == true ]]; then
    if [[ -n "$old" ]]; then switch "$old"; else rm -f "$base/current"; fi
    echo 'Health verification failed; restored previous current pointer' >&2
  fi
  exit "$rc"
}
trap restore EXIT
trap 'exit 1' HUP INT TERM
switched=true
switch "releases/$release"
# Verify against the actual TLS host on this server, without DNS propagation dependency.
curl --noproxy '*' --resolve "$domain:443:127.0.0.1" -fsS --retry 3 --retry-delay 2 --max-time 20 \
  "https://$domain/deployment.json" | grep -Fq '"commit":"'"$sha"'"'
for path in / /work/traintrace /work/love-journal /work/ai-content-growth-os /work/ai-video-workbench /work/panliangxia; do
  curl --noproxy '*' --resolve "$domain:443:127.0.0.1" -fsS --max-time 15 "https://$domain$path" -o /dev/null
done
touch "$target/.verified"
if [[ -n "$old" && "$old" != "releases/$release" ]]; then
  ln -s "$old" "$base/.previous-next"
  mv -Tf "$base/.previous-next" "$base/previous"
fi
printf '%s %s %s\n' "$(date -u +%FT%TZ)" "$mode" "$release" >> "$base/deployments.log"
switched=false
echo "Healthy release: $release"
