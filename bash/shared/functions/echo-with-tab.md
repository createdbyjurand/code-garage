Code | Color | Example
---|---|---
39 | Default foreground color | `echo -e "Default \e[39mDefault"`
30 | Black | `echo -e "Default \e[30mBlack"`
31 | Red | `echo -e "Default \e[31mRed"`
32 | Green | `echo -e "Default \e[32mGreen"`
33 | Yellow | `echo -e "Default \e[33mYellow"`
34 | Blue | `echo -e "Default \e[34mBlue"`
35 | Magenta | `echo -e "Default \e[35mMagenta"`
36 | Cyan | `echo -e "Default \e[36mCyan"`

# Count number of characters in a parameters.

if [ ${#1} = 0 ]
then
  echo '$1 is blank'
else
  echo '$1 is filled up'
fi

   +----------------------+------------+-----------------------+-----------------------+
   |   if VARIABLE is:    |    set     |         empty         |        unset          |
   +----------------------+------------+-----------------------+-----------------------+
 - |  ${VARIABLE-default} | $VARIABLE  |          ""           |       "default"       |
 = |  ${VARIABLE=default} | $VARIABLE  |          ""           | $(VARIABLE="default") |
 ? |  ${VARIABLE?default} | $VARIABLE  |          ""           |       exit 127        |
 + |  ${VARIABLE+default} | "default"  |       "default"       |          ""           |
   +----------------------+------------+-----------------------+-----------------------+
:- | ${VARIABLE:-default} | $VARIABLE  |       "default"       |       "default"       |
:= | ${VARIABLE:=default} | $VARIABLE  | $(VARIABLE="default") | $(VARIABLE="default") |
:? | ${VARIABLE:?default} | $VARIABLE  |       exit 127        |       exit 127        |
:+ | ${VARIABLE:+default} | "default"  |          ""           |          ""           |
   +----------------------+------------+-----------------------+-----------------------+