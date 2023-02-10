# notes

# echo -n                 : not output the trailing newline
# echo -e                 : interpret backslash (\r, \n) escape symbols
# | sed -e 1,3d           : delete lines from 1 to 3 (pipe)
# | cut -c 2-             : cut first letter (pipe)
# :1                      : cut first letter
# rm -r, -R, --recursive  : remove directories and their contents recursively
# echo $APPDATA
# ARR=("$@")
# echo "\${ARR[0]} ${ARR[0]}"
# echo "\${ARR[1]} ${ARR[1]}"
# echo "\${ARR[2]} ${ARR[2]}"


function echoInTab {
  # echo "\$1: ${1} (${#1} chars)"
  # echo "\$2: ${2} (${#2} chars)"
  # echo "\${TAB_SIZE}: ${TAB_SIZE}"
  i=$((${TAB_SIZE} - ${#1}))
  # echo "\${i}: ${i}"
  s=""
  while [ $i -gt 0 ]
  do
    s="${s} "
    ((i--))
  done
  # echo "\$s: ${s} (${#s} chars)"
  echo -e "${1}${s}${PRIMARY_COLOR}${2}${DEFAULT_COLOR}"
}

# echoInTab "asd" "asd"
# echoInTab "a s d" "a s d"
# echoInTab "a   s   d" "a   s   d"
# echoInTab "a     s     d" "a     s     d"

function addTab {
  # echo "\$1: ${1} (${#1} chars)"
  # echo "\$2: ${2} (${#2} chars)"
  # echo "\${TAB_SIZE}: ${TAB_SIZE}"
  i=$((${TAB_SIZE} - ${#1}))
  # echo "\${i}: ${i}"
  s=""
  while [ $i -gt 0 ]
  do
    s="${s} "
    ((i--))
  done
  # echo "\$s: ${s} (${#s} chars)"
  echo -e "${s}${PRIMARY_COLOR}${2}${DEFAULT_COLOR}"
}

# echo -n "asd"
# addTab "asd" "asd"
# echo -n "a s d"
# addTab "a s d" "a s d"
# echo -n "a   s   d"
# addTab "a   s   d" "a   s   d"
# echo -n "a     s     d"
# addTab "a     s     d" "a     s     d"

      # MESSAGE=""
      # echo -n "${MESSAGE}"
      # OUTPUT=$()
      # addTab "${MESSAGE}" "[  DONE  ]"
      # echo "${OUTPUT}"

      