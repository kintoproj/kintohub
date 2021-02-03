import React from 'react';
import { EditServicePageValues } from 'types/service';
import { FormikProps } from 'formik';
import FormikTextField from 'components/atoms/FormikTextField';
import { VerticalSpacer } from 'components/atoms/Spacer';
import 'types/proto.extend/block';
import FormikSelect, { InputProps } from 'components/atoms/FormikSelect';
import 'types/yup';
import { BuildConfig } from 'types/proto/kkc_models_pb';
import {
  getLanguageNameByType,
  getBuildCmdPlaceholderByLang,
  getRunCmdPlaceholderByLang,
  getLanguageVersionsFromConfig,
} from 'libraries/helpers/service';
import TwoColumns from 'components/atoms/TwoColumns';
import { KintoConfig } from 'types';
import styled from 'styled-components';

const StyledDiv = styled.div`
  .MuiFormLabel-root {
    background-color: ${(props) => props.theme.palette.background.default};
  }
`;

const LANG_OPTS: InputProps[] = [
  BuildConfig.Language.DOCKERFILE,
  BuildConfig.Language.GOLANG,
  BuildConfig.Language.NODEJS,
  BuildConfig.Language.JAVA,
  BuildConfig.Language.PHP,
  BuildConfig.Language.PYTHON,
  BuildConfig.Language.RUBY,
  BuildConfig.Language.RUST,
  BuildConfig.Language.ELIXIR,
].map((lang) => ({
  label: getLanguageNameByType(lang),
  value: lang,
  disabled: false,
}));

type Props = {
  config: KintoConfig;
  withPort: boolean;
  isStaticWebsite?: boolean;
  disabled?: boolean;
} & FormikProps<EditServicePageValues>;

export default ({
  config,
  withPort,
  isStaticWebsite,
  disabled,
  ...formikProps
}: Props) => {
  // For static website we allow only nodejs/golang/ruby
  const availableLanguages = isStaticWebsite
    ? LANG_OPTS.filter(
        (l) =>
          l.value === BuildConfig.Language.NODEJS ||
          l.value === BuildConfig.Language.RUBY ||
          l.value === BuildConfig.Language.GOLANG
      )
    : LANG_OPTS;
  return (
    <StyledDiv>
      <TwoColumns layout="EVEN" responsive>
        <FormikSelect
          name="language"
          label="Language"
          variant="outlined"
          type="number"
          handleChange={(evt) => {
            formikProps.setFieldValue(
              'language',
              parseInt(evt.target.value, 10)
            );
          }}
          handleBlur={formikProps.handleBlur}
          options={availableLanguages}
          disabled={disabled}
        />
      </TwoColumns>

      <VerticalSpacer size={40} />
      {formikProps.values.language === BuildConfig.Language.DOCKERFILE && (
        <>
          <TwoColumns layout="EVEN" responsive>
            <FormikTextField
              name="dockerfile"
              label="Dockerfile Name"
              placeholder="e.g. Dockerfile"
              variant="outlined"
              disabled={disabled}
            />
          </TwoColumns>
          <VerticalSpacer size={40} />
        </>
      )}
      {/* Show when language != dockerfiles */}
      {formikProps.values.language !== BuildConfig.Language.DOCKERFILE && (
        <>
          <TwoColumns layout="EVEN" responsive>
            <FormikSelect
              allowEmpty={true}
              name="languageVersion"
              label="Language Version"
              variant="outlined"
              type="number"
              handleChange={formikProps.handleChange}
              handleBlur={formikProps.handleBlur}
              options={getLanguageVersionsFromConfig(
                config,
                formikProps.values.language
              ).map(({ label, value }) => ({
                label,
                value,
                disabled: false,
              }))}
              disabled={disabled}
            />
          </TwoColumns>
          <VerticalSpacer size={40} />
          <TwoColumns layout="EVEN" responsive>
            <FormikTextField
              name="buildCommand"
              label="Build Command"
              placeholder={getBuildCmdPlaceholderByLang(
                formikProps.values.language
              )}
              variant="outlined"
              disabled={disabled}
            />
          </TwoColumns>
          <VerticalSpacer size={40} />
          {!isStaticWebsite && (
            <>
              <TwoColumns layout="EVEN" responsive>
                <FormikTextField
                  name="startCommand"
                  label="Start Command"
                  placeholder={getRunCmdPlaceholderByLang(
                    formikProps.values.language
                  )}
                  variant="outlined"
                  disabled={disabled}
                />
              </TwoColumns>
              <VerticalSpacer size={40} />
            </>
          )}
        </>
      )}

      <TwoColumns layout="EVEN" responsive>
        <FormikTextField
          name="subfolderPath"
          label="Subfolder Path"
          variant="outlined"
          disabled={disabled}
        />
      </TwoColumns>
      <VerticalSpacer size={40} />

      {withPort && (
        <TwoColumns layout="EVEN" responsive>
          <FormikTextField
            name="port"
            label="Port"
            variant="outlined"
            disabled={disabled}
          />
        </TwoColumns>
      )}
    </StyledDiv>
  );
};
