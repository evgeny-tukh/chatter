<?php

    require '../db/database.php';
    require 'common.php';

    $data    = json_decode (file_get_contents ("php://input"), true);
    $tag     = getArrayElement ($data, 'tag', NULL);
    $mode    = getArrayElement ($data, 'mode', 1);
    $userID  = getArrayElement ($data, 'user', NULL);
    $talker1 = NULL;
    $talker2 = NULL;

    if (!$tag || !$userID) {
        echo json_encode (['result' => 202]);
    } else {
        if ($mode === 1) {
            $talker1 = $userID;
        } else {
            $talker2 = $userID;
        }

        $database = new Database ();

        if ($database) {
            $convID = NULL;

            $cb = function ($row) use (&$convID, $mode, &$talker1, &$talker2) {
                $convID = intval ($row ['id']);

                if ($mode === 1) {
                    $talker2 = intval ($row ['talker2']);
                } else {
                    $talker1 = intval ($row ['talker1']);
                }
            };

            $database->processResult ("select id,talker1,talker2 from conversations where tag=$tag", $cb);

            if ($convID) {
                if ($mode === 1) {
                    $query = "update conversations set talker1=$talker1 where id=$convID";
                } else  {
                    $query = "update conversations set talker2=$talker2 where id=$convID";
                }

                $database->execute ($query);
            } else {
                $talker1string = $talker1 ? "$talker1" : "null";
                $talker2string = $talker2 ? "$talker2" : "null";
                $query = "insert into conversations (tag,talker1,talker2) values($tag,$talker1string,$talker2string)";

                $database->execute ($query);

                $convID = $database->insertID ();
            }

            $database->close ();

            echo json_encode ([
                'result' => 200,
                'convID' => $convID,
                'tag' => $tag,
                'talker1' => $talker1,
                'talker2' => $talker2,
                'mode' => $mode,
            ]);
        } else {
            echo json_encode (['result' => 201]);
        }
    }

