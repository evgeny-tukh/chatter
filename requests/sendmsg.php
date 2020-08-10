<?php

    require '../db/database.php';
    require 'common.php';

    $data   = json_decode (file_get_contents ("php://input"), true);
    $convID = getArrayElement ($data, 'convID', NULL);
    $mode   = getArrayElement ($data, 'mode', 1);
    $text   = getArrayElement ($data, 'text', NULL);

    if (!$convID || !$text) {
        echo json_encode (['result' => 202]);
    } else {
        $database = new Database ();

        if ($database) {
            $now = time ();
            $nowStr = mysqlTime ($now);
            $database->execute ("insert into messages(conversation,mode,text,time) values($convID,$mode,'$text',$nowStr)");

            $id = $database->insertID ();
            
            $database->close ();

            echo json_encode ([
                'result' => 200,
                'convID' => $convID,
                'msgID' => $id,
                'text' => $text,
                'time' => $now,
                'mode' => $mode,
            ]);
        } else {
            echo json_encode (['result' => 201]);
        }
    }

