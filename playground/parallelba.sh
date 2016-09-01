# Doesn't work as expected

function f() {
  echo "starting f"
  sleep 1.5
  echo "ending f"
}

function g() {
  echo "starting g"
  sleep 2.5
  echo "ending g"
}

f &
fpid=$!
g &
gpid=$!
trap 'kill -INT $fpid $gpid 0' EXIT INT TERM
wait
