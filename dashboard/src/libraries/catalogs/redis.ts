import CatalogScheme from 'types/catalog';

const CatalogSchemaRedisSQL: CatalogScheme = {
  type: 'Database',
  name: 'Redis',
  key: 'redis',
  repo: 'https://github.com/kintoproj/catalog-redis',
  branch: 'master',
  tabs: [
    {
      label: 'Configurations',
      sections: [
        {
          fields: [
            {
              type: 'switch',
              key: 'cluster.enabled',
              label: 'Replication',
              desc: 'Enable replication - running with slave nodes.',
              default: false,
              editable: true,
              isProFeature: true,
            },
            {
              type: 'slider',
              key: 'cluster.slaveCount',
              label: 'Slave Count',
              desc: 'Set the number of slave nodes',
              default: 0,
              enabledBy: 'cluster.enabled',
              values: [1, 2, 3, 4, 5],
              unit: 'replica',
              unitGroup: 'slave',
              editable: true,
            },
            {
              type: 'switch',
              key: 'usePassword',
              label: 'Authentication',
              desc: 'Enable password. Cannot be modified after deployment.',
              default: true,
              editable: false,
            },
            {
              type: 'password',
              key: 'password',
              label: 'Password',
              placeholder: 'default password',
              default: '',
              editable: false,
              enabledBy: 'usePassword',
              validation: {
                type: 'string',
                rules: [
                  {
                    type: 'password',
                  },
                ],
              },
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
              key: 'master.persistence.enabled',
              alias: ['slave.persistence.enabled'],
              label: 'Persistence',
              desc:
                'Enable the persistence volume for master. Disable this will lost all your data when restarting the pod.',
              default: true,
              editable: false,
            },
            {
              type: 'slider',
              key: 'master.persistence.size',
              alias: ['slave.persistence.size'],
              label: 'Persistence Volume Size',
              desc: 'Storage size of your database per replica',
              default: 0, // this is the index
              values: [1, 5, 10, 20, 50, 100, 150, 200],
              enabledBy: 'master.persistence.enabled',
              unit: 'storage',
              editable: false,
            },
            {
              type: 'slider',
              key: 'master.resources.requests.memory',
              alias: [
                'master.resources.limits.memory',
                'slave.resources.requests.memory',
                'slave.resources.limits.memory',
              ],
              label: 'Memory',
              desc: 'Memory limit for your running node',
              default: 2,
              values: [
                64,
                128,
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
              key: 'master.resources.requests.cpu',
              alias: [
                'master.resources.limits.cpu',
                'slave.resources.requests.cpu',
                'slave.resources.limits.cpu',
              ],
              label: 'CPU',
              desc: 'Cpu limit for your running node',
              default: 0,
              values: [0.1, 0.2, 0.5, 0.7, 1.0, 1.5, 2.0],
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
      template: '{key}-master',
    },
    {
      type: 'template',
      label: 'Connection String',
      isConnectionString: true,
      disabledBy: ['cluster.enabled'],
      template: 'redis://{key}-master/0',
    },
    {
      type: 'template',
      label: 'Connection String (Master)',
      isConnectionString: true,
      enabledBy: ['cluster.enabled', 'usePassword'],
      template: 'redis://:{field.password}@{key}-master/0',
    },
    {
      type: 'template',
      label: 'Connection String (Slave)',
      isConnectionString: true,
      enabledBy: ['cluster.enabled', 'usePassword'],
      template: 'redis://:{field.password}@{key}-slave/0',
    },
    {
      type: 'template',
      label: 'Connection String (Master)',
      isConnectionString: true,
      enabledBy: ['cluster.enabled'],
      disabledBy: ['usePassword'],
      template: 'redis://{key}-master/0',
    },
    {
      type: 'template',
      label: 'Connection String (Slave)',
      isConnectionString: true,
      enabledBy: ['cluster.enabled'],
      disabledBy: ['usePassword'],
      template: 'redis://{key}-slave/0',
    },
    {
      type: 'fieldRef',
      keyRef: 'password',
    },
  ],
};

export default CatalogSchemaRedisSQL;
