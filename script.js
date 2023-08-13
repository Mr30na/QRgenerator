let submit = document.querySelector("#submit");
let file = document.querySelector("#urlfiles");
let baseUrl = document.querySelector("#baseurl");
let timevalue = document.querySelector("#time");
let loading = document.querySelector("#status");
let display = document.querySelector("#display");
let result = document.querySelector("#result");
timevalue.value = 2500;
let oldLogText = "";
let success = 0,
  fail = 0,
  total = 0;
let i = 0;
function updateresult() {
  result.innerHTML = "[ S: " + success + " F:" + fail + " T:" + total + "]";
}

function textLog(text) {
  const newText = text + "<br>" + oldLogText;
  display.innerHTML = newText;
  oldLogText = newText;
}

function timeOut(arr) {
  setTimeout(() => {
    if (i < arr.length) {
      textLog(`${i + 1}.sending Request to API server...`);

      sendreq(
        "http://language.bonyadfarhangi.ir" +
          encodeURI(arr[i].replace("\r", "")),
        arr[i]
      );
      i++;
      timeOut(arr);
    } else {
      console.log("finish");
    }
  }, TIME_INVAL);
}
submit.addEventListener("click", () => {
  TIME_INVAL = parseInt(timevalue.value);
  if (TIME_INVAL >= 2500 && TIME_INVAL <= 5000) {
    updateresult();
    textLog("Getting urls file...");
    let arr = readTextFile(file.value);

    total = arr.length;
    timeOut(arr);
    return arr;
  } else {
    console.error("The time inval must be between 2500 to 5000 milisecond");
  }
});

function readTextFile(file) {
  let arr = [];
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        arr = allText.split("\n");
      }
    }
  };
  rawFile.send();
  return arr;
}

function save(blob, name) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();

  const isSuccess = blob.type === "image/png";

  if (isSuccess) {
    ++success;
    textLog("Sucess");
  } else {
    fail++;
    textLog(blob.name + " -> Fail");
    i--;
    errorHandler();
  }
  updateresult();

  window.URL.revokeObjectURL(url);
}

function sendreq(link, name) {
  var xhr = new XMLHttpRequest();
  let filename = name.split("/").slice(-1);
  filename[0].replace(".mp3", "");
  xhr.open("POST", "https://api.qrcode-monkey.com/qr/custom", true);
  xhr.responseType = "blob";
  xhr.onload = (e) =>
    save(xhr.response, filename[0].replace(".mp3", "").trim());
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      data: link,
      config: {
        bodyColor: "#03045E",
        logo: "http://englishtraffic.ir/logo.png",
      },
    })
  );
}

function errorHandler() {
  let box = confirm("failed to recieve files would you like to continue?");
  if (box == false) {
    close();
  } else {
    timeOut(arr);
  }
}
//http://language.bonyadfarhangi.ir
