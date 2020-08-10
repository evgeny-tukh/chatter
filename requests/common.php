<?php

    function getArrayElement ($array, $key, $default) {
        return array_key_exists ($key, $array) ? $array [$key] : $default;
    }

    function mysqlTime ($time, $useQuote = TRUE) {
        $time = doubleval ($time);

        if ($time > 3000000000)
            $time = intval ($time * 0.001);
        else
            $time = intval ($time);

        $quote = $useQuote ? "'" : '';

        return $time ? $quote.gmstrftime ('%Y-%m-%d %H:%M:%S', $time).$quote : "null";
    }

    function getTimestamp ($dateTimeStr) {
        $dateTime = new DateTime ($dateTimeStr, new DateTimeZone ('UTC'));

        $timestamp = $dateTime->getTimestamp ();

        return $timestamp ? $timestamp : NULL;
    }

    function getTimestamp2 ($dateTime) {
        return strtotime ($dateTime.".0Z");
    }

