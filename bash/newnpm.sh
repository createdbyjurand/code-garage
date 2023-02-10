function thereIsNewNpmVersion() {
  OUTPUT=$(npm -g outdated)
  for LINE in $OUTPUT
  do
    if [ ${LINE} == "npm" ]
    then
      return 0
    fi
  done
  return 1
}

if thereIsNewNpmVersion
then
  echo "YES YES YES"
else
  echo "NO NO NO"
fi

