import CopyTextField from 'components/atoms/CopyTextField';
import DoneButton from 'components/atoms/DoneButton';
import FormikTextField from 'components/atoms/FormikTextField';
import { FlexEndRow } from 'components/atoms/Row';
import SolidIconButton from 'components/atoms/SolidIconButton';
import { VerticalSpacer } from 'components/atoms/Spacer';
import { Formik, FormikProps } from 'formik';
import { updateEnvironment } from 'libraries/grpc/environment';
import { trackError } from 'libraries/helpers';
import { EnvNameSchema } from 'libraries/helpers/yup';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateEnvName } from 'states/auth/actions';
import { Environment } from 'types/environment';
import * as Yup from 'yup';

import FormHelperText from '@material-ui/core/FormHelperText';
import { useGRPCWrapper } from '../../templates/GRPCWrapper';

type Props = {
  env: Environment;
};

type EnvValues = {
  name: string;
};

export default ({ env }: Props) => {
  const grpcWrapper = useGRPCWrapper();

  const [error, setError] = useState<string | null>(null);
  const [updated, setUpdated] = useState(false);
  const dispatch = useDispatch();

  return (
    <Formik<EnvValues>
      initialValues={{
        name: env.name,
      }}
      validationSchema={Yup.object({
        name: EnvNameSchema,
      })}
      onSubmit={async (values, actions) => {
        setError(null);
        try {
          await grpcWrapper(updateEnvironment, {
            envId: env.envId,
            envName: values.name,
          });
          setUpdated(true);
          dispatch(updateEnvName(env.envId, values.name));
          // restore to save button after 1s
          setTimeout(() => {
            setUpdated(false);
          }, 1000);
        } catch (err) {
          trackError('UPDATE_ENV', err);
          setError(err.message);
        } finally {
          actions.setSubmitting(false);
        }
      }}
    >
      {(formikProps: FormikProps<EnvValues>) => {
        return (
          <div>
            <form onSubmit={formikProps.handleSubmit}>
              <FormikTextField
                variant="outlined"
                label="Environment Name"
                name="name"
                fullWidth={true}
              />
              <VerticalSpacer size={16} />
              <CopyTextField
                label="Environment ID"
                value={env.envId}
                displayValue={env.envId}
                fullWidth={true}
                contentEditable={false}
              />
              {error && (
                <>
                  <FormHelperText variant="filled" error={true}>
                    {error}
                  </FormHelperText>
                </>
              )}
              <VerticalSpacer size={24} />

              <FlexEndRow>
                {updated ? (
                  <DoneButton
                    data-cy="update-end-success-button"
                    text="Saved"
                    noPadding={true}
                  />
                ) : (
                  <SolidIconButton
                    data-cy="update-env-button"
                    text="Save"
                    type="submit"
                    isLoading={formikProps.isSubmitting}
                    disabled={!formikProps.dirty}
                  />
                )}
              </FlexEndRow>
            </form>
          </div>
        );
      }}
    </Formik>
  );
};
