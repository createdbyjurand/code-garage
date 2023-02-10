# echoWithTab MESSAGE NOTIFICATION PRIMARY_COLOR(Optional) SECONDARY_COLOR(Optional) TAB_SIZE(Optional)
function echoWithTab() {
  local CONSOLE_WINDOW_WIDTH
  local DEFAULT_COLOR
  local MESSAGE
  local NOTIFICATION
  local PRIMARY_COLOR
  local SECONDARY_COLOR
  local TAB_SIZE
  local i
  local s

  CONSOLE_WINDOW_WIDTH=$(tput cols)
  DEFAULT_COLOR="\e[0m"

  MESSAGE=${1}
  NOTIFICATION=${2}
  PRIMARY_COLOR=${3:-${DEFAULT_COLOR}}
  SECONDARY_COLOR=${4:-"\e[32m"}
  TAB_SIZE=${5:-${#NOTIFICATION}}

  i=$((CONSOLE_WINDOW_WIDTH - TAB_SIZE - ${#MESSAGE}))
  s=" "

  while [ $i -gt 1 ]; do
    s="${s} "
    ((i--))
  done

  echo -e "${PRIMARY_COLOR}${1}${s}${SECONDARY_COLOR}${2}${DEFAULT_COLOR}"
}
