# FILE="nfile.json"
# STRING=""envll""

# if  grep -q "$STRING" "$FILE" ; then
#          echo 'the string exists' ; 
# else
#          echo 'the string does not exist' ; 
# fi
#output=`jq '.env += {"operation":"delete"} | .env' nfile.json` 
change=$1

if [ "$change" = "QA" ]; 
then
output=`jq '.env += {} | .env' QA.json`
fi

if [ "$change" = "DEV" ]
then
output=`jq '.env += {} | .env' DEV.json`
fi
# echo $output

echo "$(jq --argjson OUT "$output" '.env = $OUT ' launch.json)" > launch.json

#echo "$(jq '.env += {"name": "a Name"}' nfile.json)" > nfile.json




