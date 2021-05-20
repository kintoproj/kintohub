// package: 
// file: workflowapi.proto

var workflowapi_pb = require("./workflowapi_pb");
var models_pb = require("./models_pb");
var google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var WorkflowAPIService = (function () {
  function WorkflowAPIService() {}
  WorkflowAPIService.serviceName = "WorkflowAPIService";
  return WorkflowAPIService;
}());

WorkflowAPIService.BuildAndDeployRelease = {
  methodName: "BuildAndDeployRelease",
  service: WorkflowAPIService,
  requestStream: false,
  responseStream: false,
  requestType: workflowapi_pb.BuildAndDeployRequest,
  responseType: workflowapi_pb.WorkflowResponse
};

WorkflowAPIService.DeployRelease = {
  methodName: "DeployRelease",
  service: WorkflowAPIService,
  requestStream: false,
  responseStream: false,
  requestType: workflowapi_pb.DeployRequest,
  responseType: workflowapi_pb.WorkflowResponse
};

WorkflowAPIService.DeployReleaseFromCatalog = {
  methodName: "DeployReleaseFromCatalog",
  service: WorkflowAPIService,
  requestStream: false,
  responseStream: false,
  requestType: workflowapi_pb.DeployCatalogRequest,
  responseType: workflowapi_pb.WorkflowResponse
};

WorkflowAPIService.UndeployRelease = {
  methodName: "UndeployRelease",
  service: WorkflowAPIService,
  requestStream: false,
  responseStream: false,
  requestType: workflowapi_pb.UndeployRequest,
  responseType: workflowapi_pb.WorkflowResponse
};

WorkflowAPIService.SuspendRelease = {
  methodName: "SuspendRelease",
  service: WorkflowAPIService,
  requestStream: false,
  responseStream: false,
  requestType: workflowapi_pb.SuspendRequest,
  responseType: workflowapi_pb.WorkflowResponse
};

WorkflowAPIService.AbortRelease = {
  methodName: "AbortRelease",
  service: WorkflowAPIService,
  requestStream: false,
  responseStream: false,
  requestType: workflowapi_pb.AbortReleaseRequest,
  responseType: google_protobuf_empty_pb.Empty
};

WorkflowAPIService.GetWorkflowLogs = {
  methodName: "GetWorkflowLogs",
  service: WorkflowAPIService,
  requestStream: false,
  responseStream: false,
  requestType: workflowapi_pb.WorkflowLogsRequest,
  responseType: models_pb.Logs
};

WorkflowAPIService.WatchWorkflowLogs = {
  methodName: "WatchWorkflowLogs",
  service: WorkflowAPIService,
  requestStream: false,
  responseStream: true,
  requestType: workflowapi_pb.WorkflowLogsRequest,
  responseType: models_pb.Logs
};

exports.WorkflowAPIService = WorkflowAPIService;

function WorkflowAPIServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

WorkflowAPIServiceClient.prototype.buildAndDeployRelease = function buildAndDeployRelease(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WorkflowAPIService.BuildAndDeployRelease, {
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

WorkflowAPIServiceClient.prototype.deployRelease = function deployRelease(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WorkflowAPIService.DeployRelease, {
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

WorkflowAPIServiceClient.prototype.deployReleaseFromCatalog = function deployReleaseFromCatalog(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WorkflowAPIService.DeployReleaseFromCatalog, {
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

WorkflowAPIServiceClient.prototype.undeployRelease = function undeployRelease(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WorkflowAPIService.UndeployRelease, {
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

WorkflowAPIServiceClient.prototype.suspendRelease = function suspendRelease(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WorkflowAPIService.SuspendRelease, {
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

WorkflowAPIServiceClient.prototype.abortRelease = function abortRelease(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WorkflowAPIService.AbortRelease, {
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

WorkflowAPIServiceClient.prototype.getWorkflowLogs = function getWorkflowLogs(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(WorkflowAPIService.GetWorkflowLogs, {
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

WorkflowAPIServiceClient.prototype.watchWorkflowLogs = function watchWorkflowLogs(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(WorkflowAPIService.WatchWorkflowLogs, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.WorkflowAPIServiceClient = WorkflowAPIServiceClient;

