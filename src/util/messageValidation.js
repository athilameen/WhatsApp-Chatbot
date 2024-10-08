export function messagesCheck(body_param) {
  if (
    body_param.entry &&
    body_param.entry[0].changes &&
    body_param.entry[0].changes[0].value.messages &&
    body_param.entry[0].changes[0].value.messages[0]
  ) {
    return true;
  } else {
    return false;
  }
}

export function textMesssgeCheck(body_param) {
  if (
    body_param.entry &&
    body_param.entry[0].changes &&
    body_param.entry[0].changes[0].value.messages &&
    body_param.entry[0].changes[0].value.messages[0] &&
    body_param.entry[0].changes[0].value.messages[0].text &&
    body_param.entry[0].changes[0].value.messages[0].text.body
  ) {
    return true;
  } else {
    return false;
  }
}

export function statusCheck(body_param) {
  if (
    body_param.entry &&
    body_param.entry[0].changes &&
    body_param.entry[0].changes[0].value.statuses &&
    body_param.entry[0].changes[0].value.statuses[0]
  ) {
    return true;
  } else {
    return false;
  }
}

export function locationCheck(body_param){
  if(body_param.entry && 
      body_param.entry[0].changes && 
      body_param.entry[0].changes[0].value.messages && 
      body_param.entry[0].changes[0].value.messages[0] &&
      body_param.entry[0].changes[0].value.messages[0].location &&
      body_param.entry[0].changes[0].value.messages[0].location.latitude && 
      body_param.entry[0].changes[0].value.messages[0].location.longitude )
      {
          return true;
      }else{
          return false;
      }
}

export function listReplyCheck(body_param) {
  if (
    body_param.entry &&
    body_param.entry[0].changes &&
    body_param.entry[0].changes[0].value &&
    body_param.entry[0].changes[0].value.messages &&
    body_param.entry[0].changes[0].value.messages[0] &&
    body_param.entry[0].changes[0].value.messages[0].interactive &&
    body_param.entry[0].changes[0].value.messages[0].interactive.type === 'list_reply'
  ) {
    return true;
  } else {
    return false;
  }
}