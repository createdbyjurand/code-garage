DEFAULT_COLOR="\e[0m"
PRIMARY_COLOR="\e[31m"
CONSOLE_WINDOW_WIDTH=$(tput cols)
TAB_SIZE=$((${CONSOLE_WINDOW_WIDTH} - 10))

function addTab {
  i=$((${TAB_SIZE} - ${#1}))
  s=""
  while [ $i -gt 0 ]
  do
    s="${s} "
    ((i--))
  done
  echo -e "${s}${PRIMARY_COLOR}${2}${DEFAULT_COLOR}"
}

MESSAGE="rm -rf \"${APPDATA}\\npm-cache\""
echo -n "${MESSAGE}"
OUTPUT=$(rm -rf "${APPDATA}\\npm-cache")
addTab "${MESSAGE}" "[  DONE  ]"
echo "${OUTPUT}"
