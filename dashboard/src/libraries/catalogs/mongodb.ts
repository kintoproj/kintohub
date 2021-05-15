import CatalogScheme from 'types/catalog';

const CatalogSchemaPostgreSQL: CatalogScheme = {
  type: 'Database',
  name: 'MongoDB',
  key: 'mongodb',
  repo: 'https://github.com/kintoproj/catalog-mongodb',
  branch: 'master',
  tabs: [
    {
      label: 'Configurations',
      sections: [
        {
          fields: [
            {
              type: 'switch',
              key: 'auth.enabled',
              label: 'Authentication',
              desc:
                'Enable username and password. Cannot be modified after deployment.',
              default: true,
              editable: false,
            },
            {
              type: 'text',
              key: 'auth.username',
              label: 'Username',
              placeholder: 'default user',
              default: '',
              editable: false,
              enabledBy: 'auth.enabled',
              validation: {
                type: 'string',
                rules: [
                  {
                    type: 'username',
                  },
                ],
              },
            },
            {
              type: 'password',
              key: 'auth.password',
              label: 'Password',
              placeholder: 'default password',
              default: '',
              editable: false,
              enabledBy: 'auth.enabled',
              validation: {
                type: 'string',
                rules: [
                  {
                    type: 'password',
                  },
                ],
              },
              noWrap: true,
            },
            {
              type: 'text',
              key: 'auth.database',
              label: 'Default Database',
              desc: 'Default Database',
              placeholder: 'default: postgres',
              default: 'mongodb',
              editable: false,
              validation: {
                type: 'string',
                rules: [
                  {
                    type: 'username',
                  },
                ],
              },
              enabledBy: 'auth.enabled',
            },
            {
              type: 'password',
              key: 'auth.rootPassword',
              label: 'Root Password',
              placeholder: 'root password',
              default: '',
              editable: false,
              enabledBy: 'auth.enabled',
              validation: {
                type: 'string',
                rules: [
                  {
                    type: 'password',
                  },
                ],
              },
            },
            {
              type: 'slider',
              key: 'replicaCount',
              label: 'Replica Count',
              desc: 'Set the replicas for your node',
              default: 0,
              values: [1, 3, 5, 7, 9],
              unit: 'replica',
              editable: true,
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
              key: 'resources.requests.cpu',
              alias: ['resources.limits.cpu'],
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
      template: '{key}',
    },
    {
      type: 'template',
      label: 'Connection String',
      isConnectionString: true,
      disabledBy: ['auth.enabled'],
      template: 'mongodb://{key}/admin?replicaSet=rs0',
    },
    {
      type: 'template',
      label: 'Connection String (Root)',
      isConnectionString: true,
      enabledBy: ['auth.enabled'],
      template:
        'mongodb://root:{field.auth.rootPassword}@{key}/admin?replicaSet=rs0',
    },
    {
      type: 'template',
      label: 'Connection String',
      isConnectionString: true,
      enabledBy: ['auth.enabled'],
      template:
        'mongodb://{field.auth.username}:{field.auth.password}@{key}/{field.auth.database}?replicaSet=rs0',
    },
    {
      type: 'fieldRef',
      keyRef: 'auth.rootPassword',
    },
    {
      type: 'fieldRef',
      keyRef: 'auth.username',
    },
    {
      type: 'fieldRef',
      keyRef: 'auth.password',
    },
  ],
};

export default CatalogSchemaPostgreSQL;
