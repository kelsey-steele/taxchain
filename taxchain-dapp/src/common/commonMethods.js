
import React from "react";
import {Message} from "semantic-ui-react";

function getFailedMessageFunc(err) {
    return (
        <Message negative
            icon='times'
            header='Sorry. Some error happened'
            content={err.message}
            size="small"
        />
    );
}

export const getFailedMessage=getFailedMessageFunc;