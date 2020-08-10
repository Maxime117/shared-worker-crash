// const viewerWorker = new SharedWorker("live://editor/viewer-worker.js");
// const viewerWorker = new SharedWorker(`${__dirname}/viewer-worker.js`);
const viewerWorker = new SharedWorker("viewer-worker.js");

var workerPeerId = null;

viewerWorker.onerror = function(error) {
  console.error("error in worker", error);
};

viewerWorker.port.onmessage = function (e) {
  console.log("message from worker", e);
  if (e.data.kind == "connect") {
    workerPeerId = e.data.peerId

    setTimeout(function() {
      viewerWorker.port.postMessage({kind: "hello", peerId: workerPeerId})
    }, 1e3)
  }
};

viewerWorker.port.start();