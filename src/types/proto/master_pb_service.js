// package: 
// file: master.proto

var master_pb = require("./master_pb");
var google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var MasterService = (function () {
  function MasterService() {}
  MasterService.serviceName = "MasterService";
  return MasterService;
}());

MasterService.RegisterNewCluster = {
  methodName: "RegisterNewCluster",
  service: MasterService,
  requestStream: false,
  responseStream: false,
  requestType: master_pb.RegisterClusterRequest,
  responseType: master_pb.RegisterClusterResponse
};

MasterService.AuthCluster = {
  methodName: "AuthCluster",
  service: MasterService,
  requestStream: false,
  responseStream: false,
  requestType: master_pb.AuthClusterRequest,
  responseType: google_protobuf_empty_pb.Empty
};

MasterService.ReportHealthPingRequest = {
  methodName: "ReportHealthPingRequest",
  service: MasterService,
  requestStream: false,
  responseStream: false,
  requestType: master_pb.ReportHealthRequest,
  responseType: master_pb.ReportHealthResponse
};

MasterService.ReportEvent = {
  methodName: "ReportEvent",
  service: MasterService,
  requestStream: false,
  responseStream: false,
  requestType: master_pb.ReportEventRequest,
  responseType: google_protobuf_empty_pb.Empty
};

exports.MasterService = MasterService;

function MasterServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

MasterServiceClient.prototype.registerNewCluster = function registerNewCluster(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MasterService.RegisterNewCluster, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MasterServiceClient.prototype.authCluster = function authCluster(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MasterService.AuthCluster, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MasterServiceClient.prototype.reportHealthPingRequest = function reportHealthPingRequest(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MasterService.ReportHealthPingRequest, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

MasterServiceClient.prototype.reportEvent = function reportEvent(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MasterService.ReportEvent, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.MasterServiceClient = MasterServiceClient;

