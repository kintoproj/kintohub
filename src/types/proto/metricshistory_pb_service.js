// package: 
// file: metricshistory.proto

var metricshistory_pb = require("./metricshistory_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var MetricsHistoryService = (function () {
  function MetricsHistoryService() {}
  MetricsHistoryService.serviceName = "MetricsHistoryService";
  return MetricsHistoryService;
}());

MetricsHistoryService.GetEnvironmentMetrics = {
  methodName: "GetEnvironmentMetrics",
  service: MetricsHistoryService,
  requestStream: false,
  responseStream: false,
  requestType: metricshistory_pb.EnvironmentMetricsQueryRequest,
  responseType: metricshistory_pb.MetricsHistory
};

MetricsHistoryService.GetBlockMetrics = {
  methodName: "GetBlockMetrics",
  service: MetricsHistoryService,
  requestStream: false,
  responseStream: false,
  requestType: metricshistory_pb.BlockMetricsQueryRequest,
  responseType: metricshistory_pb.MetricsHistory
};

MetricsHistoryService.GetInstanceMetrics = {
  methodName: "GetInstanceMetrics",
  service: MetricsHistoryService,
  requestStream: false,
  responseStream: false,
  requestType: metricshistory_pb.InstanceMetricsQueryRequest,
  responseType: metricshistory_pb.MetricsHistory
};

exports.MetricsHistoryService = MetricsHistoryService;

function MetricsHistoryServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

MetricsHistoryServiceClient.prototype.getEnvironmentMetrics = function getEnvironmentMetrics(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MetricsHistoryService.GetEnvironmentMetrics, {
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

MetricsHistoryServiceClient.prototype.getBlockMetrics = function getBlockMetrics(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MetricsHistoryService.GetBlockMetrics, {
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

MetricsHistoryServiceClient.prototype.getInstanceMetrics = function getInstanceMetrics(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MetricsHistoryService.GetInstanceMetrics, {
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

exports.MetricsHistoryServiceClient = MetricsHistoryServiceClient;

