<?php

    require '../db/database.php';
    require 'common.php';

    $data       = json_decode (file_get_contents ("php://input"), true);
    $convID     = getArrayElement ($data, 'convID', NULL);
    $startAfter = getArrayElement ($data, 'startAfter', 0);

    if (!$convID) {
        echo json_encode (['result' => 202]);
    } else {
        $database = new Database ();

        if ($database) {
            $messages = [];

            $cb = function ($row) use (&$messages) {
                array_push ($messages, [
                    'id' => intval ($row ['id']),
                    'time' => getTimestamp ($row ['time']),
                    'text' => $row ['text'],
                    'mode' => intval ($row ['mode']),
                ]);
            };

            $database->enumResult ("select * from messages where conversation=$convID and id>$startAfter order by id", $cb);
            
            $database->close ();

            echo json_encode ([
                'result' => 200,
                'convID' => $convID,
                'startAfter' => $startAfter,
                'messages' => $messages,
            ]);
        } else {
            echo json_encode (['result' => 201]);
        }
    }

