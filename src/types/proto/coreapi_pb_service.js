// package: 
// file: coreapi.proto

var coreapi_pb = require("./coreapi_pb");
var google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb");
var models_pb = require("./models_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var KintoCoreService = (function () {
  function KintoCoreService() {}
  KintoCoreService.serviceName = "KintoCoreService";
  return KintoCoreService;
}());

KintoCoreService.GetEnvironment = {
  methodName: "GetEnvironment",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.EnvironmentQueryRequest,
  responseType: models_pb.Environment
};

KintoCoreService.GetEnvironments = {
  methodName: "GetEnvironments",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: google_protobuf_empty_pb.Empty,
  responseType: models_pb.Environments
};

KintoCoreService.CreateEnvironment = {
  methodName: "CreateEnvironment",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.CreateEnvironmentRequest,
  responseType: models_pb.Environment
};

KintoCoreService.UpdateEnvironment = {
  methodName: "UpdateEnvironment",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.UpdateEnvironmentRequest,
  responseType: models_pb.Environment
};

KintoCoreService.DeleteEnvironment = {
  methodName: "DeleteEnvironment",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.DeleteEnvironmentRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoCoreService.CreateBlock = {
  methodName: "CreateBlock",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.CreateBlockRequest,
  responseType: coreapi_pb.BlockUpdateResponse
};

KintoCoreService.DeployBlockUpdate = {
  methodName: "DeployBlockUpdate",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.DeployBlockRequest,
  responseType: coreapi_pb.BlockUpdateResponse
};

KintoCoreService.TriggerDeploy = {
  methodName: "TriggerDeploy",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.TriggerDeployRequest,
  responseType: coreapi_pb.BlockUpdateResponse
};

KintoCoreService.RollbackBlock = {
  methodName: "RollbackBlock",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.RollbackBlockRequest,
  responseType: coreapi_pb.BlockUpdateResponse
};

KintoCoreService.GetBlocks = {
  methodName: "GetBlocks",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.BlockQueryRequest,
  responseType: models_pb.Blocks
};

KintoCoreService.GetBlock = {
  methodName: "GetBlock",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.BlockQueryRequest,
  responseType: models_pb.Block
};

KintoCoreService.DeleteBlock = {
  methodName: "DeleteBlock",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.DeleteBlockRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoCoreService.SuspendBlock = {
  methodName: "SuspendBlock",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.SuspendBlockRequest,
  responseType: coreapi_pb.BlockUpdateResponse
};

KintoCoreService.WatchReleasesStatus = {
  methodName: "WatchReleasesStatus",
  service: KintoCoreService,
  requestStream: false,
  responseStream: true,
  requestType: coreapi_pb.BlockQueryRequest,
  responseType: models_pb.ReleasesStatus
};

KintoCoreService.KillBlockInstance = {
  methodName: "KillBlockInstance",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.KillBlockInstanceRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoCoreService.AbortRelease = {
  methodName: "AbortRelease",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.AbortBlockReleaseRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoCoreService.TagRelease = {
  methodName: "TagRelease",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.TagReleaseRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoCoreService.PromoteRelease = {
  methodName: "PromoteRelease",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.PromoteReleaseRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoCoreService.GenReleaseConfigFromKintoFile = {
  methodName: "GenReleaseConfigFromKintoFile",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.GenReleaseConfigFromKintoFileRepoRequest,
  responseType: models_pb.ReleaseConfig
};

KintoCoreService.WatchBuildLogs = {
  methodName: "WatchBuildLogs",
  service: KintoCoreService,
  requestStream: false,
  responseStream: true,
  requestType: coreapi_pb.WatchBuildLogsRequest,
  responseType: models_pb.Logs
};

KintoCoreService.UpdateBuildStatus = {
  methodName: "UpdateBuildStatus",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.UpdateBuildStatusRequest,
  responseType: coreapi_pb.UpdateBuildStatusResponse
};

KintoCoreService.UpdateBuildCommitSha = {
  methodName: "UpdateBuildCommitSha",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.UpdateBuildCommitShaRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoCoreService.WatchBlocksHealthStatuses = {
  methodName: "WatchBlocksHealthStatuses",
  service: KintoCoreService,
  requestStream: false,
  responseStream: true,
  requestType: coreapi_pb.EnvironmentQueryRequest,
  responseType: models_pb.BlockStatuses
};

KintoCoreService.WatchJobsStatus = {
  methodName: "WatchJobsStatus",
  service: KintoCoreService,
  requestStream: false,
  responseStream: true,
  requestType: coreapi_pb.BlockQueryRequest,
  responseType: models_pb.JobStatus
};

KintoCoreService.WatchBlocksMetrics = {
  methodName: "WatchBlocksMetrics",
  service: KintoCoreService,
  requestStream: false,
  responseStream: true,
  requestType: coreapi_pb.BlockQueryRequest,
  responseType: models_pb.BlocksMetrics
};

KintoCoreService.WatchConsoleLogs = {
  methodName: "WatchConsoleLogs",
  service: KintoCoreService,
  requestStream: false,
  responseStream: true,
  requestType: coreapi_pb.WatchConsoleLogsRequest,
  responseType: models_pb.ConsoleLog
};

KintoCoreService.GetKintoConfiguration = {
  methodName: "GetKintoConfiguration",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: google_protobuf_empty_pb.Empty,
  responseType: models_pb.KintoConfiguration
};

KintoCoreService.CreateCustomDomainName = {
  methodName: "CreateCustomDomainName",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.CustomDomainNameRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoCoreService.DeleteCustomDomainName = {
  methodName: "DeleteCustomDomainName",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.CustomDomainNameRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoCoreService.CheckCustomDomainName = {
  methodName: "CheckCustomDomainName",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.CustomDomainNameRequest,
  responseType: coreapi_pb.CheckCustomDomainNameResponse
};

KintoCoreService.EnablePublicURL = {
  methodName: "EnablePublicURL",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.EnablePublicURLRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoCoreService.DisablePublicURL = {
  methodName: "DisablePublicURL",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.DisablePublicURLRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoCoreService.StartTeleport = {
  methodName: "StartTeleport",
  service: KintoCoreService,
  requestStream: false,
  responseStream: true,
  requestType: coreapi_pb.TeleportRequest,
  responseType: coreapi_pb.TeleportResponse
};

KintoCoreService.SyncTime = {
  methodName: "SyncTime",
  service: KintoCoreService,
  requestStream: false,
  responseStream: false,
  requestType: coreapi_pb.SyncTimeRequest,
  responseType: coreapi_pb.SyncTimeResponse
};

exports.KintoCoreService = KintoCoreService;

function KintoCoreServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

KintoCoreServiceClient.prototype.getEnvironment = function getEnvironment(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.GetEnvironment, {
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

KintoCoreServiceClient.prototype.getEnvironments = function getEnvironments(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.GetEnvironments, {
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

KintoCoreServiceClient.prototype.createEnvironment = function createEnvironment(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.CreateEnvironment, {
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

KintoCoreServiceClient.prototype.updateEnvironment = function updateEnvironment(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.UpdateEnvironment, {
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

KintoCoreServiceClient.prototype.deleteEnvironment = function deleteEnvironment(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.DeleteEnvironment, {
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

KintoCoreServiceClient.prototype.createBlock = function createBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.CreateBlock, {
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

KintoCoreServiceClient.prototype.deployBlockUpdate = function deployBlockUpdate(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.DeployBlockUpdate, {
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

KintoCoreServiceClient.prototype.triggerDeploy = function triggerDeploy(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.TriggerDeploy, {
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

KintoCoreServiceClient.prototype.rollbackBlock = function rollbackBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.RollbackBlock, {
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

KintoCoreServiceClient.prototype.getBlocks = function getBlocks(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.GetBlocks, {
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

KintoCoreServiceClient.prototype.getBlock = function getBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.GetBlock, {
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

KintoCoreServiceClient.prototype.deleteBlock = function deleteBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.DeleteBlock, {
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

KintoCoreServiceClient.prototype.suspendBlock = function suspendBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.SuspendBlock, {
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

KintoCoreServiceClient.prototype.watchReleasesStatus = function watchReleasesStatus(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(KintoCoreService.WatchReleasesStatus, {
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

KintoCoreServiceClient.prototype.killBlockInstance = function killBlockInstance(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.KillBlockInstance, {
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

KintoCoreServiceClient.prototype.abortRelease = function abortRelease(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.AbortRelease, {
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

KintoCoreServiceClient.prototype.tagRelease = function tagRelease(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.TagRelease, {
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

KintoCoreServiceClient.prototype.promoteRelease = function promoteRelease(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.PromoteRelease, {
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

KintoCoreServiceClient.prototype.genReleaseConfigFromKintoFile = function genReleaseConfigFromKintoFile(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.GenReleaseConfigFromKintoFile, {
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

KintoCoreServiceClient.prototype.watchBuildLogs = function watchBuildLogs(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(KintoCoreService.WatchBuildLogs, {
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

KintoCoreServiceClient.prototype.updateBuildStatus = function updateBuildStatus(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.UpdateBuildStatus, {
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

KintoCoreServiceClient.prototype.updateBuildCommitSha = function updateBuildCommitSha(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.UpdateBuildCommitSha, {
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

KintoCoreServiceClient.prototype.watchBlocksHealthStatuses = function watchBlocksHealthStatuses(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(KintoCoreService.WatchBlocksHealthStatuses, {
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

KintoCoreServiceClient.prototype.watchJobsStatus = function watchJobsStatus(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(KintoCoreService.WatchJobsStatus, {
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

KintoCoreServiceClient.prototype.watchBlocksMetrics = function watchBlocksMetrics(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(KintoCoreService.WatchBlocksMetrics, {
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

KintoCoreServiceClient.prototype.watchConsoleLogs = function watchConsoleLogs(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(KintoCoreService.WatchConsoleLogs, {
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

KintoCoreServiceClient.prototype.getKintoConfiguration = function getKintoConfiguration(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.GetKintoConfiguration, {
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

KintoCoreServiceClient.prototype.createCustomDomainName = function createCustomDomainName(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.CreateCustomDomainName, {
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

KintoCoreServiceClient.prototype.deleteCustomDomainName = function deleteCustomDomainName(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.DeleteCustomDomainName, {
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

KintoCoreServiceClient.prototype.checkCustomDomainName = function checkCustomDomainName(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.CheckCustomDomainName, {
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

KintoCoreServiceClient.prototype.enablePublicURL = function enablePublicURL(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.EnablePublicURL, {
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

KintoCoreServiceClient.prototype.disablePublicURL = function disablePublicURL(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.DisablePublicURL, {
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

KintoCoreServiceClient.prototype.startTeleport = function startTeleport(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(KintoCoreService.StartTeleport, {
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

KintoCoreServiceClient.prototype.syncTime = function syncTime(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoCoreService.SyncTime, {
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

exports.KintoCoreServiceClient = KintoCoreServiceClient;

