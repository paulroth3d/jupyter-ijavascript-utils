#!/bin/bash

buildVersion="$(npm run package:version:get --silent)"

echo "build version:${buildVersion}"
echo "should we continue?"

read shouldContinue

if [ "${shouldContinue}" != "y" ];
then
	return 0
fi

npm run build
