let connectionCount = 0;
let peers = [];

onconnect = function(e) {
  let port = e.ports[0];

  connectionCount++;

  peers.push({
    id: connectionCount,
    port: port
  });

  port.postMessage({
    kind: "connect",
    peerId: connectionCount
  });

  port.onmessage = function (e) {
    peers.filter(function (peer) {
      return peer.id !== e.data.peerId;
    }).forEach(function (peer) {
      peer.port.postMessage(e.data);
    });
  };

}
