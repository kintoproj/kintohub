// package: 
// file: kintokubecore.proto

var kintokubecore_pb = require("./kintokubecore_pb");
var google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb");
var kkc_models_pb = require("./kkc_models_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var KintoKubeCoreService = (function () {
  function KintoKubeCoreService() {}
  KintoKubeCoreService.serviceName = "KintoKubeCoreService";
  return KintoKubeCoreService;
}());

KintoKubeCoreService.GetEnvironment = {
  methodName: "GetEnvironment",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.EnvironmentQueryRequest,
  responseType: kkc_models_pb.Environment
};

KintoKubeCoreService.GetEnvironments = {
  methodName: "GetEnvironments",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: google_protobuf_empty_pb.Empty,
  responseType: kkc_models_pb.Environments
};

KintoKubeCoreService.CreateEnvironment = {
  methodName: "CreateEnvironment",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.CreateEnvironmentRequest,
  responseType: kkc_models_pb.Environment
};

KintoKubeCoreService.UpdateEnvironment = {
  methodName: "UpdateEnvironment",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.UpdateEnvironmentRequest,
  responseType: kkc_models_pb.Environment
};

KintoKubeCoreService.DeleteEnvironment = {
  methodName: "DeleteEnvironment",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.DeleteEnvironmentRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoKubeCoreService.CreateBlock = {
  methodName: "CreateBlock",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.CreateBlockRequest,
  responseType: kintokubecore_pb.BlockUpdateResponse
};

KintoKubeCoreService.DeployBlockUpdate = {
  methodName: "DeployBlockUpdate",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.DeployBlockRequest,
  responseType: kintokubecore_pb.BlockUpdateResponse
};

KintoKubeCoreService.TriggerDeploy = {
  methodName: "TriggerDeploy",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.TriggerDeployRequest,
  responseType: kintokubecore_pb.BlockUpdateResponse
};

KintoKubeCoreService.RollbackBlock = {
  methodName: "RollbackBlock",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.RollbackBlockRequest,
  responseType: kintokubecore_pb.BlockUpdateResponse
};

KintoKubeCoreService.GetBlocks = {
  methodName: "GetBlocks",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.BlockQueryRequest,
  responseType: kkc_models_pb.Blocks
};

KintoKubeCoreService.GetBlock = {
  methodName: "GetBlock",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.BlockQueryRequest,
  responseType: kkc_models_pb.Block
};

KintoKubeCoreService.DeleteBlock = {
  methodName: "DeleteBlock",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.DeleteBlockRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoKubeCoreService.SuspendBlock = {
  methodName: "SuspendBlock",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.SuspendBlockRequest,
  responseType: kintokubecore_pb.BlockUpdateResponse
};

KintoKubeCoreService.WatchReleasesStatus = {
  methodName: "WatchReleasesStatus",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: true,
  requestType: kintokubecore_pb.BlockQueryRequest,
  responseType: kkc_models_pb.ReleasesStatus
};

KintoKubeCoreService.KillBlockInstance = {
  methodName: "KillBlockInstance",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.KillBlockInstanceRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoKubeCoreService.AbortRelease = {
  methodName: "AbortRelease",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.AbortBlockReleaseRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoKubeCoreService.TagRelease = {
  methodName: "TagRelease",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.TagReleaseRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoKubeCoreService.PromoteRelease = {
  methodName: "PromoteRelease",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.PromoteReleaseRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoKubeCoreService.GenReleaseConfigFromKintoFile = {
  methodName: "GenReleaseConfigFromKintoFile",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.GenReleaseConfigFromKintoFileRepoRequest,
  responseType: kkc_models_pb.ReleaseConfig
};

KintoKubeCoreService.WatchBuildLogs = {
  methodName: "WatchBuildLogs",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: true,
  requestType: kintokubecore_pb.WatchBuildLogsRequest,
  responseType: kkc_models_pb.Logs
};

KintoKubeCoreService.UpdateBuildStatus = {
  methodName: "UpdateBuildStatus",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.UpdateBuildStatusRequest,
  responseType: kintokubecore_pb.UpdateBuildStatusResponse
};

KintoKubeCoreService.UpdateBuildCommitSha = {
  methodName: "UpdateBuildCommitSha",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.UpdateBuildCommitShaRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoKubeCoreService.WatchBlocksHealthStatuses = {
  methodName: "WatchBlocksHealthStatuses",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: true,
  requestType: kintokubecore_pb.EnvironmentQueryRequest,
  responseType: kkc_models_pb.BlockStatuses
};

KintoKubeCoreService.WatchJobsStatus = {
  methodName: "WatchJobsStatus",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: true,
  requestType: kintokubecore_pb.BlockQueryRequest,
  responseType: kkc_models_pb.JobStatus
};

KintoKubeCoreService.WatchBlocksMetrics = {
  methodName: "WatchBlocksMetrics",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: true,
  requestType: kintokubecore_pb.BlockQueryRequest,
  responseType: kkc_models_pb.BlocksMetrics
};

KintoKubeCoreService.WatchConsoleLogs = {
  methodName: "WatchConsoleLogs",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: true,
  requestType: kintokubecore_pb.WatchConsoleLogsRequest,
  responseType: kkc_models_pb.ConsoleLog
};

KintoKubeCoreService.GetKintoConfiguration = {
  methodName: "GetKintoConfiguration",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: google_protobuf_empty_pb.Empty,
  responseType: kkc_models_pb.KintoConfiguration
};

KintoKubeCoreService.CreateCustomDomainName = {
  methodName: "CreateCustomDomainName",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.CustomDomainNameRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoKubeCoreService.DeleteCustomDomainName = {
  methodName: "DeleteCustomDomainName",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.CustomDomainNameRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoKubeCoreService.CheckCustomDomainName = {
  methodName: "CheckCustomDomainName",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.CustomDomainNameRequest,
  responseType: kintokubecore_pb.CheckCustomDomainNameResponse
};

KintoKubeCoreService.EnablePublicURL = {
  methodName: "EnablePublicURL",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.EnablePublicURLRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoKubeCoreService.DisablePublicURL = {
  methodName: "DisablePublicURL",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.DisablePublicURLRequest,
  responseType: google_protobuf_empty_pb.Empty
};

KintoKubeCoreService.StartTeleport = {
  methodName: "StartTeleport",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: true,
  requestType: kintokubecore_pb.TeleportRequest,
  responseType: kintokubecore_pb.TeleportResponse
};

KintoKubeCoreService.SyncTime = {
  methodName: "SyncTime",
  service: KintoKubeCoreService,
  requestStream: false,
  responseStream: false,
  requestType: kintokubecore_pb.SyncTimeRequest,
  responseType: kintokubecore_pb.SyncTimeResponse
};

exports.KintoKubeCoreService = KintoKubeCoreService;

function KintoKubeCoreServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

KintoKubeCoreServiceClient.prototype.getEnvironment = function getEnvironment(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.GetEnvironment, {
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

KintoKubeCoreServiceClient.prototype.getEnvironments = function getEnvironments(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.GetEnvironments, {
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

KintoKubeCoreServiceClient.prototype.createEnvironment = function createEnvironment(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.CreateEnvironment, {
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

KintoKubeCoreServiceClient.prototype.updateEnvironment = function updateEnvironment(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.UpdateEnvironment, {
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

KintoKubeCoreServiceClient.prototype.deleteEnvironment = function deleteEnvironment(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.DeleteEnvironment, {
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

KintoKubeCoreServiceClient.prototype.createBlock = function createBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.CreateBlock, {
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

KintoKubeCoreServiceClient.prototype.deployBlockUpdate = function deployBlockUpdate(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.DeployBlockUpdate, {
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

KintoKubeCoreServiceClient.prototype.triggerDeploy = function triggerDeploy(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.TriggerDeploy, {
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

KintoKubeCoreServiceClient.prototype.rollbackBlock = function rollbackBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.RollbackBlock, {
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

KintoKubeCoreServiceClient.prototype.getBlocks = function getBlocks(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.GetBlocks, {
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

KintoKubeCoreServiceClient.prototype.getBlock = function getBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.GetBlock, {
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

KintoKubeCoreServiceClient.prototype.deleteBlock = function deleteBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.DeleteBlock, {
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

KintoKubeCoreServiceClient.prototype.suspendBlock = function suspendBlock(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.SuspendBlock, {
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

KintoKubeCoreServiceClient.prototype.watchReleasesStatus = function watchReleasesStatus(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(KintoKubeCoreService.WatchReleasesStatus, {
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

KintoKubeCoreServiceClient.prototype.killBlockInstance = function killBlockInstance(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.KillBlockInstance, {
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

KintoKubeCoreServiceClient.prototype.abortRelease = function abortRelease(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.AbortRelease, {
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

KintoKubeCoreServiceClient.prototype.tagRelease = function tagRelease(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.TagRelease, {
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

KintoKubeCoreServiceClient.prototype.promoteRelease = function promoteRelease(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.PromoteRelease, {
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

KintoKubeCoreServiceClient.prototype.genReleaseConfigFromKintoFile = function genReleaseConfigFromKintoFile(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.GenReleaseConfigFromKintoFile, {
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

KintoKubeCoreServiceClient.prototype.watchBuildLogs = function watchBuildLogs(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(KintoKubeCoreService.WatchBuildLogs, {
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

KintoKubeCoreServiceClient.prototype.updateBuildStatus = function updateBuildStatus(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.UpdateBuildStatus, {
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

KintoKubeCoreServiceClient.prototype.updateBuildCommitSha = function updateBuildCommitSha(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.UpdateBuildCommitSha, {
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

KintoKubeCoreServiceClient.prototype.watchBlocksHealthStatuses = function watchBlocksHealthStatuses(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(KintoKubeCoreService.WatchBlocksHealthStatuses, {
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

KintoKubeCoreServiceClient.prototype.watchJobsStatus = function watchJobsStatus(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(KintoKubeCoreService.WatchJobsStatus, {
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

KintoKubeCoreServiceClient.prototype.watchBlocksMetrics = function watchBlocksMetrics(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(KintoKubeCoreService.WatchBlocksMetrics, {
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

KintoKubeCoreServiceClient.prototype.watchConsoleLogs = function watchConsoleLogs(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(KintoKubeCoreService.WatchConsoleLogs, {
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

KintoKubeCoreServiceClient.prototype.getKintoConfiguration = function getKintoConfiguration(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.GetKintoConfiguration, {
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

KintoKubeCoreServiceClient.prototype.createCustomDomainName = function createCustomDomainName(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.CreateCustomDomainName, {
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

KintoKubeCoreServiceClient.prototype.deleteCustomDomainName = function deleteCustomDomainName(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.DeleteCustomDomainName, {
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

KintoKubeCoreServiceClient.prototype.checkCustomDomainName = function checkCustomDomainName(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.CheckCustomDomainName, {
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

KintoKubeCoreServiceClient.prototype.enablePublicURL = function enablePublicURL(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.EnablePublicURL, {
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

KintoKubeCoreServiceClient.prototype.disablePublicURL = function disablePublicURL(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.DisablePublicURL, {
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

KintoKubeCoreServiceClient.prototype.startTeleport = function startTeleport(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(KintoKubeCoreService.StartTeleport, {
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

KintoKubeCoreServiceClient.prototype.syncTime = function syncTime(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(KintoKubeCoreService.SyncTime, {
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

exports.KintoKubeCoreServiceClient = KintoKubeCoreServiceClient;

