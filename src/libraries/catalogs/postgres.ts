import CatalogScheme from 'types/catalog';

const CatalogSchemaPostgreSQL: CatalogScheme = {
  type: 'Database',
  name: 'PostgreSQL',
  key: 'postgresql',
  repo: 'https://github.com/kintoproj/catalog-postgresql',
  branch: 'master',
  tabs: [
    {
      label: 'Configurations',
      sections: [
        {
          fields: [
            {
              type: 'text',
              key: 'postgresqlUsername',
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
              key: 'postgresqlPassword',
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
              key: 'postgresqlDatabase',
              label: 'Default Database',
              desc: 'Default Database',
              placeholder: 'default: postgres',
              default: 'postgres',
              validation: {
                type: 'string',
                rules: [
                  {
                    type: 'username',
                  },
                ],
              },
              editable: false,
            },
            {
              type: 'password',
              key: 'postgresqlPostgresPassword',
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
              key: 'replication.slaveReplicas',
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
    {
      // https://www.postgresql.org/docs/8.0/runtime-config.html
      label: 'Extended Config',
      sections: [
        {
          fields: [
            {
              type: 'switch',
              key: 'config.enabled',
              label: 'Enable Config',
              desc:
                'Fine-tune the PostgreSQL configurations. This is only for experienced users and may causes severe error with incorrect values. You must restart your instance(s) to make the changes effective.',
              default: false,
              editable: false,
              isProFeature: true,
            },
            {
              type: 'text',
              key: 'image.registry',
              label: 'Image Registry',
              desc: 'Specify the image registry for the PostgreSQL image.',
              default: 'docker.io',
              enabledBy: 'config.enabled',
              alpha: true,
              editable: false,
            },
            {
              type: 'text',
              key: 'image.repository',
              label: 'Image Repository',
              desc: 'Specify the image repository for the PostgreSQL image.',
              default: 'bitnami/postgresql',
              enabledBy: 'config.enabled',
              alpha: true,
              editable: false,
            },
            {
              type: 'text',
              key: 'image.tag',
              label: 'Image Tag',
              desc: 'Specify the image tag for the PostgreSQL image.',
              default: '11.8.0-debian-10-r1',
              enabledBy: 'config.enabled',
              alpha: true,
              editable: false,
            },
            {
              type: 'switch',
              key: 'securityContext.enabled',
              label: 'Enable security context',
              desc:
                'Defines privilege and access control settings for the container.',
              default: true,
              enabledBy: 'config.enabled',
              alpha: true,
              editable: false,
            },
            {
              type: 'text',
              key: 'postgresqlExtendedConf.wal_level',
              label: 'wal_level',
              desc: 'Set the level of information written to the WAL.',
              default: 'replica',
              enabledBy: 'config.enabled',
              editable: true,
              alpha: true,
            },
            {
              type: 'text',
              key: 'postgresqlExtendedConf.max_connections',
              label: 'max_connections',
              desc: 'Sets the maximum number of concurrent connections.',
              default: '100',
              enabledBy: 'config.enabled',
              editable: true,
            },
            {
              type: 'text',
              key: 'postgresqlExtendedConf.shared_buffers',
              label: 'shared_buffers',
              desc:
                'Sets the number of shared memory buffers used by the server.',
              default: '8MB',
              enabledBy: 'config.enabled',
              editable: true,
            },
            {
              type: 'text',
              key: 'postgresqlExtendedConf.work_mem',
              label: 'work_mem',
              desc: 'Sets the maximum memory to be used for query workspaces.',
              default: '4MB',
              enabledBy: 'config.enabled',
              editable: true,
            },
            {
              type: 'text',
              key: 'postgresqlExtendedConf.maintenance_work_mem',
              label: 'maintenance_work_mem',
              desc:
                'Sets the maximum memory to be used for maintenance operations.',
              default: '64MB',
              enabledBy: 'config.enabled',
              editable: true,
            },
            {
              type: 'text',
              key: 'postgresqlExtendedConf.temp_buffers',
              label: 'temp_buffers',
              desc:
                'Sets the maximum number of temporary buffers used by each session.',
              default: '8MB',
              enabledBy: 'config.enabled',
              editable: true,
            },
            {
              type: 'text',
              key: 'postgresqlExtendedConf.deadlock_timeout',
              label: 'deadlock_timeout',
              desc:
                'Sets the time to wait on a lock before checking for deadlock.',
              default: '1s',
              enabledBy: 'config.enabled',
              editable: true,
            },
            {
              type: 'text',
              key: 'postgresqlExtendedConf.max_locks_per_transaction',
              label: 'max_locks_per_transaction',
              desc: 'Sets the maximum number of locks per transaction.',
              default: '64',
              enabledBy: 'config.enabled',
              editable: true,
            },
            {
              type: 'text',
              key: 'postgresqlExtendedConf.log_min_duration_statement',
              label: 'log_min_duration_statement',
              desc:
                'Sets the minimum execution time above which statements will be logged.',
              default: '-1ms',
              enabledBy: 'config.enabled',
              editable: true,
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
      template:
        'postgresql://postgres:{field.postgresqlPostgresPassword}@{key}/{field.postgresqlDatabase}',
    },
    {
      type: 'template',
      label: 'Connection String (User)',
      isConnectionString: true,
      template:
        'postgresql://{field.postgresqlUsername}:{field.postgresqlPassword}@{key}/{field.postgresqlDatabase}',
    },
    {
      type: 'template',
      label: 'Connection String to Read Replica (User)',
      enabledBy: ['replication.enabled'],
      isConnectionString: true,
      template:
        'postgresql://{field.postgresqlUsername}:{field.postgresqlPassword}@{key}-read/{field.postgresqlDatabase}',
    },
    {
      type: 'fieldRef',
      keyRef: 'postgresqlPostgresPassword',
    },
    {
      type: 'fieldRef',
      keyRef: 'postgresqlUsername',
    },
    {
      type: 'fieldRef',
      keyRef: 'postgresqlPassword',
    },
  ],
};

export default CatalogSchemaPostgreSQL;
