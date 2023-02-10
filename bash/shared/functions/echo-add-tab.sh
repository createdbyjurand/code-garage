function echoAddTab() {
  i=$((${TAB_SIZE} - ${#1}))
  s=""
  while [ $i -gt 0 ]; do
    s="${s} "
    ((i--))
  done
  echo -e "${s}${PRIMARY_COLOR}${2}${DEFAULT_COLOR}"
}
