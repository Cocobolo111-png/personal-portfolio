#!/usr/bin/env bash
# Linux integration test: real file checksums, flock and atomic symlinks; stub TLS health only.
set -euo pipefail
test_root=$(mktemp -d)
trap 'rm -rf "$test_root"' EXIT
mkdir -p "$test_root/site/incoming" "$test_root/site/releases" "$test_root/bin"
sed "s|^base=.*|base=$test_root/site|" scripts/deploy/release.sh > "$test_root/release.sh"
cat > "$test_root/bin/curl" <<'SH'
#!/usr/bin/env bash
[[ ${FAIL_HEALTH:-0} != 1 ]] || exit 22
[[ "$*" != *'-o /dev/null'* ]] || exit 0
printf '{"commit":"%s"}\n' "$TEST_SHA"
SH
chmod +x "$test_root/bin/curl"
export PATH="$test_root/bin:$PATH"
export TEST_SHA=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
fixture() {
  local release="$1"
  cp -R dist "$test_root/site/incoming/$release"
  local dest="$test_root/site/incoming/$release"
  printf '{"commit":"%s"}\n' "$TEST_SHA" > "$dest/deployment.json"
  (cd "$dest"; find . -type f ! -name SHA256SUMS -printf '%P\n' | sort | xargs -d '\n' sha256sum > SHA256SUMS)
}
one="$TEST_SHA-1-1"
two="$TEST_SHA-2-1"
three="$TEST_SHA-3-1"
fixture "$one"
zero="$TEST_SHA-0-1"
fixture "$zero"
if FAIL_HEALTH=1 bash "$test_root/release.sh" activate "$zero" "$TEST_SHA" 2>/dev/null; then exit 1; fi
test ! -e "$test_root/site/current"
test ! -L "$test_root/site/current"
bash "$test_root/release.sh" activate "$one" "$TEST_SHA"
test "$(readlink "$test_root/site/current")" = "releases/$one"
fixture "$two"
printf corrupt >> "$test_root/site/incoming/$two/index.html"
if bash "$test_root/release.sh" activate "$two" "$TEST_SHA" 2>/dev/null; then exit 1; fi
test "$(readlink "$test_root/site/current")" = "releases/$one"
fixture "$three"
if FAIL_HEALTH=1 bash "$test_root/release.sh" activate "$three" "$TEST_SHA" 2>/dev/null; then exit 1; fi
test "$(readlink "$test_root/site/current")" = "releases/$one"
test ! -f "$test_root/site/releases/$three/.verified"
four="$TEST_SHA-4-1"
fixture "$four"
bash "$test_root/release.sh" activate "$four" "$TEST_SHA"
test "$(readlink "$test_root/site/previous")" = "releases/$one"
bash "$test_root/release.sh" rollback "$one" "$TEST_SHA"
test "$(readlink "$test_root/site/current")" = "releases/$one"
if bash "$test_root/release.sh" rollback "$three" "$TEST_SHA" 2>/dev/null; then exit 1; fi
echo 'PASS: activate, integrity failure, health failure restore, verified rollback, reject unhealthy rollback'
