import CatalogScheme from 'types/catalog';

const CatalogSchemaMinio: CatalogScheme = {
  type: 'Storage',
  name: 'Minio',
  key: 'minio',
  repo: 'https://github.com/kintoproj/catalog-minio',
  branch: 'master',
  tabs: [
    {
      label: 'Configurations',
      sections: [
        {
          fields: [
            {
              type: 'password',
              key: 'global.minio.accessKey',
              label: 'Access Key',
              subType: 'secret',
              placeholder: 'access key',
              default: '',
              editable: false,
              validation: {
                type: 'string',
                rules: [
                  {
                    type: 'secret',
                  },
                ],
              },
            },
            {
              type: 'password',
              key: 'global.minio.secretKey',
              label: 'Secret Key',
              subType: 'secret',
              placeholder: 'secret key',
              default: '',
              editable: false,
              validation: {
                type: 'string',
                rules: [
                  {
                    type: 'secret',
                  },
                ],
              },
            },
            {
              type: 'switch',
              key: 'replication.enabled',
              label: 'Enable Replication',
              desc: 'Enable replication - running with multiple nodes',
              isProFeature: true,
              default: false,
              editable: false,
              mappings: [
                {
                  key: 'mode',
                  when: true,
                  mappedValue: 'distributed',
                },
                {
                  key: 'mode',
                  when: false,
                  mappedValue: 'standalone',
                },
              ],
            },
            {
              type: 'slider',
              key: 'statefulset.replicaCount',
              label: 'Replica Count',
              desc: 'Set the replicas for your node',
              default: 0,
              values: [4, 5, 6, 7, 8],
              unit: 'replica',
              unitGroup: 'slave',
              enabledBy: 'replication.enabled',
              editable: false,
            },
          ],
        },
      ],
    },
    {
      label: 'Advanced Settings',
      sections: [
        {
          fields: [
            {
              type: 'switch',
              key: 'persistence.enabled',
              label: 'Persistence',
              desc:
                'Enable the persistence volume. Disable this will lost all your data when restarting the pod.',
              default: true,
              editable: false,
            },
            {
              type: 'slider',
              key: 'persistence.size',
              label: 'Persistence Volume Size',
              desc: 'Storage size of your database per replica',
              default: 0, // this is the index
              values: [1, 5, 10, 20, 50, 100, 150, 200],
              enabledBy: 'persistence.enabled',
              unit: 'storage',
              editable: false,
            },
            {
              type: 'slider',
              key: 'resources.requests.memory',
              alias: ['resources.limits.memory'],
              label: 'Memory',
              desc: 'Memory limit for your running node',
              default: 0,
              values: [
                256,
                512,
                1024,
                2048,
                3072,
                4096,
                5120,
                6144,
                7168,
                8192,
              ],
              unit: 'memory',
              editable: true,
            },
            {
              type: 'slider',
              key: 'resources.requests.cpu',
              alias: ['resources.limits.cpu'],
              label: 'CPU',
              desc: 'Cpu limit for your running node',
              default: 0,
              values: [0.2, 0.5, 0.7, 1.0, 1.5, 2.0],
              unit: 'cpu',
              editable: true,
            },
            {
              type: 'system',
              key: 'pricing_calculator',
              label: 'Pricing Calculator',
              desc: 'THIS_IS_NOT_USED',
              editable: false,
              default: true,
            },
          ],
        },
      ],
    },
  ],
  access: [
    {
      type: 'template',
      label: 'Internal Hostname',
      template: '{key}',
    },
    {
      type: 'template',
      label: 'Connection String',
      isConnectionString: true,
      template: 'http://minio',
    },
    {
      type: 'fieldRef',
      keyRef: 'global.minio.accessKey',
    },
    {
      type: 'fieldRef',
      keyRef: 'global.minio.secretKey',
    },
  ],
};

export default CatalogSchemaMinio;
