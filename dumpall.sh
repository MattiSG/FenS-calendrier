#!/bin/bash

FILE=FuturEnSeine.ics

echo 'BEGIN:VCALENDAR' > $FILE
echo 'VERSION:2.0' >> $FILE
echo 'PRODID:MattiSG_FuturEnSeine' >> $FILE
echo 'BEGIN:VTIMEZONE' >> $FILE
echo 'TZID:Europe/Paris' >> $FILE
echo 'BEGIN:DAYLIGHT' >> $FILE
echo 'TZOFFSETFROM:+0100' >> $FILE
echo 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU' >> $FILE
echo 'DTSTART:19810329T020000' >> $FILE
echo 'TZNAME:GMT+02:00' >> $FILE
echo 'TZOFFSETTO:+0200' >> $FILE
echo 'END:DAYLIGHT' >> $FILE
echo 'BEGIN:STANDARD' >> $FILE
echo 'TZOFFSETFROM:+0200' >> $FILE
echo 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU' >> $FILE
echo 'DTSTART:19961027T030000' >> $FILE
echo 'TZNAME:GMT+01:00' >> $FILE
echo 'TZOFFSETTO:+0100' >> $FILE
echo 'END:STANDARD' >> $FILE
echo 'END:VTIMEZONE' >> $FILE

for url in $(casperjs calendar-extractor.js)
do
	echo "➠ $url"
	result=$(casperjs calendar-generator.js $url)
	
	if ! echo $result | grep 'Missing date'
	then echo "$result" >> $FILE
	fi
done

echo 'END:VCALENDAR' >> $FILE
