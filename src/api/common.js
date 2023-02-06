

export const encodeParams = (args) => {
    let formBody = [];
    for (let property in args) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(args[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody;
}

export const encodeUriParams = (args) => {
    let formBody = [];
    for (let property in args) {
        formBody.push(property + "=" + args[property]);
    }
    formBody = formBody.join("&");
    return formBody;
}

export const getDate = (date) => {
    const midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
  
    const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    const minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let time = "";
    const diff = Math.floor(
      (date.valueOf() - midnight.valueOf()) / (1000 * 60 * 60 * 24)
    );
  
    switch (diff) {
      case 0:
        time = hours + ":" + minutes + " Today";
        break;
      case 1:
        time = hours + ":" + minutes + " Yesterday";
        break;x
      default:
        time = hours + ":" + minutes + " " + date.toLocaleDateString();
        break;
    }
    return time;
  };

export const limitStringLength = (text, count) => {
    return text.slice(0, count) + (text.length > count ? "..." : "");
  }

export const durationToHHMMSS = (sec_num) => {
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - hours * 3600) / 60);
    let seconds = sec_num - hours * 3600 - minutes * 60;
    let h = hours.toString(),
      m = minutes.toString(),
      s = seconds.toString();
  
    if (hours < 10) {
      h = "0" + hours;
    }
    if (minutes < 10) {
      m = "0" + minutes;
    }
    if (seconds < 10) {
      s = "0" + seconds;
    }
    return h + ":" + m + ":" + s;
  };