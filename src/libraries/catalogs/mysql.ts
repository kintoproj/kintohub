import CatalogScheme from 'types/catalog';

const CatalogSchemaPostgreSQL: CatalogScheme = {
  type: 'Database',
  name: 'MySQL',
  key: 'mysql',
  repo: 'https://github.com/kintoproj/catalog-mysql',
  branch: 'master',
  tabs: [
    {
      label: 'Configurations',
      sections: [
        {
          fields: [
            {
              type: 'text',
              key: 'db.user',
              label: 'Username',
              placeholder: 'default user',
              default: '',
              editable: false,
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
              key: 'db.password',
              label: 'Password',
              placeholder: 'default password',
              default: '',
              editable: false,
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
              key: 'db.name',
              label: 'Default Database',
              desc: 'Default Database',
              placeholder: 'default: my_database',
              default: 'my_database',
              editable: false,
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
              key: 'root.password',
              label: 'Root Password',
              placeholder: 'root password',
              default: '',
              editable: false,
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
              type: 'switch',
              key: 'replication.enabled',
              label: 'Replication',
              desc: 'Enable replication - running with slave nodes.',
              default: false,
              editable: false,
            },
            {
              type: 'slider',
              key: 'slave.replicas',
              label: 'Replica Count',
              desc: 'Set the number of slave nodes',
              default: 0,
              values: [1, 2, 3, 4, 5],
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
              key: 'master.persistence.enabled',
              alias: ['slave.persistence.enabled'],
              label: 'Persistence',
              desc:
                'Enable the persistence volume. Disable this will lost all your data when restarting the pod.',
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
              default: 0,
              values: [512, 1024, 2048, 3072, 4096, 5120, 6144, 7168, 8192],
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
      label: 'Connection String (Admin)',
      isConnectionString: true,
      template: 'mysql://root:{field.root.password}@{key}/',
    },
    {
      type: 'template',
      label: 'Connection String (User)',
      isConnectionString: true,
      template:
        'mysql://{field.db.user}:{field.db.password}@{key}/{field.db.name}',
    },
    {
      type: 'fieldRef',
      keyRef: 'root.password',
    },
    {
      type: 'fieldRef',
      keyRef: 'db.user',
    },
    {
      type: 'fieldRef',
      keyRef: 'db.password',
    },
    {
      type: 'fieldRef',
      keyRef: 'db.name',
    },
  ],
};

export default CatalogSchemaPostgreSQL;
