#!/bin/zsh
echo Enter name of component
read component_name

mkdir js/components/$component_name

echo "m.${component_name}.acts({\n\n});" > js/components/$component_name/$component_name.actions.js
echo "m.${component_name}.events(_$ => {\n\n});" > js/components/$component_name/$component_name.events.js
echo "m.${component_name}.routes({\n\n});" > js/components/$component_name/$component_name.routes.js

echo "[data-component~='${component_name}'] {\n\n}" > css/components/$component_name.css

# Add component to array.
sed "s/const components = \[/const components = \[\n\t\t\t\"${component_name}\",/" index.html | tee index.html > /dev/null

echo "${component_name} created."